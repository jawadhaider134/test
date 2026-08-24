import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { loadDb, saveDb, nextId } from './db.js'
import { signToken, publicUser, requireAuth, requireAdmin } from './auth.js'

const app = express()
app.use(cors())
app.use(express.json())

const db = loadDb()

// ---------- Auth ----------
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' })
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'An account with this email already exists' })
  const user = {
    id: nextId(db.users),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'customer',
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  saveDb()
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase())
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash))
    return res.status(401).json({ error: 'Invalid email or password' })
  res.json({ token: signToken(user), user: publicUser(user) })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

// ---------- Products ----------
app.get('/api/products', (req, res) => {
  const { gender, subcategory, brand, search, sale, isNew, isTop, sort, minPrice, maxPrice } = req.query
  let items = [...db.products]
  if (gender) items = items.filter((p) => p.gender === gender)
  if (subcategory) items = items.filter((p) => p.subcategory === subcategory)
  if (brand) items = items.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase())
  if (sale === 'true') items = items.filter((p) => p.salePrice != null)
  if (isNew === 'true') items = items.filter((p) => p.isNew)
  if (isTop === 'true') items = items.filter((p) => p.isTop)
  if (search) {
    const q = String(search).toLowerCase()
    items = items.filter((p) => `${p.brand} ${p.name} ${p.subcategory}`.toLowerCase().includes(q))
  }
  const effective = (p) => p.salePrice ?? p.price
  if (minPrice) items = items.filter((p) => effective(p) >= Number(minPrice))
  if (maxPrice) items = items.filter((p) => effective(p) <= Number(maxPrice))
  if (sort === 'price_asc') items.sort((a, b) => effective(a) - effective(b))
  else if (sort === 'price_desc') items.sort((a, b) => effective(b) - effective(a))
  else if (sort === 'newest') items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ products: items, total: items.length })
})

app.get('/api/products/meta', (req, res) => {
  const brands = [...new Set(db.products.map((p) => p.brand))].sort()
  const subcategories = {}
  for (const p of db.products) {
    subcategories[p.gender] = subcategories[p.gender] || new Set()
    subcategories[p.gender].add(p.subcategory)
  }
  res.json({
    brands,
    subcategories: Object.fromEntries(Object.entries(subcategories).map(([g, s]) => [g, [...s]])),
  })
})

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find((p) => p.id === Number(req.params.id))
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json({ product })
})

// ---------- Orders ----------
app.post('/api/orders', requireAuth, (req, res) => {
  const { items, shippingAddress } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Order items are required' })
  const orderItems = []
  for (const item of items) {
    const product = db.products.find((p) => p.id === Number(item.productId))
    if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` })
    const quantity = Math.max(1, Number(item.quantity) || 1)
    orderItems.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      size: item.size || null,
      quantity,
      unitPrice: product.salePrice ?? product.price,
    })
  }
  const total = Math.round(orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) * 100) / 100
  const order = {
    id: nextId(db.orders),
    userId: req.user.id,
    items: orderItems,
    total,
    shippingAddress: shippingAddress || null,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.orders.push(order)
  saveDb()
  res.status(201).json({ order })
})

app.get('/api/orders', requireAuth, (req, res) => {
  res.json({ orders: db.orders.filter((o) => o.userId === req.user.id).reverse() })
})

// ---------- Admin ----------
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const revenue = Math.round(db.orders.reduce((sum, o) => sum + o.total, 0) * 100) / 100
  res.json({
    products: db.products.length,
    orders: db.orders.length,
    users: db.users.length,
    revenue,
    recentOrders: [...db.orders].reverse().slice(0, 5),
  })
})

app.post('/api/admin/products', requireAdmin, (req, res) => {
  const { name, brand, gender, subcategory, price } = req.body || {}
  if (!name || !brand || !gender || !subcategory || price == null)
    return res.status(400).json({ error: 'name, brand, gender, subcategory and price are required' })
  const product = {
    id: nextId(db.products),
    name,
    brand,
    gender,
    subcategory,
    description: req.body.description || '',
    price: Number(price),
    salePrice: req.body.salePrice != null && req.body.salePrice !== '' ? Number(req.body.salePrice) : null,
    colors: req.body.colors || [],
    sizes: req.body.sizes || [],
    images: req.body.images?.length ? req.body.images : [`https://picsum.photos/seed/ay-new-${Date.now()}/600/800`],
    stock: Number(req.body.stock) || 0,
    isNew: Boolean(req.body.isNew),
    isTop: Boolean(req.body.isTop),
    createdAt: new Date().toISOString(),
  }
  db.products.push(product)
  saveDb()
  res.status(201).json({ product })
})

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const product = db.products.find((p) => p.id === Number(req.params.id))
  if (!product) return res.status(404).json({ error: 'Product not found' })
  const fields = ['name', 'brand', 'gender', 'subcategory', 'description', 'colors', 'sizes', 'images', 'isNew', 'isTop']
  for (const f of fields) if (req.body[f] !== undefined) product[f] = req.body[f]
  if (req.body.price !== undefined) product.price = Number(req.body.price)
  if (req.body.stock !== undefined) product.stock = Number(req.body.stock)
  if (req.body.salePrice !== undefined)
    product.salePrice = req.body.salePrice === null || req.body.salePrice === '' ? null : Number(req.body.salePrice)
  saveDb()
  res.json({ product })
})

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const index = db.products.findIndex((p) => p.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Product not found' })
  db.products.splice(index, 1)
  saveDb()
  res.json({ ok: true })
})

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const orders = [...db.orders].reverse().map((o) => ({
    ...o,
    customer: publicUser(db.users.find((u) => u.id === o.userId) || { name: 'Unknown', email: '' }),
  }))
  res.json({ orders })
})

app.put('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const order = db.orders.find((o) => o.id === Number(req.params.id))
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const allowed = ['pending', 'shipped', 'delivered', 'cancelled']
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status' })
  order.status = req.body.status
  saveDb()
  res.json({ order })
})

app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json({ users: db.users.map(publicUser) })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`))
