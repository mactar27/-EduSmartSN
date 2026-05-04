import { db } from "../lib/db"

async function checkTables() {
  try {
    const [rows]: any = await db.query("SHOW TABLES")
    console.log("Tables disponibles :")
    console.table(rows)
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

checkTables()
