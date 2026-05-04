import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'M@tzo2705',
  database: 'edusmart',
};

async function init() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  console.log('Connexion à MySQL réussie...');

  // 1. Créer la base de données si elle n'existe pas
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  await connection.query(`USE \`${dbConfig.database}\``);

  console.log(`Base de données "${dbConfig.database}" prête.`);

  // 2. Créer la table etablissements
  await connection.query(`
    CREATE TABLE IF NOT EXISTS etablissements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      logo_url TEXT,
      city VARCHAR(100),
      student_count INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 3. Créer la table users
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      role ENUM('admin', 'univ_admin', 'student', 'professor') NOT NULL,
      password VARCHAR(255) DEFAULT 'pass123',
      password_hash VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 4. Créer la table etudiants (avec la bonne structure qu'on a trouvée)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS etudiants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      matricule VARCHAR(50) UNIQUE,
      etablissement_id INT,
      filiere VARCHAR(255),
      niveau VARCHAR(50),
      date_naissance DATE,
      lieu_naissance VARCHAR(255),
      adresse TEXT,
      tuteur_nom VARCHAR(255),
      tuteur_phone VARCHAR(50),
      statut VARCHAR(50) DEFAULT 'actif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (etablissement_id) REFERENCES etablissements(id) ON DELETE CASCADE
    )
  `);

  // 5. Créer la table paiements
  await connection.query(`
    CREATE TABLE IF NOT EXISTS paiements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      etudiant_id INT,
      etablissement_id INT,
      montant DECIMAL(10, 2),
      methode VARCHAR(50),
      statut VARCHAR(50),
      reference VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (etablissement_id) REFERENCES etablissements(id) ON DELETE CASCADE
    )
  `);

  // 5. Insérer des données de test
  await connection.query(`
    INSERT IGNORE INTO etablissements (id, name, slug, city, is_active) 
    VALUES (1, 'EduSmart University', 'edusmart-univ', 'Dakar', 1)
  `);

  await connection.query(`
    INSERT IGNORE INTO users (id, name, email, role, password_hash) 
    VALUES (1, 'Admin Demo', 'amadouwocky@gmail.com', 'univ_admin', 'n2t1sacn')
  `);

  console.log('✅ Tables créées et données de test insérées avec succès !');
  await connection.end();
}

init().catch(console.error);
