import { db } from "../lib/db"

async function createSimpleStudent() {
  try {
    const email = "student@edusmart.sn"
    const password = "student123"
    
    // Check if exists
    const [existing]: any = await db.query("SELECT id FROM users WHERE email = ?", [email])
    if (existing.length > 0) {
      await db.query("UPDATE users SET password_hash = ? WHERE email = ?", [password, email])
      console.log("✅ Mot de passe mis à jour pour student@edusmart.sn")
    } else {
      const [userRes]: any = await db.query(
        "INSERT INTO users (email, password_hash, first_name, last_name, name, role, etablissement_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [email, password, "Élève", "Test", "Élève Test", "student", 1]
      )
      const userId = userRes.insertId
      await db.query(
        "INSERT INTO etudiants (user_id, matricule, etablissement_id, filiere, niveau) VALUES (?, ?, ?, ?, ?)",
        [userId, "STUDENT-001", 1, "Tronc Commun", "L1"]
      )
      console.log("✅ Nouvel étudiant créé: student@edusmart.sn / student123")
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

createSimpleStudent()
