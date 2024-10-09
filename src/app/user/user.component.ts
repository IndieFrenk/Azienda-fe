import { Component, OnInit, ViewChild } from '@angular/core';
import { Contesto } from '../_models/contesto.model';
import { Feedback } from '../_models/feedback.model';
import { FormControl, NgForm } from '@angular/forms';
import { StorageService } from '../_services/storage.service';
import { FeedbackService } from '../_services/feedback.service';
import { Router } from '@angular/router';
import { SearchUser } from '../_models/searchUser.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  @ViewChild(MatSort) sort!: MatSort;
  search: SearchUser ={
    id: '0',
    contenuto: '',
    data: ''
  }
  feedbackList: any[] = []
  feedbackTableData = new MatTableDataSource<any>([]);
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
    dataSottomissione: '',
    stato: false
  }
  feedbackSorted: Feedback[] = [];
  searchKey = ''

  contesti = new FormControl();
  displayedColumns: string[] = ['Titolo','Contenuto','Data', 'Contesti','Azioni'];
  
  constructor(
   
    private feedbackService:FeedbackService,
    private storageService:StorageService,
    private router: Router
  ){ }


  ngOnInit(): void {
    
    console.log(localStorage.getItem("id"))
    this.getContesti();
    this.getFeedback();
    console.log(this.getContesti())
   
    this.feedbackSorted = this.feedbackList.slice();
  }
  ngAfterViewInit(): void {
    
    this.feedbackTableData.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'data':
          return item.dataSottomissione ? new Date(item.dataSottomissione) : new Date();
      default:
        return item[property];
      }
    };
    this.feedbackTableData.sort = this.sort; 
  }
  visualizza(id:number) {
    this.router.navigate(['home/feedback', {Id: id}])
    }
    
  getFeedback() {
    const user = this.storageService.getIdValue()?.id;
    if (user){
    this.feedbackService.getUserFeedback(user).subscribe(
      (resp: Feedback[])=> {
        this.feedbackTableData = new MatTableDataSource(resp.reverse())
        this.feedbackList = resp.reverse()
        this.feedbackTableData.sort = this.sort;
        console.log(resp)
      },
      (err) =>{
        console.log(err)
      }
    )
  }
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
    console.log(feedbackForm.value)
    this.feedback = feedbackForm.value
    console.log(this.feedback)
    const user = this.storageService.getIdValue()?.email
    if (user){
    this.feedback.email = user
    }
    this.feedbackService.createFeedback(this.feedback).subscribe(
      (resp) =>{
        console.log(resp)
  
        this.feedbackList = [ resp,...this.feedbackList]
        feedbackForm.reset()
      },
      (err) =>{
        console.log(err)
      }
    )
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


