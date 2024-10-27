import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganigrammaService } from '../_services/organigramma.service';
import { UnitaOrganizzativa } from '../_models/unitaOrganizzativa.model';
import { Ruolo } from '../_models/ruolo.model';
import { Dipendente } from '../_models/dipendente.model';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-unita-dettaglio',
  templateUrl: './unita-dettaglio.component.html',
  styleUrls: ['./unita-dettaglio.component.css']
})
export class UnitaDettaglioComponent implements OnInit {
  ruoliKeys: string[] = [];
  unita: UnitaOrganizzativa | null = null;
  ruoli: Ruolo[] = [];
  availableRuoli: Ruolo[] = [];
  listaDipendenti: Dipendente[][] = [];
  dipendentiUnita: Dipendente[] = [];
  selectedRuoloId: number | null = null;
  newRoleName: string = '';
  filteredDipendenti: { [key: number]: Dipendente[] } = {};
  ruoliConDipendenti: { [ruolo: string]: Dipendente[] } = {};
  selectedRuoliForNewDipendente: number[] = [];
  newDipendente: Dipendente = {
    id: 0,
    nome: '',
    ruoli: [],
    unita: 0,
  };
  id = 0
  constructor(
    private route: ActivatedRoute,
    private organigrammaService: OrganigrammaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadUnita(this.id);
      this.loadAvailableRoles();
    });
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
    for (let i = 0; i < this.ruoli.length; i++) {
      this.organigrammaService.getRuoliDipendenteUnita(unitaId, this.ruoli[i].id).subscribe(
        (dipendenti) => {
          this.dipendentiUnita = dipendenti;
          this.listaDipendenti[i] = dipendenti;
          this.ruoliConDipendenti[this.ruoli[i].nome] = dipendenti;
          console.log('Dipendenti caricati:', this.listaDipendenti);
        },
        (err) => console.error('Errore nel caricamento dei dipendenti:', err)
      );
    }
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
      (ruoli) => this.ruoli = ruoli,
      (err) => console.error('Errore nel caricamento dei ruoli:', err)
    );
  }
  deleteRole(ruoloId: number): void {
     // Optional chaining to access id only if unita is not null
      this.organigrammaService.rimuoviRuolo(this.id, ruoloId).subscribe(
        () => this.loadRuoliUnita(this.unita!.id),
        (err) => console.error('Errore nella rimozione del ruolo:', err)
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
      // Converti selectedRuoloId in numero se non lo è già
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
          this.loadAvailableRoles(); // Ricarica tutti i ruoli disponibili
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
      // Create the request payload matching the backend structure
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
            // Reset form
            //this.newDipendente = { id: 0, nome: '', ruoli: [], unita: 0 };
            //this.selectedRuoliForNewDipendente = [];
          },
          (error) => {
            console.error('Errore durante la creazione del dipendente:', error);
            // You might want to add user feedback here, like a toast notification
          }
        );
    }
  }
  

  // Helper method to toggle role selection for new employee
  toggleRuoloSelection(ruoloId: number): void {
    const index = this.selectedRuoliForNewDipendente.indexOf(ruoloId);
    if (index === -1) {
      this.selectedRuoliForNewDipendente.push(ruoloId);
    } else {
      this.selectedRuoliForNewDipendente.splice(index, 1);
    }
  }

  // Helper method to check if a role is selected for new employee
  isRuoloSelectedForNew(ruoloId: number): boolean {
    return this.selectedRuoliForNewDipendente.includes(ruoloId);
  }
}