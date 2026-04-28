-- EduSmart SN - Seed Data
-- Données de démonstration

-- Insertion des établissements
INSERT INTO etablissements (name, slug, description, address, city, phone, email, website, student_count, professor_count) VALUES
('Université Cheikh Anta Diop', 'ucad', 'La plus grande université du Sénégal, fondée en 1957. Centre d''excellence en Afrique de l''Ouest.', 'Avenue Cheikh Anta Diop', 'Dakar', '+221 33 825 05 30', 'contact@ucad.sn', 'https://www.ucad.sn', 85000, 1200),
('Université Gaston Berger', 'ugb', 'Université d''excellence située à Saint-Louis, réputée pour ses formations innovantes.', 'Route de Ngallèle', 'Saint-Louis', '+221 33 961 19 06', 'contact@ugb.sn', 'https://www.ugb.sn', 12000, 350),
('Institut Supérieur de Management', 'ism', 'École de commerce leader au Sénégal avec une forte orientation internationale.', 'Mermoz', 'Dakar', '+221 33 869 82 82', 'info@ism.sn', 'https://www.ism.sn', 3500, 120),
('École Supérieure Polytechnique', 'esp', 'Formation d''ingénieurs et techniciens supérieurs de haut niveau.', 'Université Cheikh Anta Diop', 'Dakar', '+221 33 825 08 79', 'direction@esp.sn', 'https://www.esp.sn', 2500, 180),
('Université Amadou Mahtar Mbow', 'uam', 'Nouvelle université moderne axée sur les technologies et l''innovation.', 'Diamniadio', 'Dakar', '+221 33 859 59 59', 'contact@uam.sn', 'https://www.uam.sn', 5000, 200),
('Institut Africain de Management', 'iam', 'Business school panafricaine avec des partenariats internationaux.', 'Liberté 6', 'Dakar', '+221 33 867 11 23', 'info@iam.sn', 'https://www.iam.sn', 2800, 95),
('Université Alioune Diop', 'uad', 'Université régionale au cœur du bassin arachidier.', 'Bambey', 'Bambey', '+221 33 973 36 82', 'contact@uadb.sn', 'https://www.uadb.sn', 4500, 150),
('BEM Dakar', 'bem', 'École de management avec un réseau international solide.', 'Almadies', 'Dakar', '+221 33 820 82 08', 'info@bem.sn', 'https://www.bem.sn', 1500, 65);

-- Insertion d'utilisateurs de test (mot de passe: password123 - hash bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role, phone, etablissement_id) VALUES
('admin@edusmart.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Amadou', 'Diallo', 'super_admin', '+221 77 123 45 67', NULL),
('admin@ucad.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Fatou', 'Sow', 'admin_university', '+221 77 234 56 78', 1),
('admin@ugb.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Moussa', 'Ndiaye', 'admin_university', '+221 77 345 67 89', 2),
('prof.fall@ucad.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Ibrahima', 'Fall', 'professor', '+221 77 456 78 90', 1),
('prof.diop@ugb.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Awa', 'Diop', 'professor', '+221 77 567 89 01', 2),
('etudiant1@ucad.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Ousmane', 'Ba', 'student', '+221 77 678 90 12', 1),
('etudiant2@ucad.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Mariama', 'Sy', 'student', '+221 77 789 01 23', 1),
('etudiant3@ugb.sn', '$2b$10$rOzJqQZQBwXHGqXHGqXHGepvYsKZNxZUxZUxZUxZUxZUxZUxZU', 'Cheikh', 'Gueye', 'student', '+221 77 890 12 34', 2);

-- Insertion des étudiants
INSERT INTO etudiants (user_id, matricule, etablissement_id, filiere, niveau, date_naissance, lieu_naissance, statut) VALUES
(6, 'UCAD-2024-001', 1, 'Informatique', 'Licence 3', '2002-05-15', 'Dakar', 'actif'),
(7, 'UCAD-2024-002', 1, 'Gestion', 'Master 1', '2001-08-22', 'Thiès', 'actif'),
(8, 'UGB-2024-001', 2, 'Économie', 'Licence 2', '2003-01-10', 'Saint-Louis', 'actif');

-- Insertion des cours
INSERT INTO cours (code, name, description, credits, etablissement_id, professor_id, filiere, niveau, semestre, horaire, salle) VALUES
('INF301', 'Programmation Web', 'Développement d''applications web modernes avec HTML, CSS, JavaScript et frameworks.', 4, 1, 4, 'Informatique', 'Licence 3', 1, 'Lundi 8h-12h', 'Amphi A'),
('INF302', 'Base de données', 'Conception et administration de bases de données relationnelles.', 4, 1, 4, 'Informatique', 'Licence 3', 1, 'Mardi 14h-18h', 'Salle 201'),
('GES401', 'Marketing Digital', 'Stratégies de marketing en ligne et réseaux sociaux.', 3, 1, 4, 'Gestion', 'Master 1', 1, 'Mercredi 8h-11h', 'Salle 105'),
('ECO201', 'Microéconomie', 'Théorie microéconomique et analyse des marchés.', 4, 2, 5, 'Économie', 'Licence 2', 1, 'Jeudi 8h-12h', 'Amphi B'),
('ECO202', 'Statistiques', 'Méthodes statistiques pour l''économie.', 4, 2, 5, 'Économie', 'Licence 2', 1, 'Vendredi 14h-18h', 'Salle 302');

-- Insertion des paiements
INSERT INTO paiements (reference, etudiant_id, etablissement_id, montant, type, statut, methode, description) VALUES
('PAY-2024-0001', 1, 1, 150000, 'inscription', 'complete', 'orange_money', 'Frais d''inscription 2024-2025'),
('PAY-2024-0002', 1, 1, 500000, 'scolarite', 'complete', 'wave', 'Scolarité Semestre 1'),
('PAY-2024-0003', 2, 1, 175000, 'inscription', 'complete', 'orange_money', 'Frais d''inscription Master'),
('PAY-2024-0004', 2, 1, 750000, 'scolarite', 'en_attente', 'wave', 'Scolarité Semestre 1 Master'),
('PAY-2024-0005', 3, 2, 125000, 'inscription', 'complete', 'free_money', 'Frais d''inscription 2024-2025'),
('PAY-2024-0006', 3, 2, 400000, 'scolarite', 'complete', 'orange_money', 'Scolarité Semestre 1');

-- Insertion des demandes de démo
INSERT INTO demandes_demo (etablissement_name, contact_name, email, phone, message, statut) VALUES
('École Supérieure de Commerce de Dakar', 'Mamadou Diallo', 'mdiallo@escd.sn', '+221 77 111 22 33', 'Nous souhaitons digitaliser notre gestion académique. Pouvez-vous nous faire une démonstration ?', 'nouvelle'),
('Institut de Technologie de Thiès', 'Aissatou Niang', 'aniang@itt.sn', '+221 77 222 33 44', 'Intéressés par les modules de paiement mobile.', 'contactee'),
('Université Virtuelle du Sénégal', 'Ibrahima Sarr', 'isarr@uvs.sn', '+221 77 333 44 55', 'Nous recherchons une solution complète pour notre nouvelle université.', 'demo_planifiee');

-- Inscriptions aux cours
INSERT INTO inscriptions_cours (etudiant_id, cours_id, annee_academique, note_cc, note_examen, note_finale, statut) VALUES
(1, 1, '2024-2025', 14.5, 13.0, 13.6, 'inscrit'),
(1, 2, '2024-2025', 16.0, NULL, NULL, 'inscrit'),
(2, 3, '2024-2025', 15.0, 14.5, 14.7, 'inscrit'),
(3, 4, '2024-2025', 12.0, 11.5, 11.7, 'inscrit'),
(3, 5, '2024-2025', 13.5, NULL, NULL, 'inscrit');
