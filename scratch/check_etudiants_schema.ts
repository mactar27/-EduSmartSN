import { db } from "../lib/db"

async function checkSchema() {
  try {
    const [cols]: any = await db.query("DESCRIBE etudiants")
    console.log("Structure de la table 'etudiants':")
    console.table(cols)
    
    const [rows]: any = await db.query("SELECT * FROM etudiants LIMIT 5")
    console.log("Contenu de 'etudiants':")
    console.table(rows)
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

checkSchema()
