import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  user = {
    nome: 'Mario Rossi',
    email: 'mario.rossi@example.com',
    username: 'MarioRossi83',
    dataDiNascita: '27/05/1983',
    bio: 'Descrizione bio'
  };
  constructor(private router:Router){}
  goToMyFeedback(){
    this.router.navigate(["home/user/myFeedback"])
  }
}
