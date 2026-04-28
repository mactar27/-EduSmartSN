import { query } from '../lib/db';

async function updateColors() {
  console.log("Updating all establishments to Indigo blue...");
  try {
    await query('UPDATE etablissements SET primary_color = "#4f46e5", secondary_color = "#6366f1"');
    console.log("Successfully updated colors!");
  } catch (error) {
    console.error("Error updating colors:", error);
  }
}

updateColors();
