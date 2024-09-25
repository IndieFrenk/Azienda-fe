import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Feedback } from '../_models/feedback.model';
import { FormControl, NgForm } from '@angular/forms';
import { FeedbackService } from '../_services/feedback.service';
import { Contesto } from '../_models/contesto.model';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { Search } from '../_models/search.model';
import { SearchUser } from '../_models/searchUser.model';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrl: './send-feedback.component.css'
})
export class SendFeedbackComponent implements OnInit {

  search: SearchUser ={
    id: '0',
    contenuto: '',
    data: ''
  }
  feedbackList: any[] = []
  listaContesti: Contesto[] =[];
  contesto: Contesto ={
    id: 0,
    definizione:''
  }
  feedback: Feedback ={
    id: 0,
    titolo: '',
    contenuto:'',
    email: '',
    contesto: [], 
    dataSottomissione: ''
  }
  searchKey = ''

  contesti = new FormControl();
  displayedColumns: string[] = ['Titolo','Contenuto','Data', 'Contesti','Azioni'];


  constructor(
    private feedbackService:FeedbackService,
    private storageService:StorageService,
    private router: Router
  ){}


  ngOnInit(): void {
    
    console.log(localStorage.getItem("id"))
    this.getContesti();
    console.log(this.getContesti())
  }
  visualizza(id:number) {
    this.router.navigate(['home/feedback', {Id: id}])
    }
    
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(DialogAnimationsDialog, {
        width: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
      
    }

  searchFeedback(searchKey: NgForm): void {
    console.log(searchKey.value)
    this.search.data = searchKey.value.data
    this.search.contenuto = searchKey.value.contenuto
    const user = this.storageService.getIdValue(); 
      if (user && user.id) {
    this.search.id = user.id.toString(); 
      } else {
    this.search.id = '';  
      }
    console.log(this.search)
    this.feedbackService.searchFeedback(this.search).subscribe(
    (resp: any[]) => {
      this.feedbackList = resp;
      console.log(this.feedbackList);
    },
    (err) => {
      console.error('Error fetching feedback:', err);
    }
  );
}

  public SendFeedback(feedbackForm: NgForm){
    
    if(feedbackForm.valid){
    console.log(feedbackForm.value)
    this.feedback = feedbackForm.value
    const user = this.storageService.getIdValue()?.email
    if (user){
    
    this.feedback.email = user
    }
    this.feedbackService.createFeedback(this.feedback).subscribe(
      (resp) =>{
        console.log(resp)
        this.feedbackList = [ resp,...this.feedbackList]
        feedbackForm.reset()
        this.openDialog("500ms","250ms");
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  }
  public getContesti() {
    
    this.feedbackService.getContesto().subscribe(
      (resp: Contesto[])=> {
        this.listaContesti = resp
        
      },
      (err) =>{
        console.log(err)
      }
    )
  }

}
@Component({
  selector: 'app-send-feedback-dialog',
  templateUrl: './send-feedback-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, RouterModule, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsDialog {
  
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsDialog>); 
  constructor(
    private router: Router
  ) {}
  goToAreaRiservata() {
    this.dialogRef.close();  
    this.router.navigate(['/home/user']);  
  }
  close() {
    this.dialogRef.close();  
  }
}