import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Feedback } from '../_models/feedback.model';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { FeedbackService } from '../_services/feedback.service';
import { Router } from '@angular/router';
import { User } from '../_models/user.model';
import { Search } from '../_models/search.model';
import { Contesto } from '../_models/contesto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchUser } from '../_models/searchUser.model';
import { PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from '../custom-date-adapter';


Chart.register(...registerables);
interface FeedbackDataPoint {
  date: Date;
  count: number;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }  // Set locale to Italian
  ]
})
export class AdminComponent  {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild ('feedbackTable', { read: MatSort, static: false}) sortFeed!: MatSort;
  chart: Chart | undefined;
  feedbackData: FeedbackDataPoint[] = [];
  filteredFeedbackData: FeedbackDataPoint[] = [];
  dateRangeForm: FormGroup;
  maxDate: Date;
  search: SearchUser ={
    id: '0',
    contenuto: '',
    data: ''
  }
  contesto: Contesto ={
    id:0,
    definizione: ''
  }
  listaContesti: any[] = []
  feedbackList: Feedback[] = []
  feedbackTableData = new MatTableDataSource<any>([]);
  userTableData = new MatTableDataSource<any>([]);
  userList: User[] = []
  feedback: Feedback ={
    id: 0,
    titolo: '',
    contenuto:'',
    email: '',
    contesto: [], 
    dataSottomissione: ''
  }
  feedbackOggi = 0
  constructor(
    private feedbackService:FeedbackService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _liveAnnouncer:LiveAnnouncer,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ){
    this.maxDate = new Date();
    this.dateRangeForm = this.formBuilder.group({
    startDate: [''],
    endDate: ['']
    });
    this.dateAdapter.setLocale('it-IT');  // Set locale to Italian
}

  singleUser: boolean = false;

  contesti = new FormControl();
  
  displayedColumnsFeedback: string[] = ['Titolo','Contenuto','Utente', 'Data','Contesti', 'Risposte'];
  displayedColumnsUsers: string[] = ['Nome', 'Cognome', 'Email', 'Azioni'];
  displayedColumnsUser: string[] = ['Contenuto','Data', 'Contesti','Azioni'];
  displayedColumnsContesti: string[] = ['Definizione','Azioni'];

  ngOnInit(): void {
    this.loadFeedbackData();
    this.getFeedback(0);
    this.getContesti();
  }
  
  ngAfterViewInit() {
    if (Object.keys(this.feedbackData).length > 0) {
      this.createChart();
    }
    this.feedbackTableData.sort = this.sortFeed;
    
  }
  //Grafico
  loadFeedbackData() {
    this.feedbackService.getFeedback().subscribe(
      (resp: Feedback[]) => {
        this.feedbackData = this.groupFeedbackByDate(resp);
        this.filteredFeedbackData = [...this.feedbackData];
        if (this.chartCanvas) {
          this.createChart();
        }
      },
      (err) => {
        console.error('Errore nel caricamento dei dati:', err);
      }
    );
  }
  groupFeedbackByDate(feedbacks: Feedback[]): FeedbackDataPoint[] {
    const groupedData: { [key: string]: number } = {};
    feedbacks.forEach(feedback => {
      const date = new Date(feedback.dataSottomissione);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      groupedData[dateString] = (groupedData[dateString] || 0) + 1;
    });

    return Object.entries(groupedData)
      .map(([dateString, count]) => ({
        date: new Date(dateString),
        count
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  filterDataAndUpdateChart() {
    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the entire end day

      this.filteredFeedbackData = this.feedbackData.filter(data => 
        data.date >= start && data.date <= end
      );
    } else {
      this.filteredFeedbackData = [...this.feedbackData];
    }

    this.updateChart();
  }
  onDateChange(event: MatDatepickerInputEvent<Date>, isStart: boolean) {
    if (isStart) {
      this.dateRangeForm.patchValue({ startDate: event.value });
    } else {
      this.dateRangeForm.patchValue({ endDate: event.value });
    }
    this.filterDataAndUpdateChart();
  }
  updateChart() {
    if (this.chart) {
      const labels = this.filteredFeedbackData.map(data => this.formatDate(data.date));
      const counts = this.filteredFeedbackData.map(data => data.count);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = counts;
      this.chart.update();
    } else {
      this.createChart();
    }
  }
  createChart() {
    if (!this.chartCanvas) {
      console.error('Grafico non trovato');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    const labels = this.feedbackData.map(data => this.formatDate(data.date));
    const counts = this.feedbackData.map(data => data.count);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Feedback ricevuti',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: '#1b263b',
          borderWidth: 1,
          
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Numero di feedback ricevuti'
            },
            ticks: {
              font: {
                weight: 'bold',  
              },
            }
          },
          x: {
            title: {
              display: true,
              text: 'Data'
            },
            ticks: {
              font: {
                weight: 'bold',  
              },
            }
          }
        }
      }
    });
  }
  //Fine grafico

  createContesto(createForm: NgForm) {
    console.log(createForm.value)
    this.feedbackService.createContesto(createForm.value).subscribe(
      (resp: any[]) => {
        console.log(createForm.value)
        this.listaContesti = [...this.listaContesti, resp]
      },
      (err) => {
        console.error('Error creating contesto:', err);
      }
    );
  }
  getContesti() {
    this.feedbackService.getContesto().subscribe(
      (resp: Contesto[])=> {
        this.listaContesti = resp
        console.log(resp)
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  deleteCont(id:number){
    this.feedbackService.deleteContesto(id).subscribe(
      (resp)=> {
        console.log(resp)
        
        this.getContesti()
      },
      (err) =>{
        console.error('Cancella tutti i feedback correlati prima', err);
        this.snackBar.open('Cancella tutti i feedback correlati prima', 'Chiudi', {
          duration: 4000,
        });
      }
    )
  }
  
  singleUserChange() {
    this.singleUser = !this.singleUser
    if(!this.singleUser){ this.getFeedback(0)}
    }
  visualizza(id:number) {
    this.router.navigate(['home/feedback', {Id: id}])
    }
  visualizzaPerUtente(id:number) {
    this.singleUser = true
    this.getFeedback(id)
      }
  getFeedback(id :number) {
    this.feedbackService.getFeedback().subscribe(
      (resp: Feedback[])=> {
        console.log(resp)
        this.feedbackList = resp
        this.feedbackGiornalieri(resp)
        this.feedbackTableData = new MatTableDataSource(resp)
        this.feedbackTableData.sort = this.sortFeed;
        console.log(this.feedbackTableData.data)
        this.feedbackTableData.sort.sort({ id: 'dataSottomissione', start: 'desc', disableClear: false });
        this.feedbackTableData.data = this.feedbackTableData.sortData(this.feedbackTableData.data, this.feedbackTableData.sort);
        this.feedbackTableData.data = (this.feedbackTableData.data).slice(0,3)
        
        this.feedbackTableData.data = [...this.feedbackTableData.data]
      },
      (err) =>{
        console.log(err)
      }
    )
  }
  feedbackGiornalieri(feedback: Feedback[]){
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    this.feedbackOggi = feedback.filter(item => {
    const feedbackDate = new Date(item.dataSottomissione);
    feedbackDate.setHours(0, 0, 0, 0); 
    return feedbackDate.getTime() === today.getTime();
  }).length;
  }
}
  

  
