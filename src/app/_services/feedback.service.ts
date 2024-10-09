import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feedback } from '../_models/feedback.model';
import { Contesto } from '../_models/contesto.model';
import { Observable } from 'rxjs';
import { Risposta } from '../_models/risposta.model';
import { User } from '../_models/user.model';
import { Search} from '../_models/search.model';


const httpOptions = {
  headers : new HttpHeaders({ 'Content-Type' : 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private httpClient: HttpClient) {}

  public getFeedback(){
    return this.httpClient.get<Feedback[]>("http://localhost:8080/feedback/get", httpOptions);
  }
  public getUser(){
    return this.httpClient.get<User[]>("http://localhost:8080/feedback/users", httpOptions);
  }
  public getUserFeedback(id:number){
    return this.httpClient.get<Feedback[]>("http://localhost:8080/feedback/getByUser/"+id, httpOptions);
  }

  public createFeedback(feedback : Feedback){
    return this.httpClient.post("http://localhost:8080/feedback/send", feedback, httpOptions);
  }
  public deleteFeedback(Id : number){
    return this.httpClient.delete("http://localhost:8080/feedback/delete/"+Id, httpOptions)
  }
  public ricerca(Id: number) {
    return this.httpClient.get("http://localhost:8080/feedback/"+Id, httpOptions)
  }
  public getContesto() {
    return this.httpClient.get<Contesto[]>("http://localhost:8080/feedback/getContesto", httpOptions)
  }
  public getFeedbackDetails(id:number): Observable<Feedback> {
    return this.httpClient.get<Feedback>("http://localhost:8080/feedback/get/"+id,httpOptions)
  }
  public getRisposte(id:number): Observable<Risposta[]> {
    return this.httpClient.get<Risposta[]>("http://localhost:8080/feedback/getRisposte/"+id,httpOptions)
  }
  public sendRisposta(risposta: Risposta) {
    return this.httpClient.post("http://localhost:8080/feedback/sendRisposta", risposta, httpOptions)
  }
  public deleteRisposta(id: number) {
    return this.httpClient.delete("http://localhost:8080/feedback/deleteRisposta/"+id, httpOptions)
  }
  public searchFeedback(search: Search): Observable<any> {
    return this.httpClient.post("http://localhost:8080/feedback/search",search, httpOptions)
  }
  public createContesto(contesto: Contesto):Observable<any>{
    return this.httpClient.post("http://localhost:8080/feedback/createContesto",contesto, httpOptions)
  }
  public deleteContesto(id: number) {
    return this.httpClient.delete("http://localhost:8080/feedback/contesto/delete/"+id, httpOptions)
  }
  public changeStatus(id: number){
    return this.httpClient.post("http://localhost:8080/feedback/status/"+id, httpOptions);
  }
}
