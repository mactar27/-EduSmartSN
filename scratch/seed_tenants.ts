import { query } from '../lib/db';

async function seedTenants() {
  try {
    console.log("Seeding tenants...");
    const tenants = [
      { id: 'uam', name: 'Université Amadou Mahtar Mbow', subdomain: 'uam', primaryColor: '#1e40af' },
      { id: 'espoir-bs', name: 'Espoir Business School', subdomain: 'espoir-bs', primaryColor: '#059669' },
      { id: 'ucad', name: 'Université Cheikh Anta Diop', subdomain: 'ucad', primaryColor: '#b91c1c' }
    ];

    for (const t of tenants) {
      await query(
        'INSERT IGNORE INTO Tenant (id, name, subdomain, primaryColor, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, "ACTIVE", NOW(), NOW())',
        [t.id, t.name, t.subdomain, t.primaryColor]
      );
    }
    console.log("Done!");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

seedTenants();
