import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../_models/user.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FeedbackService } from '../_services/feedback.service';
import { Contesto } from '../_models/contesto.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
 
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  contesto: Contesto ={
    id:0,
    definizione: ''
  }
  listaContesti: any[] = []

  userTableData = new MatTableDataSource<any>([]);
  userList: User[] = []

  constructor(
    private feedbackService:FeedbackService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _liveAnnouncer:LiveAnnouncer
  ){}
  singleUser: boolean = false;
  displayedColumnsUsers: string[] = ['Nome', 'Cognome', 'Email', 'Azioni'];

   ngOnInit(): void {
    this.getUser();
  }
  
  ngAfterViewInit() {
    
    this.userTableData.sort = this.sort;
    this.userTableData.paginator = this.paginator;
    
    
    
  }
  handlePageEvent(pageEvent:PageEvent) {
    console.log('handlePageEvent', pageEvent)
    this.getUser()
  }
  getUser() {
    this.feedbackService.getUser().subscribe(
      (resp: User[])=> {
        this.userTableData.data =resp
        
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  visualizzaPerUtente(id:number) {
    this.singleUser = true
    this.router.navigate(['home/admin/userDetails', {userId: id}])
      }
      
}
