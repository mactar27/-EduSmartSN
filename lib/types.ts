export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'admin_university' | 'professor' | 'student';
  phone?: string;
  avatar_url?: string;
  etablissement_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Etablissement {
  id: number;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  student_count: number;
  professor_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Etudiant {
  id: number;
  user_id: number;
  matricule: string;
  etablissement_id: number;
  filiere: string;
  niveau: string;
  date_naissance?: Date;
  lieu_naissance?: string;
  adresse?: string;
  tuteur_nom?: string;
  tuteur_phone?: string;
  statut: 'actif' | 'inactif' | 'diplome' | 'suspendu';
  created_at: Date;
  updated_at: Date;
}

export interface Cours {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  etablissement_id: number;
  professor_id?: number;
  filiere: string;
  niveau: string;
  semestre: number;
  horaire?: string;
  salle?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Paiement {
  id: number;
  reference: string;
  etudiant_id: number;
  etablissement_id: number;
  montant: number;
  devise: string;
  type: 'inscription' | 'scolarite' | 'examen' | 'autre';
  statut: 'en_attente' | 'complete' | 'echoue' | 'rembourse';
  methode: 'orange_money' | 'wave' | 'free_money' | 'carte' | 'especes';
  transaction_id?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DemandeDemo {
  id: number;
  etablissement_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message?: string;
  statut: 'nouvelle' | 'contactee' | 'demo_planifiee' | 'convertie' | 'refusee';
  created_at: Date;
  updated_at: Date;
}

export interface Stats {
  total_etablissements: number;
  total_etudiants: number;
  total_professeurs: number;
  total_cours: number;
  paiements_mois: number;
}
