import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganigrammaService } from '../_services/organigramma.service';
import { UnitaOrganizzativa } from '../_models/unitaOrganizzativa.model';
import { Ruolo } from '../_models/ruolo.model';
import { Dipendente } from '../_models/dipendente.model';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-unita-dettaglio',
  templateUrl: './unita-dettaglio.component.html',
  styleUrls: ['./unita-dettaglio.component.css']
})
export class UnitaDettaglioComponent implements OnInit {
  ruoliKeys: string[] = [];
  unita: UnitaOrganizzativa | null = null;
  ruoli: Ruolo[] = [];
  ruoliAssegnati: Ruolo[] = [];
  availableRuoli: Ruolo[] = [];
  listaDipendenti: { [key: number]: Dipendente[] } = {};
  dipendentiUnita: Dipendente[] = [];
  selectedRuoloId: number | null = null;
  newRoleName: string = '';
  filteredDipendenti: Dipendente[] = [];
  displayedColumnsRuoli: string[] = ['Ruolo','Azioni'];
  ruoliConDipendenti: { [ruolo: string]: Dipendente[] } = {};
  selectedRuoliForNewDipendente: number[] = [];
  selectedRuoloIdForDipendente: number | null = null;
  newDipendente: Dipendente = {
    id: 0,
    nome: '',
    ruoli: [],
    unita: 0,
  };
  displayedColumnsDipendenti: string[] = ['Nome', 'Azioni'];
  selectedRuoloIdForNewDipendente: number | null = null;
  selectedDipendenteId: number | null = null;
  unitaT: any;
  ruoliT: any[] | undefined; 
  dipendentiUnitaT: any[] | undefined; 
  displayedColumns: string[] = ['ruolo', 'dipendente'];
  id = 0
  constructor(
    private route: ActivatedRoute,
    private organigrammaService: OrganigrammaService
  ) {}
  ruoliConDipendentiT = new MatTableDataSource();
  listaDipendentiT: { [key: number]: Dipendente[] } = {};
  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadUnita(this.id);
      this.loadAvailableRoles();
      this.getDipendenti();
    });
  }
  ngAfterViewInit(): void {
    this.ruoliConDipendentiT.data = this.ruoli.map(ruolo => {
      const dipendenti = this.listaDipendenti[ruolo.id] ?? []; 
      return { ruolo: ruolo.nome, dipendenti: dipendenti, id: ruolo.id };
    });
    console.log('Ruoli con dipendenti:', this.ruoliConDipendentiT.data);
  }
  deleteDipendente(dipendenteId: number): void {
    console.log(dipendenteId)
    console.log(this.id)
    this.organigrammaService.rimuoviDipendente(this.id, dipendenteId)
      .subscribe(
        () => {
          this.loadDipendentiUnita(this.unita!.id);
        },
        (err) => {
          console.error('Errore nella rimozione del dipendente:', err);
        }
      );
  }
  getDipendenti() {
    this.organigrammaService.getDipendentiNonAssegnatiAUnita(this.id).subscribe(
      (dipendenti) => {
        this.filteredDipendenti = dipendenti;
      },
      (err) => console.error('Errore nel caricamento dei dipendenti:', err));
  }
  loadUnita(id: number): void {
    this.organigrammaService.getUnitaById(id).subscribe(
      (unita) => {
        this.unita = unita;
        this.loadRuoliUnita(id);
        this.loadDipendentiUnita(id);
      },
      (err) => {
        console.error('Errore nel caricamento dell\'unità:', err);
      }
    ); 
  }
  loadDipendentiUnita(unitaId: number): void {
    const ruoliDipendentiPromises = this.ruoli.map(ruolo => {
      return this.organigrammaService.getRuoliDipendenteUnita(unitaId, ruolo.id).toPromise()
        .then(dipendenti => {
          if (dipendenti){
            this.dipendentiUnita = dipendenti;
          this.listaDipendenti[ruolo.id] = dipendenti;
          }
          return { id: ruolo.id, ruolo: ruolo.nome, dipendenti: dipendenti };
        })
        .catch(err => {
          console.error('Errore nel caricamento dei dipendenti:', err);
          return { ruolo: ruolo.nome, dipendenti: [] };
        });
      });

      Promise.all(ruoliDipendentiPromises).then((ruoliConDipendenti) => {
        this.ruoliConDipendentiT.data = ruoliConDipendenti;
        console.log('Ruoli con dipendenti aggiornati:', this.ruoliConDipendentiT.data);
      });
  }
  deleteRole(ruoloId: number): void {
    console.log('Deleting role with ID:', ruoloId);
    this.organigrammaService.rimuoviRuolo(this.id, ruoloId).subscribe(
      () => this.loadRuoliUnita(this.unita!.id),
      (err) => console.error('Errore nella rimozione del ruolo:', err)
    );
  }
  
  
  loadRuoliUnita(unitaId: number): void {
    this.organigrammaService.getRuoliUnita(unitaId).pipe(
      map(ruoli => ruoli.map(ruolo => {
        if (!isNaN(Number(ruolo.nome))) {
          const ruoloCorretto = this.availableRuoli.find(r => r.id === Number(ruolo.nome));
          if (ruoloCorretto) {
            return { ...ruolo, nome: ruoloCorretto.nome };
          }
        }
        return ruolo;
      }))
    ).subscribe(
      (ruoli) => { this.ruoli = ruoli;
        this.ruoliAssegnati = ruoli},
      (err) => console.error('Errore nel caricamento dei ruoli:', err)
    );
  }
 
  
  

  loadAvailableRoles(): void {
    this.organigrammaService.getRuoli().subscribe(
      (resp) => {
        this.availableRuoli = resp;
        if (this.unita) {
          this.loadRuoliUnita(this.unita.id);
        }
      },
      (err) => console.error('Errore nel caricamento dei ruoli disponibili:', err)
    );
  }

  assignRoleToUnit(): void {
    if (this.selectedRuoloId && this.unita) {
      const ruoloId = Number(this.selectedRuoloId);
      const ruoloSelezionato = this.availableRuoli.find(r => r.id === ruoloId);
      
      if (!ruoloSelezionato) {
        console.error('Ruolo non trovato', {
          selectedId: ruoloId,
          availableRoles: this.availableRuoli
        });
        return;
      }

      this.organigrammaService.aggiungiRuolo(this.unita.id, ruoloSelezionato.nome).subscribe(
        () => {
          this.loadRuoliUnita(this.unita!.id);
          this.selectedRuoloId = null;
        },
        (err) => console.error('Errore nell\'assegnazione del ruolo:', err)
      );
    }
  }

  createAndAssignRole(): void {
    if (this.newRoleName && this.unita) {
      this.organigrammaService.createRuoloPerUnita(this.unita.id, this.newRoleName).subscribe(
        () => {
          this.loadAvailableRoles(); 
          this.loadRuoliUnita(this.unita!.id);
          this.newRoleName = '';
        },
        (err) => console.error('Errore nella creazione e assegnazione del nuovo ruolo:', err)
      );
    }
  }

  

  assegnaRuoloADipendente(ruoloId: number, dipendenteId: number): void {
    this.organigrammaService.assegnaRuoloADipendente(ruoloId, dipendenteId).subscribe(
      () => {
        this.loadDipendentiUnita(this.unita!.id);
      },
      (err) => console.error('Errore nell\'assegnazione del ruolo al dipendente:', err)
    );
  }

  hasDipendenteRuolo(dipendente: Dipendente, ruoloId: number): boolean {
    return dipendente.ruoli.some(ruolo => ruolo.id === ruoloId);
  }
  addDipendente(): void {
    if (this.newDipendente.nome && this.unita && this.selectedRuoliForNewDipendente.length > 0) {
     
      const requestPayload = {
        nome: this.newDipendente.nome,
        unita: this.unita.id,
        ruoli: this.selectedRuoliForNewDipendente
      };
      console.log('Request payload:', requestPayload);
      this.organigrammaService.creaDipendenteConRuoliEUnita(requestPayload)
        .subscribe(
          (dipendente) => {
            this.loadDipendentiUnita(this.unita!.id);
           
          },
          (error) => {
            console.error('Errore durante la creazione del dipendente:', error);
           
          }
        );
    }
  }
  

  toggleRuoloSelection(ruoloId: number): void {
    const index = this.selectedRuoliForNewDipendente.indexOf(ruoloId);
    if (index === -1) {
      this.selectedRuoliForNewDipendente.push(ruoloId);
    } else {
      this.selectedRuoliForNewDipendente.splice(index, 1);
    }
  }

  isRuoloSelectedForNew(ruoloId: number): boolean {
    return this.selectedRuoliForNewDipendente.includes(ruoloId);
  }

  assegnaDipendenteARuolo(): void {
    if (this.selectedDipendenteId && this.selectedRuoloIdForDipendente) {
      this.organigrammaService.assegnaRuoloADipendente(
        this.selectedRuoloIdForDipendente,
        this.selectedDipendenteId
      ).subscribe(
        () => {
          this.loadDipendentiUnita(this.unita!.id);
          this.selectedDipendenteId = null;
          this.selectedRuoloIdForDipendente = null;
        },
        (err) => console.error('Errore nell\'assegnazione del dipendente al ruolo:', err)
      );
    }
  }

 
  creaDipendenteEAssegnaRuolo(): void {
  if (this.newDipendente.nome && this.selectedRuoloIdForNewDipendente && this.unita) {
    
    const requestPayload = {
      nome: this.newDipendente.nome,
      unita: this.unita.id,
      ruoli: [this.selectedRuoloIdForNewDipendente]
    };

    this.organigrammaService.creaDipendenteConRuoliEUnita(requestPayload)
      .subscribe(
        () => {
          this.loadDipendentiUnita(this.unita!.id);
          this.newDipendente = { id: 0, nome: '', ruoli: [], unita: 0 };
          this.selectedRuoloIdForNewDipendente = null;
        },
        (error) => {
          console.error('Errore nella creazione e assegnazione del nuovo dipendente:', error);
        }
      );
  } else if (this.selectedDipendenteId && this.selectedRuoloIdForDipendente) {
  
    const requestPayload = {
      id: this.selectedDipendenteId,
      nome: this.newDipendente.nome,
      unita: this.id,
      ruoli: [this.selectedRuoloIdForDipendente]
    };
    this.organigrammaService.creaDipendenteConRuoliEUnita(requestPayload)
      .subscribe(
        () => {
          this.loadDipendentiUnita(this.unita!.id);
          this.newDipendente = { id: 0, nome: '', ruoli: [], unita: 0 };
          this.selectedRuoloIdForNewDipendente = null;
        },
        (error) => {
          console.error('Errore nella creazione e assegnazione del nuovo dipendente:', error);
        }
      );
  }
}
}