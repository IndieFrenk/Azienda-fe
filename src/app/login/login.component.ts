import { ChangeDetectionStrategy, Component, Inject, inject, signal } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../_models/user.model';
import { StorageService } from '../_services/storage.service';
import { DatePipe, formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  
})
export class LoginComponent {
  isLoading: boolean = false;
  user: User ={
    id: 0 ,
    nome: "" ,
    cognome: "" ,
    dataDiNascita:"",
    username:"" ,
    email:""  ,
    password: "" 
  }
  previousUrl = ""
  maxDate: Date | undefined;
  private readonly KEY = 'aW50ZXJuZXQmaWRlZQ==';
  date: Date | undefined;
  hide = signal(true);
  showRegisterError = false
  showLoginError = false
  wantLogin = true
  constructor(private authService: AuthService, 
    private router: Router, 
    private storageService: StorageService, 
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) {}
  
    ngOnInit (){
      this.activatedRoute.queryParams.subscribe(params => {
        this.previousUrl = params['url'];
      })

      this.maxDate = new Date();
      this.maxDate.setMonth(this.maxDate.getMonth() - 12 * 18);
      if (this.isLoggedin()) {
        this.router.navigate(['/home'])
      }
    }
    private decryptUrl(encryptedUrl: string): string {
      const encryptedData = this.fromBase64Url(encryptedUrl);
      const salt = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
      const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4, 8));
      const ciphertext = CryptoJS.lib.WordArray.create(encryptedData.words.slice(8));
      const key = CryptoJS.PBKDF2(this.KEY, salt, {
        keySize: 256 / 32,
        iterations: 1000
      });
    
    
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        iv: iv,
        key: key
      });
    
      const decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        }
      );
    
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    
    private fromBase64Url(base64UrlString: string): CryptoJS.lib.WordArray {
      if (!base64UrlString) {
        console.error('base64UrlString is undefined or null');
        return CryptoJS.lib.WordArray.create(); // Return an empty WordArray
      }
      const base64 = base64UrlString
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(base64UrlString.length + (4 - base64UrlString.length % 4) % 4, '=');
    
      return CryptoJS.enc.Base64.parse(base64);
    }
    
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  isLoggedin(){
      return this.authService.isLogged();
    }
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
      const date = event.value;
      if (date) {
        this.user.dataDiNascita = this.datePipe.transform(date, "DD-MM-AAAA", "it-IT")|| '';
        console.log(this.user.dataDiNascita);
      }
    }
    
    login(loginForm: NgForm) {
      if (loginForm.invalid) {
        return
      }
      const url = this.decryptUrl(this.previousUrl)
      loginForm.value.dataDiNascita = this.user.dataDiNascita;
      console.log(loginForm.value)
      
      this.authService.login(loginForm.value).subscribe(
        (resp) =>{
          console.log(resp)
          this.storageService.storeId(resp)
          if(this.isAdmin()){
            this.router.navigate(["home/admin"])
          }
          else{
          this.router.navigate([url])
        }
        },
        (err) =>{
          console.error('Email/password non corretti', err);
          const errorMessage = 'Email/password non corretti';
          this.openDialog("500ms", "250ms", errorMessage);
          this.router.navigate(['/home/login'])
          loginForm.reset()
        }
      )
    }

    isAdmin(){  
      if(this.storageService.getIdValue()?.email == "admin@mail") {
        return true
      }
      else {
        return false
      }
    }

    register(registerForm: NgForm) {
      if (registerForm.invalid){ return}
      registerForm.value.dataDiNascita = this.user.dataDiNascita;
      console.log(registerForm.value)
      this.isLoading = true;
      this.authService.register(registerForm.value).subscribe(
        (resp) =>{
          const token = resp.token;
          console.log(token)
          this.isLoading = false;
          this.openDialog("500ms", "250ms", "Registrazione avvenuta con successo, conferma le tue credenziali accedendo dall'email che ti abbiamo inviato");
        },
        (err) =>{
          this.isLoading = false;
          const errorMessage = 'Dati non conformi';
          this.openDialog("500ms", "250ms", errorMessage);
          localStorage.removeItem('token');
          
        }
      )
    }
    logout() {
      localStorage.removeItem('token');
      this.router.navigate(['/'])
    }
    
    loginOrRegister(){
      this.wantLogin = !this.wantLogin
    }
    readonly dialog = inject(MatDialog);

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string, content: string): void {
      this.dialog.open(DialogAnimationsDialog, {
        width: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: { content }
      });

    }
}


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, RouterModule, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsDialog {
  
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsDialog>); 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { content: string },
    private router: Router
  ) {}
  close() {
    this.dialogRef.close();  
  }
}

