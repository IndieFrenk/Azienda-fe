import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_ID = "0";
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor( ) { }
  private redirectUrl: string = '';

  signOut(): void {
  }
  public isLoggedIn(): boolean {
    if (this.getIdValue() != null) {
      return true;
    }
    return false;
  }

  clean(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
  
  setToken (token:string){
    localStorage.setItem(TOKEN_KEY, token)
    

  }
  
  storeId(resp: { id: number; email: string }): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const valueToStore = JSON.stringify(resp);
        localStorage.setItem('userDetails', valueToStore);
        console.log('Data stored successfully');
      } catch (e) {
        console.error('Error storing data in localStorage', e);
      }
    } else {
    }
  }
  
  getIdValue():{ id: number; email: string } | null {
    if (typeof localStorage !== 'undefined') {
      try {
        const storedValue = localStorage.getItem('userDetails'); 
        if (storedValue) {
          return JSON.parse(storedValue);
        }
        return null;
      } catch (e) {
        console.error('Error parsing data from localStorage', e);
        return null;
      }
    } else {
      //console.warn('localStorage is not available');
      return null;
    }
  }
  
  setUser (id:string){
    localStorage.setItem('id', JSON.stringify({ id: id }))
  }
}
