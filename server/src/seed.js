import bcrypt from 'bcryptjs'

const IMG = (seed) => `https://picsum.photos/seed/${seed}/600/800`

const BRANDS = [
  'ONLY', 'VERO MODA', 'PIECES', 'NA-KD', 'Calvin Klein', 'PUMA',
  'ADIDAS ORIGINALS', 'Tommy Hilfiger', 'LEVI\'S', 'Nike Sportswear',
  'JACK & JONES', 'HUGO', 'GUESS', 'Mavi', 'AMERICAN VINTAGE', 'Public Desire',
]

const CATALOG = {
  women: {
    clothing: ['Ribbed Knit Sweater', 'Oversized Blazer', 'Mom Jeans', 'Satin Midi Dress', 'Denim Jacket', 'Pleated Skirt', 'Basic T-Shirt', 'Trench Coat', 'Leather Pants', 'Wrap Blouse'],
    shoes: ['White Sneakers', 'Chelsea Ankle Boots', 'Strappy Heels', 'Platform Sandals', 'Running Shoes', 'Ballerina Flats'],
    accessories: ['Shoulder Bag', 'Gold Hoop Earrings', 'Silk Scarf', 'Leather Belt', 'Bucket Hat', 'Crossbody Bag'],
    sportswear: ['Seamless Leggings', 'Sports Bra', 'Training Jacket', 'Yoga Top'],
  },
  men: {
    clothing: ['Slim Fit Jeans', 'Oxford Shirt', 'Crewneck Sweatshirt', 'Chino Pants', 'Puffer Jacket', 'Polo Shirt', 'Wool Overcoat', 'Cargo Pants', 'Basic Hoodie', 'Flannel Shirt'],
    shoes: ['Leather Sneakers', 'Derby Shoes', 'Hiking Boots', 'Slip-On Loafers', 'Canvas Sneakers', 'Running Trainers'],
    accessories: ['Leather Wallet', 'Chronograph Watch', 'Baseball Cap', 'Knit Beanie', 'Sunglasses', 'Weekender Bag'],
    sportswear: ['Training Shorts', 'Performance T-Shirt', 'Track Jacket', 'Compression Tights'],
  },
  kids: {
    clothing: ['Dinosaur Print T-Shirt', 'Denim Dungarees', 'Rainbow Hoodie', 'Jogger Pants', 'Puffer Vest', 'Striped Longsleeve'],
    shoes: ['Velcro Sneakers', 'Rain Boots', 'Light-Up Trainers', 'Canvas Slip-Ons'],
    accessories: ['Animal Backpack', 'Bobble Hat', 'Mittens Set'],
    sportswear: ['Football Jersey', 'Tracksuit Set'],
  },
}

const COLORS = ['Black', 'White', 'Beige', 'Navy', 'Grey', 'Green', 'Red', 'Pink']
const SIZES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL'],
  sportswear: ['XS', 'S', 'M', 'L', 'XL'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  accessories: ['One Size'],
}

function seedProducts() {
  const products = []
  let id = 1
  for (const [gender, subcats] of Object.entries(CATALOG)) {
    for (const [subcategory, names] of Object.entries(subcats)) {
      names.forEach((name, i) => {
        const brand = BRANDS[(id * 7 + i) % BRANDS.length]
        const price = Math.round((19.99 + ((id * 37) % 120)) * 100) / 100
        const onSale = id % 4 === 0
        products.push({
          id: id,
          name,
          brand,
          gender,
          subcategory,
          description: `${brand} ${name} — a wardrobe essential crafted with quality materials for everyday comfort and style. Free shipping and 30 day return policy.`,
          price,
          salePrice: onSale ? Math.round(price * 0.7 * 100) / 100 : null,
          colors: [COLORS[id % COLORS.length], COLORS[(id + 3) % COLORS.length]],
          sizes: SIZES[subcategory],
          images: [IMG(`ay-${id}-a`), IMG(`ay-${id}-b`), IMG(`ay-${id}-c`)],
          stock: 5 + ((id * 13) % 60),
          isNew: id % 5 === 0,
          isTop: id % 3 === 0,
          createdAt: new Date(Date.now() - id * 86400000).toISOString(),
        })
        id++
      })
    }
  }
  return products
}

export function createSeedData() {
  return {
    products: seedProducts(),
    users: [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@aboutyou.com',
        passwordHash: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Demo Customer',
        email: 'customer@example.com',
        passwordHash: bcrypt.hashSync('customer123', 10),
        role: 'customer',
        createdAt: new Date().toISOString(),
      },
    ],
    orders: [],
  }
}
