export interface UnitaOrganizzativa {
    id: number ;
    nome: string ;
    ruoli: string[];
    dipendenti: string[];
    unitaSuperiore: number;
    unitaSottostanti: number[]
}