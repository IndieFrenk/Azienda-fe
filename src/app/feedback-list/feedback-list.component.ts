import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Feedback } from '../_models/feedback.model';
import { FormControl, NgForm } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { FeedbackService } from '../_services/feedback.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SearchUser } from '../_models/searchUser.model';
import {Location} from '@angular/common';
@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.css'
})
export class FeedbackListComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  feedbackList: Feedback[] = []

  feedbackTableData = new MatTableDataSource<any>([]);

  search: SearchUser ={
    id: '0',
    contenuto: '',
    data: ''
  }
  feedback: Feedback ={
    id: 0,
    titolo: '',
    contenuto:'',
    email: '',
    contesto: [], 
    dataSottomissione: '',
    stato: false
  }

  constructor(
    private feedbackService:FeedbackService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _liveAnnouncer:LiveAnnouncer,
    private location:Location
  ){}

  contesti = new FormControl();
  singleUser: boolean = false;
  feedbackListCut: any[] = []
  displayedColumnsFeedback: string[] = ['Titolo','Contenuto','Utente', 'Data','Contesti', 'Risposte'];


  ngOnInit(): void {
    this.getFeedback(0);
   
  }
  
  ngAfterViewInit() {
    this.feedbackTableData.sort = this.sort;
    this.feedbackTableData.paginator = this.paginator;
  }

  
  searchFeedback(searchKey: NgForm): void {
    console.log(searchKey.value)
    this.search = searchKey.value
    this.feedbackService.searchFeedback(this.search).subscribe(
    (resp: any[]) => {
      this.feedbackTableData.data = resp;
      console.log(resp);
    },
    (err) => {
      console.error('Error fetching feedback:', err);
    }
  );
}
  delete(id:number){
  this.feedbackService.deleteFeedback(id).subscribe(
    (resp)=> {
      console.log(resp)
      this.getFeedback(0)
    },
    (err) =>{
      console.log(err)
    }
  )
}

  visualizza(id:number) {
  this.router.navigate(['home/feedback', {Id: id}])
  }
  getFeedback(id :number) {
    if(this.singleUser){
      this.feedbackService.getUserFeedback(id).subscribe(
        (resp: Feedback[])=> {
          this.feedbackTableData.data = resp;
          console.log(resp)
          if(this.feedbackList.length==0 ){
            setTimeout(() => {
              this.singleUser=false;
              location.reload();
          }, 3500);}
        },
        (err) =>{
          console.log(err)
        }
      )
    }
    else{
    this.feedbackService.getFeedback().subscribe(
      (resp: Feedback[])=> {
        this.feedbackTableData.data = resp;
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  }
}
