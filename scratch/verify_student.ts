import { db } from "../lib/db"

async function verifyStudent() {
  try {
    const [rows]: any = await db.query("SELECT email, password, password_hash FROM users WHERE email = 'student@edusmart.sn'")
    console.log("Vérification pour student@edusmart.sn:")
    console.table(rows)
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

verifyStudent()
