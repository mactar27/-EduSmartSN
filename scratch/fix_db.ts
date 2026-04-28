import { query } from '../lib/db';

async function fix() {
  console.log("--- DIAGNOSTIC ET RÉPARATION ---");
  
  try {
    // 1. Voir tous les établissements
    const tenants = await query<any[]>('SELECT id, name, is_active FROM etablissements');
    console.log("Établissements trouvés:", tenants);

    if (tenants.length > 0) {
      const firstId = tenants[0].id;
      // 2. S'assurer que le premier est bien actif
      await query('UPDATE etablissements SET is_active = 1 WHERE id = ?', [firstId]);
      console.log(`Établissement ${firstId} activé.`);

      // 3. Voir tous les élèves et les rattacher au premier établissement au cas où
      const students = await query<any[]>('SELECT id, name, etablissement_id FROM etudiants');
      console.log(`Nombre d'élèves total en base: ${students.length}`);

      if (students.length > 0) {
        await query('UPDATE etudiants SET etablissement_id = ?', [firstId]);
        console.log("Tous les élèves ont été rattachés à l'établissement principal.");
      }
    } else {
      console.log("ERREUR: Aucun établissement en base !");
    }

  } catch (error) {
    console.error("Erreur diagnostic:", error);
  }
}

fix();
