import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  constructor( private router:Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  public isLoggedin(){
    return this.authService.isLogged();
  }
  
 public isAdmin(){ 
  if(this.storageService.getIdValue()?.email == "admin@mail") {
    return true
  }
  else {
    return false
  }
 }
 
  public login(){
    this.router.navigate(["home/login"])
  }
  public logout(){
    this.storageService.clean()
    localStorage.clear()
    this.router.navigate(["home"])
  }

}
