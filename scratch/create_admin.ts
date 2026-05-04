import { db } from "../lib/db"

async function createAdmin() {
  try {
    await db.query(
      "INSERT INTO users (email, password_hash, first_name, last_name, name, role) VALUES (?, ?, ?, ?, ?, ?)", 
      ["admin@edusmart.sn", "admin123", "Global", "Admin", "Global Admin", "univ_admin"]
    )
    console.log("✅ Admin créé !")
    console.log("Email: admin@edusmart.sn")
    console.log("Password: admin123")
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

createAdmin()
