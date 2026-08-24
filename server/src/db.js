import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createSeedData } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json')

let db

export function loadDb() {
  if (db) return db
  if (fs.existsSync(DB_PATH)) {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
  } else {
    db = createSeedData()
    saveDb()
  }
  return db
}

export function saveDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
