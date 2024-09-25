import { ChangeDetectionStrategy, Component, Inject, inject, signal } from '@angular/core';
import { ChangePass } from '../_models/changePass.model';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css'
})
export class ChangePassComponent {
  hide = signal(true);
  userUpdate: ChangePass ={
    email:""  ,
    password: "" ,
    newPassword: "" ,
    resetToken: ""
  }
  passwordForm: FormGroup;
  resetToken: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService, 
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.createPasswordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });

  }
  passwordRequirements = [
    { label: 'Almeno 8 char.', check: (pwd: string) => pwd.length >= 8 },
    { label: 'Almeno 1 maiuscola', check: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Almeno 1 numero', check: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'Almeno 1 carattere speciale', check: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pwd) },
  ];

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      if (this.resetToken) {
        this.passwordForm.get('password')?.clearValidators();
        this.passwordForm.get('password')?.updateValueAndValidity();
      }
    });
    
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  checkPasswords(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }
  createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      return !passwordValid ? { passwordStrength: true } : null;
    }
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
  changePass(passwordForm: any){
    if (this.passwordForm.valid) {
      const user = this.storageService.getIdValue()?.email;
      if (user) {
        this.userUpdate.email = user;
      }
      this.userUpdate.password = passwordForm.value.password;
      this.userUpdate.newPassword = passwordForm.value.newPassword;
      this.userUpdate.resetToken = this.resetToken;
      console.log(this.userUpdate)
      this.authService.changePassword(this.userUpdate).subscribe(
      (resp) => {
        console.log(resp); 
        this.openDialog("500ms", "250ms", 'Password cambiata con successo!');
        this.router.navigate(['/login']);
      },
      (err) => {
        console.error(err);
        const errorMessage = err.error?.message || 'Errore durante il cambio password';
        this.openDialog("500ms", "250ms", errorMessage);
      }
    );
  } else {
    const errorMessage = 'Correggi gli errori';
    this.openDialog("500ms", "250ms", errorMessage);
  }
}
}

@Component({
  selector: 'app-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
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
  goToAreaRiservata() {
    this.dialogRef.close();  
    this.router.navigate(['/home/login']);  
  }
  close() {
    this.dialogRef.close();  
  }
 
}