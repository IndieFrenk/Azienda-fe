import { Ruolo } from "./ruolo.model";

export interface Dipendente {
    id: number;
    nome: string;
    ruoli: Ruolo[];  // Cambiato da string[] a Ruolo[]
    unita?: number;
  }
  