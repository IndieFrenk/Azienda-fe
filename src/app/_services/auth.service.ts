import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';
import { ChangePass } from '../_models/changePass.model';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //public loggedInUserSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  //loggedInUserId = this.loggedInUserSubject.asObservable();
  private http : HttpClient;

  constructor(   private router:Router, private handler:HttpBackend, private storageService: StorageService  ) {
    this.http = new HttpClient(handler);
  }
  checkAuthStatus(): Observable<boolean> {
    const user = this.storageService.getIdValue()?.email;
    return of(!!user);
  }
  isLogged(){ return this.storageService.isLoggedIn()  }
  login(login:FormData) {
    return this.http.post<any>("http://localhost:7777/auth/login", login)
  }
  register(register:FormData) {
    return this.http.post<any>("http://localhost:7777/auth/signup", register)
  }
  logout(): Observable<any> {
    return this.http.post("http://localhost:7777/auth/signout", {withCredentials: true});
  }
  refreshToken() {
    return this.http.post("http://localhost:7777/auth/refreshtoken",{}, {withCredentials: true});
    }

  changePassword(changePass:ChangePass){
    return this.http.post<any>("http://localhost:7777/auth/changePass", changePass)
  }
  recoverPass(recover:FormData){
    return this.http.post<any>("http://localhost:7777/auth/recoverPass", recover)
  }
  }
