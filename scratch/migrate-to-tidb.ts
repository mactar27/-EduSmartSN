import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function migrate() {
  const config = {
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3RWMBVYcPuZSTxT.root',
    password: 'dzWfBvVeHML74eIa',
    database: 'test', // Start with any or none
    ssl: {
      rejectUnauthorized: false
    }
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('Connecté à TiDB Cloud !');

    // 1. Création de la DB
    await connection.query('CREATE DATABASE IF NOT EXISTS edusmart;');
    await connection.query('USE edusmart;');
    console.log('Base de données "edusmart" prête.');

    // 2. Lecture du script SQL
    const sqlPath = path.join(process.cwd(), 'scripts/001-create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split and execute each query
    const queries = sql.split(';').filter(q => q.trim().length > 0);
    for (const query of queries) {
      await connection.query(query);
    }
    console.log('Structure des tables migrée avec succès !');

    // 3. Ajout des colonnes de personnalisation (si pas dans le script initial)
    try {
      await connection.query('ALTER TABLE Tenant ADD COLUMN logoUrl VARCHAR(191), ADD COLUMN primaryColor VARCHAR(191), ADD COLUMN secondaryColor VARCHAR(191);');
      await connection.query('ALTER TABLE Student ADD COLUMN name VARCHAR(191), ADD COLUMN photoUrl VARCHAR(191), ADD COLUMN department VARCHAR(191), ADD COLUMN birthDate DATETIME;');
    } catch (e) {
      // Ignore if columns already exist
    }

    await connection.end();
  } catch (error) {
    console.error('Erreur de migration:', error);
  }
}

migrate();
