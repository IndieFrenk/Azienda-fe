import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  aggiungiDipendente(unitaId: number, dipendenteId: number): Observable<UnitaOrganizzativa> {
    return this.http.post<UnitaOrganizzativa>(`${this.apiUrl}/dipendenti/${unitaId}/${dipendenteId}`, {});
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

  getRuoli(): Observable<Ruolo[]> {
    return this.http.get<Ruolo[]>(`${this.apiUrl}/ruolo`);
  }

  aggiornaRuoli(): void {
    this.getRuoli().subscribe(ruoli => this.ruoliSubject.next(ruoli));
  }

  createRuolo(ruolo: Ruolo): Observable<Ruolo> {
    return this.http.post<Ruolo>(`${this.apiUrl}/ruolo/create`, ruolo);
  }

  getRuoloById(id: number): Observable<Ruolo> {
    return this.http.get<Ruolo>(`${this.apiUrl}/ruolo/${id}`);
  }

  deleteRuolo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ruolo/${id}`);
  }
}
