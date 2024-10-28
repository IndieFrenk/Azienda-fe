import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Dipendente } from '../_models/dipendente.model';
import { Ruolo } from '../_models/ruolo.model';
import { UnitaOrganizzativa } from '../_models/unitaOrganizzativa.model';

@Injectable({
  providedIn: 'root'
})
export class OrganigrammaService {
  private apiUrl = 'http://localhost:8080/azienda';

  private dipendentiSubject = new BehaviorSubject<Dipendente[]>([]);
  public dipendenti$ = this.dipendentiSubject.asObservable();

  private ruoliSubject = new BehaviorSubject<Ruolo[]>([]);
  public ruoli$ = this.ruoliSubject.asObservable();

  private unitaSubject = new BehaviorSubject<UnitaOrganizzativa[]>([]);
  public unita$ = this.unitaSubject.asObservable();

  constructor(private http: HttpClient) {}

  // =======================
  // SEZIONE UNITÀ ORGANIZZATIVE
  // =======================

  getUnitaOrganizzative(): Observable<UnitaOrganizzativa[]> {
    return this.http.get<UnitaOrganizzativa[]>(`${this.apiUrl}`);
  }

  aggiornaUnitaOrganizzative(): void {
    this.getUnitaOrganizzative().subscribe(unitaList => this.unitaSubject.next(unitaList));
  }

  createUnita(unita: UnitaOrganizzativa): Observable<UnitaOrganizzativa> {
    return this.http.post<UnitaOrganizzativa>(`${this.apiUrl}`, unita);
  }

  getUnitaById(id: number): Observable<UnitaOrganizzativa> {
    return this.http.get<UnitaOrganizzativa>(`${this.apiUrl}/${id}`);
  }

  updateUnita(id: number, unita: UnitaOrganizzativa): Observable<UnitaOrganizzativa> {
    return this.http.put<UnitaOrganizzativa>(`${this.apiUrl}/${id}`, unita);
  }

  deleteUnita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =======================
  // SEZIONE DIPENDENTI
  // =======================
  getAllDipendenti(): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(`${this.apiUrl}/dipendenti`);
  }
  getRuoliDipendente(dipendenteId: number): Observable<Ruolo[]> {
    return this.http.get<Ruolo[]>(`${this.apiUrl}/dipendenti/${dipendenteId}/ruoli`);
  }
  getRuoliDipendenteUnita(unitaId: number , ruoloId : number): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(`${this.apiUrl}/${unitaId}/${ruoloId}/dipendenti`);
  }
  getDipendentiNonAssegnatiAUnita(unitaId: number): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(`${this.apiUrl}/${unitaId}/dipendenti`);
  }
  
  getDipendentiUnitaWithRoles(unitaId: number): Observable<Dipendente[]> {
    return this.getDipendentiUnita(unitaId).pipe(
      switchMap(dipendenti => {
        if (dipendenti.length === 0) {
          return new Observable<Dipendente[]>(observer => {
            observer.next([]);
            observer.complete();
          });
        }

        const dipendentiWithRoles = dipendenti.map(dipendente =>
          this.getRuoliDipendente(dipendente.id).pipe(
            map(ruoli => ({
              ...dipendente,
              ruoli: ruoli
            } as Dipendente))  // Aggiungiamo type assertion esplicita
          )
        );

        return forkJoin(dipendentiWithRoles);
      })
    );
  }
  creaDipendenteConRuoliEUnita(request: {    nome: string;    unita: number;    ruoli: number[];  }): Observable<Dipendente> {
    return this.http.post<Dipendente>(`${this.apiUrl}/dipendenti/create-with-roles-and-unit`,request);
  }
  
  creaDipendente(dipendenteDTO: Dipendente): Observable<Dipendente> {
    return this.http.post<Dipendente>(`${this.apiUrl}/dipendenti/create`, dipendenteDTO);
  }

  aggiungiDipendente(unitaId: number, dipendenteId: number): Observable<UnitaOrganizzativa> {
    return this.http.post<UnitaOrganizzativa>(`${this.apiUrl}/dipendenti/${unitaId}/${dipendenteId}`, {});
  }
  getDipendentiGroupedByRuolo(unitaId: number): Observable<{ [ruolo: string]: Dipendente[] }> {
    return this.getDipendentiUnitaWithRoles(unitaId).pipe(
      map(dipendenti => {
        const result = {} as { [ruolo: string]: Dipendente[] };
        dipendenti.forEach(dipendente => {
          dipendente.ruoli.forEach(ruolo => {
            if (!result[ruolo.nome]) {
              result[ruolo.nome] = [];
            }
            result[ruolo.nome].push(dipendente);
          });
        });
        return result;
      })
    );
  }
  rimuoviDipendente(unitaId: number, dipendenteId: number): Observable<UnitaOrganizzativa> {
    return this.http.delete<UnitaOrganizzativa>(`${this.apiUrl}/dipendenti/${unitaId}/${dipendenteId}`);
  }

  trasferisciDipendente(dipendenteId: number, unitaDaId: number, unitaAId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/dipendenti/trasferisci/${dipendenteId}/da/${unitaDaId}/a/${unitaAId}`, {});
  }

  getDipendentiUnita(unitaId: number): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(`${this.apiUrl}/${unitaId}/dipendenti`);
  }

  // =======================
  // SEZIONE RUOLI
  // =======================
  getAllRuoli(): Observable<Ruolo[]> {
    return this.http.get<Ruolo[]>(`${this.apiUrl}/ruoli`);
  }
  aggiungiRuolo(unitaId: number, nomeRuolo: string): Observable<Ruolo> {
    return this.http.post<Ruolo>(`${this.apiUrl}/${unitaId}/ruoli`, nomeRuolo);
  }

  rimuoviRuolo(unitaId: number, ruoloId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${unitaId}/ruoli/${ruoloId}`);
  }

  aggiornaRuolo(ruoloId: number, nuovoNome: string): Observable<Ruolo> {
    return this.http.put<Ruolo>(`${this.apiUrl}/ruoli/${ruoloId}`, nuovoNome);
  }

  getRuoliUnita(unitaId: number): Observable<Ruolo[]> {
    return this.http.get<Ruolo[]>(`${this.apiUrl}/${unitaId}/ruoli`);
  }

  getRuoli(): Observable<Ruolo[]> {
    return this.http.get<Ruolo[]>(`${this.apiUrl}/ruolo`);
  }

  assegnaRuoloADipendente(ruoloId: number, dipendenteId: number): Observable<Ruolo> {
    return this.http.post<Ruolo>(
      `${this.apiUrl}/ruoli/${ruoloId}/dipendenti/${dipendenteId}`, 
      {}
    );
  }

  createRuoloPerUnita(unitaId: number, tipoRuolo: string): Observable<Ruolo> {
    return this.http.post<Ruolo>(`${this.apiUrl}/${unitaId}/ruoli/create`, tipoRuolo);
  }
}
