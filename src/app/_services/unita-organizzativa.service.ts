import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnitaOrganizzativa } from './_models/unitaOrganizzativa.model';

@Injectable({
  providedIn: 'root'
})
export class UnitaOrganizzativaService {
  private apiUrl = 'http://localhost:8080/api/unita-organizzative';  // URL backend

  private unitaSubject = new BehaviorSubject<UnitaOrganizzativa[]>([]);  // Observer Pattern
  public unita$ = this.unitaSubject.asObservable();  // Observable

  constructor(private http: HttpClient) { }

  // Ottenere tutte le unità organizzative
  getUnitaOrganizzative(): Observable<UnitaOrganizzativa[]> {
    return this.http.get<UnitaOrganizzativa[]>(this.apiUrl);
  }

  // Aggiornare la lista delle unità organizzative
  aggiornaUnitaOrganizzative(): void {
    this.getUnitaOrganizzative().subscribe(unitaList => this.unitaSubject.next(unitaList));
  }

  // Creare una nuova unità organizzativa
  createUnita(unita: UnitaOrganizzativa): Observable<UnitaOrganizzativa> {
    return this.http.post<UnitaOrganizzativa>(this.apiUrl, unita);
  }

  // Aggiornare un'unità organizzativa
  updateUnita(id: number, unita: UnitaOrganizzativa): Observable<UnitaOrganizzativa> {
    return this.http.put<UnitaOrganizzativa>(`${this.apiUrl}/${id}`, unita);
  }

  // Cancellare un'unità organizzativa
  deleteUnita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}