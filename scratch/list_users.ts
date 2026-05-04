import { db } from "../lib/db"

async function listCredentials() {
  try {
    const [users]: any = await db.query("SELECT email, password_hash, role FROM users")
    console.log("--- Identifiants Disponibles ---")
    console.table(users)
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    process.exit()
  }
}

listCredentials()
