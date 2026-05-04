import { db } from "../lib/db"

async function addUserAdmin() {
  try {
    await db.query(
      "INSERT INTO users (email, password_hash, first_name, last_name, name, role) VALUES (?, ?, ?, ?, ?, ?)", 
      ["ndiayeamadoumactar3@gmail.com", "M@tzo2705", "Amadou", "Ndiaye", "Amadou Mactar Ndiaye", "univ_admin"]
    )
    console.log("✅ Compte admin utilisateur créé avec succès !")
    console.log("Email: ndiayeamadoumactar3@gmail.com")
  } catch (error) {
    console.error("❌ Erreur:", error.message)
  } finally {
    process.exit()
  }
}

addUserAdmin()
