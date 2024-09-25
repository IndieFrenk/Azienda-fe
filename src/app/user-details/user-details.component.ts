import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Feedback } from '../_models/feedback.model';
import { SearchUser } from '../_models/searchUser.model';
import { FeedbackService } from '../_services/feedback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import {Location} from '@angular/common';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  @ViewChild ('feedbackTable', { read: MatSort, static: false}) sortFeed!: MatSort;
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
    dataSottomissione: ''
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private feedbackService:FeedbackService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _liveAnnouncer:LiveAnnouncer,
    private location: Location
  ){}
  userId = 0
  
  feedbackListCut: any[] = []

  displayedColumnsFeedback: string[] = ['Titolo','Contenuto','Utente', 'Data','Contesti', 'Risposte'];

  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = +params['userId'];
      console.log(this.userId)
      if (this.userId) {
        this.getFeedback();
      } else {
        console.log("Non ha nessun feedback");
      }
    });
  }
  ngAfterViewInit() {
    this.getFeedback()
    this.feedbackTableData.paginator = this.paginator;
  }

  handlePageEventFeed(pageEvent:PageEvent) {
    console.log('handlePageEvent', pageEvent)
    
    this.getFeedback()
  }
  searchFeedback(searchKey: NgForm): void {
    console.log(searchKey.value)
    this.search = searchKey.value
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
visualizza(id:number) {
  this.router.navigate(['home/feedback', {Id: id}])
  }
delete(id:number){
  this.feedbackService.deleteFeedback(id).subscribe(
    (resp)=> {
      console.log(resp)
      this.getFeedback()
    },
    (err) =>{
      console.log(err)
    }
  )
}

  getFeedback() {
    this.feedbackService.getUserFeedback(this.userId).subscribe(
      (resp: Feedback[])=> {
        this.feedbackTableData.data = resp;
        console.log(resp)
        
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  }

