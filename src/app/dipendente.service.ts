import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dipendente } from './_models/dipendente.model';

@Injectable({
  providedIn: 'root'
})
export class DipendenteService {
  private apiUrl = 'http://localhost:8080/api/dipendenti';  // URL backend

  constructor(private http: HttpClient) { }

  // Ottenere tutti i dipendenti
  getDipendenti(): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(this.apiUrl);
  }

  // Creare un nuovo dipendente
  createDipendente(dipendente: Dipendente): Observable<Dipendente> {
    return this.http.post<Dipendente>(this.apiUrl, dipendente);
  }

  // Aggiornare un dipendente
  updateDipendente(id: number, dipendente: Dipendente): Observable<Dipendente> {
    return this.http.put<Dipendente>(`${this.apiUrl}/${id}`, dipendente);
  }

  // Cancellare un dipendente
  deleteDipendente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
