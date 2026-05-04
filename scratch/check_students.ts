import { db } from "../lib/db"

async function checkStudents() {
  try {
    const [students]: any = await db.query("SELECT * FROM etudiants")
    console.log("--- Contenu de la table 'etudiants' ---")
    console.table(students)
    
    const [users]: any = await db.query("SELECT id, name, email, role, etablissement_id FROM users WHERE role = 'student'")
    console.log("--- Contenu de la table 'users' (étudiants) ---")
    console.table(users)

    const [tenants]: any = await db.query("SELECT id, name FROM etablissements")
    console.log("--- Établissements ---")
    console.table(tenants)

  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

checkStudents()
