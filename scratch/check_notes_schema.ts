import { db } from "../lib/db"

async function checkNotesSchema() {
  try {
    const [cols]: any = await db.query("DESCRIBE notes")
    console.log("Structure de la table 'notes':")
    console.table(cols)
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

checkNotesSchema()
