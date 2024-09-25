import { Component } from '@angular/core';
import { User } from '../_models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.component.html',
  styleUrl: './recover-pass.component.css'
})
export class RecoverPassComponent {
  recover = ""

  constructor( 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}
  ngOnInit(): void {}


  recoverPass(recoverForm: NgForm){
    console.log(recoverForm.value)
    this.authService.recoverPass(recoverForm.value).subscribe(
      (resp)=> {
        console.log(resp)
        if(resp){
        this.snackBar.open("Ti abbiamo inviato una email per proseguire con il reset della password", 'Chiudi', {
          duration: 5000, 
        });}
        setTimeout(() => {
          location.reload();
        }, 5000);
      },
      (err)=> {
        console.log(err)
      }
    )
  }
}
