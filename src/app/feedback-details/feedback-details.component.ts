import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../_services/feedback.service';
import { Feedback } from '../_models/feedback.model';
import { Contesto } from '../_models/contesto.model';
import { NgForm } from '@angular/forms';
import { Risposta } from '../_models/risposta.model';
import { StorageService } from '../_services/storage.service';
import { User } from '../_models/user.model';
import {Location} from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrl: './feedback-details.component.css'
})
export class FeedbackDetailsComponent {
  isLoading: boolean = false;
  rispList: any[] = []
  feedback: Feedback ={
    id: 0,
    titolo: '',
    contenuto:'',
    email: '',
    contesto: [], 
    dataSottomissione: '',
    stato: true
  }
  listaContesti: Contesto[] =[];
  contesto: Contesto ={
    id: 0,

    definizione:''
  }
  risposta: Risposta ={
    id : 0,
    email: '',
    contenuto: '',
    user_id: 0,
    feedback_id: 0
  }
  statoThread: boolean = false
  feedbackId = 0
  displayedColumns: string[] = ['Contenuto', 'Data'];
  selectedProductIndex = 0;
  rispostaPresente: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private feedbackService: FeedbackService,
    private storageService: StorageService,
    private location: Location) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.feedbackId = +params['Id'];
      console.log(this.feedbackId)
      if (this.feedbackId) {
        this.getFeedback(this.feedbackId);
        this.getRisposte(this.feedbackId);
      } else {
        console.log("The feedback doesn't exist");
      }
    },
  );
  setTimeout(() => this.initTooltips(), 100);
  }
  ngAfterViewInit(): void {
    
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
}
 
  private initTooltips(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }

   isAdmin(){ //metodo temporaneo 
    if(this.storageService.getIdValue()?.email == "admin@mail") {
      return true
    }
    else {
      return false
    }
   }
   private destroyTooltips(): void {
    $('[data-toggle="tooltip"]').tooltip('dispose');
  }
  deleteFeedback(id:number){
    this.feedbackService.deleteFeedback(id).subscribe(
      (resp)=> {
        console.log(resp)
        if (this.storageService.getIdValue()?.email == "admin@mail"){
          this.router.navigate(["home/admin/feedbackList"]);
        }
        else{
          this.router.navigate(["home/user"]);
        }
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  changeStatus(){
    this.destroyTooltips();
    this.feedbackService.changeStatus(this.feedback.id).subscribe(
      (resp)=> {
        this.getFeedback(this.feedbackId)
        console.log(resp)
        setTimeout(() => this.initTooltips(), 100);
      },
      (err) =>{
        console.log(err)
      }
    )
  }
   delete(id: number) {
    this.destroyTooltips();
    const index = this.rispList.findIndex(x=> x.id === id)
      this.rispList.splice(index,1)
      this.rispList = [...this.rispList]
    this.feedbackService.deleteRisposta(id).subscribe(
      (resp)=> {
        console.log(resp)
        setTimeout(() => this.initTooltips(), 100);
      },
      (err) =>{
        console.log(err)
      }
    )
    }
   getRisposte(id: number){
    this.feedbackService.getRisposte(id).subscribe(
      (resp: Risposta[])=> {
        if(resp.length != 0){
          this.rispostaPresente = true
        }
        this.rispList = resp
        console.log(resp)
      },
      (err) =>{
        console.log(err)
      }
    )
  }
   inviaRisposta(rispForm: NgForm) {
    this.isLoading = true;
     console.log(this.risposta)
    this.risposta = rispForm.value
    this.risposta.feedback_id = this.feedbackId
    console.log(this.risposta)
    const user =  this.storageService.getIdValue() 

    if (user) { 
      this.risposta.user_id= user.id
      this.feedbackService.sendRisposta(this.risposta).subscribe(
        (resp)=>{
          console.log(resp)
          this.rispList = [...this.rispList, resp]
          rispForm.reset()
          this.isLoading = false;
        },
        (err) =>{
          console.log(err)
        }
      )
    }
    }
  getFeedback(id: number): void{
    this.feedbackService.getFeedbackDetails(id).subscribe(
      (resp: Feedback) => {
        this.feedback = {
          id: resp.id,
          titolo: resp.titolo,
          contenuto: resp.contenuto,
          email: resp.email,
          contesto: resp.contesto, 
          dataSottomissione: resp.dataSottomissione ,
          stato: resp.stato
        };
        this.statoThread = resp.stato
        console.log(this.statoThread);
      },
      (err) =>{
        console.log(err)
      }
    )
    
  }

}
