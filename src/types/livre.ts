// frontend/src/types/livre.ts
// Identique à backend/src/types/livre.ts

export interface Livre {
  id:         number;
  isbn:       string;
  titre:      string;
  auteur:     string;
  annee:      number;
  genre:      string;
  disponible: boolean;
}

export interface CreateLivreDto {
  isbn:   string;
  titre:  string;
  auteur: string;
  annee?: number;
  genre?: string;
}

export interface FiltresLivre {
  genre?:      string;
  disponible?: boolean;
  recherche?:  string;
}
