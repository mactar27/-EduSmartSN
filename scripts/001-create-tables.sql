-- EduSmart SN Database Schema
-- TiDB Serverless (MySQL compatible)

-- Table des établissements
CREATE TABLE IF NOT EXISTS etablissements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  address VARCHAR(500),
  city VARCHAR(100) NOT NULL DEFAULT 'Dakar',
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url VARCHAR(500),
  student_count INT DEFAULT 0,
  professor_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_city (city),
  INDEX idx_active (is_active)
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('super_admin', 'admin_university', 'professor', 'student') NOT NULL DEFAULT 'student',
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  etablissement_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (etablissement_id) REFERENCES etablissements(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_etablissement (etablissement_id)
);

-- Table des étudiants
CREATE TABLE IF NOT EXISTS etudiants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  matricule VARCHAR(50) NOT NULL UNIQUE,
  etablissement_id INT NOT NULL,
  filiere VARCHAR(100) NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  date_naissance DATE,
  lieu_naissance VARCHAR(100),
  adresse VARCHAR(500),
  tuteur_nom VARCHAR(200),
  tuteur_phone VARCHAR(20),
  statut ENUM('actif', 'inactif', 'diplome', 'suspendu') DEFAULT 'actif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (etablissement_id) REFERENCES etablissements(id) ON DELETE CASCADE,
  INDEX idx_matricule (matricule),
  INDEX idx_etablissement (etablissement_id),
  INDEX idx_filiere (filiere),
  INDEX idx_statut (statut)
);

-- Table des cours
CREATE TABLE IF NOT EXISTS cours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  credits INT DEFAULT 3,
  etablissement_id INT NOT NULL,
  professor_id INT,
  filiere VARCHAR(100) NOT NULL,
  niveau VARCHAR(50) NOT NULL,
  semestre INT DEFAULT 1,
  horaire VARCHAR(100),
  salle VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (etablissement_id) REFERENCES etablissements(id) ON DELETE CASCADE,
  FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_etablissement (etablissement_id),
  INDEX idx_filiere_niveau (filiere, niveau)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS paiements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(50) NOT NULL UNIQUE,
  etudiant_id INT NOT NULL,
  etablissement_id INT NOT NULL,
  montant DECIMAL(12, 2) NOT NULL,
  devise VARCHAR(10) DEFAULT 'XOF',
  type ENUM('inscription', 'scolarite', 'examen', 'autre') NOT NULL DEFAULT 'scolarite',
  statut ENUM('en_attente', 'complete', 'echoue', 'rembourse') DEFAULT 'en_attente',
  methode ENUM('orange_money', 'wave', 'free_money', 'carte', 'especes') NOT NULL,
  transaction_id VARCHAR(100),
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE,
  FOREIGN KEY (etablissement_id) REFERENCES etablissements(id) ON DELETE CASCADE,
  INDEX idx_reference (reference),
  INDEX idx_etudiant (etudiant_id),
  INDEX idx_etablissement (etablissement_id),
  INDEX idx_statut (statut),
  INDEX idx_created (created_at)
);

-- Table des demandes de démo
CREATE TABLE IF NOT EXISTS demandes_demo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  etablissement_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  statut ENUM('nouvelle', 'contactee', 'demo_planifiee', 'convertie', 'refusee') DEFAULT 'nouvelle',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_statut (statut),
  INDEX idx_created (created_at)
);

-- Table des inscriptions aux cours
CREATE TABLE IF NOT EXISTS inscriptions_cours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  etudiant_id INT NOT NULL,
  cours_id INT NOT NULL,
  annee_academique VARCHAR(20) NOT NULL,
  note_cc DECIMAL(5, 2),
  note_examen DECIMAL(5, 2),
  note_finale DECIMAL(5, 2),
  statut ENUM('inscrit', 'valide', 'echoue', 'abandonne') DEFAULT 'inscrit',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE,
  FOREIGN KEY (cours_id) REFERENCES cours(id) ON DELETE CASCADE,
  UNIQUE KEY unique_inscription (etudiant_id, cours_id, annee_academique),
  INDEX idx_annee (annee_academique)
);
