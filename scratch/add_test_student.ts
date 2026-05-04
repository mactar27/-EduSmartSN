import { db } from "../lib/db"

async function debugSchema() {
  try {
    const [cols]: any = await db.query("DESCRIBE users")
    console.log("Structure de la table 'users':")
    console.table(cols)

    const email = `test_student_${Date.now()}@edusmart.sn`
    
    // Si 'name' existe, on l'ajoute
    const hasName = cols.some((c: any) => c.Field === 'name')
    
    let sql, params
    if (hasName) {
      sql = "INSERT INTO users (email, password_hash, first_name, last_name, name, role, etablissement_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
      params = [email, "hashed_password", "Modou", "Ndiaye", "Modou Ndiaye", "student", 1]
    } else {
      sql = "INSERT INTO users (email, password_hash, first_name, last_name, role, etablissement_id) VALUES (?, ?, ?, ?, ?, ?)"
      params = [email, "hashed_password", "Modou", "Ndiaye", "student", 1]
    }

    const [userRes]: any = await db.query(sql, params)
    const userId = userRes.insertId

    const matricule = `MAT-${Math.floor(Math.random() * 100000)}`
    await db.query(
      "INSERT INTO etudiants (user_id, matricule, etablissement_id, filiere, niveau) VALUES (?, ?, ?, ?, ?)",
      [userId, matricule, 1, "Informatique", "Licence 3"]
    )

    console.log(`✅ Étudiant créé: ${matricule}`)
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    process.exit()
  }
}

debugSchema()
