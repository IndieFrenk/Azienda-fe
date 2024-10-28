import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrganigrammaService } from '../_services/organigramma.service';
import { UnitaOrganizzativa } from '../_models/unitaOrganizzativa.model';
import { Ruolo } from '../_models/ruolo.model';
import { TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AggiungiUnitaComponent } from '../aggiungi-unita/aggiungi-unita.component';
import { Router } from '@angular/router';
import { Dipendente } from '../_models/dipendente.model';

@Component({
  selector: 'app-organigramma',
  templateUrl: './organigramma.component.html',
  styleUrls: ['./organigramma.component.css']
})
export class OrganigrammaComponent implements OnInit {
  dipendenti: Dipendente[] = [];
  ruoli: Ruolo[] = [];
  unitaOrganizzative: UnitaOrganizzativa[] = [];
  unitaOrganizzativeComplete: UnitaOrganizzativa[] = [];
  nodi: TreeNode[] = [];
  unita: UnitaOrganizzativa | null = null;
  addUnita: UnitaOrganizzativa ={
    id: 0,
    nome: '',
    ruoli: [],
    dipendenti: [],
    unitaSuperiore: 0,
    unitaSottostanti: []
  };
  displayedColumnsDipendenti: string[] = ['Nome', 'Azioni'];
  displayedColumnsRuoli: string[] = ['Nome', 'Azioni'];
  delUnita : UnitaOrganizzativa | null = null;
  constructor(
    private organigrammaService: OrganigrammaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRuoli();
    this.loadOrganigramma();
    this.getDipendenti();
  }

  // Load all roles
  loadRuoli(): void {
    this.organigrammaService.getRuoli().subscribe(
      (resp) => {
        this.ruoli = resp;
        console.log('Roles loaded:', resp);
      },
      (err) => {
        console.error('Error loading roles:', err);
      }
    );
  }

  loadOrganigramma(): void {
    this.organigrammaService.getUnitaOrganizzative().subscribe(
      (unitaList) => {
        const detailRequests = unitaList.map(unita => this.organigrammaService.getUnitaById(unita.id));
        forkJoin(detailRequests).subscribe(
          (detailedUnits) => {
            this.unitaOrganizzativeComplete = detailedUnits;
            this.unitaOrganizzative = this.unitaOrganizzativeComplete;
            this.nodi = this.formatOrganizationalData(this.unitaOrganizzativeComplete);
            console.log('Formatted organizational data:', this.nodi);
          },
          (err) => console.error('Error loading detailed unit information:', err)
        );
      },
      (err) => console.error('Error loading organizational units:', err)
    );
  }

  getUnitaSuperiorId(unit: UnitaOrganizzativa): number | null {
    if (typeof unit.unitaSuperiore === 'number') {
      return unit.unitaSuperiore;
    }
    if (unit.unitaSuperiore && typeof unit.unitaSuperiore === 'object' && 'id' in unit.unitaSuperiore) {
      return (unit.unitaSuperiore as { id: number }).id;
    }
    return null;
  }

  formatOrganizationalData(units: UnitaOrganizzativa[]): TreeNode[] {
    const unitsMap = new Map<number, TreeNode>();
  
    // Create nodes for all units first
    units.forEach(unit => {
      const node: TreeNode = {
        label: unit.nome,
        type: 'unit',
        expanded: true,
        data: {
          id: unit.id,
          nome: unit.nome,
          unitaSuperiore: this.getUnitaSuperiorId(unit)
        },
        children: []
      };
      unitsMap.set(unit.id, node);
    });
  
    // Process parent-child relationships
    const rootNodes: TreeNode[] = [];
    units.forEach(unit => {
      const node = unitsMap.get(unit.id);
      if (node) {
        const parentId = this.getUnitaSuperiorId(unit);
        if (parentId !== null) {
          const parentNode = unitsMap.get(parentId);
          if (parentNode && parentNode.children) {
            parentNode.children.push(node);
          }
        } else {
          rootNodes.push(node);
        }
      }
    });
  
    return rootNodes;
  }
  deleteDipendente(dipendenteId: number): void {
    console.log(`Deleting employee with ID ${dipendenteId}`);
    // Implement delete functionality here, if required
  }

  deleteRuolo(ruoloId: number): void {
    console.log(`Deleting role with ID ${ruoloId}`);
    // Implement delete functionality here, if required
  }
  // Retrieve organizational unit by ID
  getUnitaById(id: number) {
    this.organigrammaService.getUnitaById(id).subscribe(
      (resp) => {
        this.unita = resp;
        console.log('Loaded unit:', resp);
        
      },
      (err) => {
        console.error(`Error loading unit with ID ${id}:`, err);
      }
    );
  }
  getRuoli() {
    this.organigrammaService.getAllRuoli().subscribe(
      (resp) => {
        this.ruoli = resp;
        console.log('Loaded roles:', resp);
      },
      (err) => {
        console.error('Error loading roles:', err);
      });
  }
  getDipendenti() {
    this.organigrammaService.getAllDipendenti().subscribe(
      (resp) => {
        this.dipendenti = resp;
        console.log('Loaded employees:', resp);
      },
      (err) => {
        console.error('Error loading employees:', err);
      });
  }



  // Delete an organizational unit
  deleteUnitaOrganizzativa(id: number): void {
    this.getUnitaById(id);
    this.delUnita = this.unita
    if (this.delUnita?.unitaSottostanti.length === 0) {
    this.organigrammaService.deleteUnita(id).subscribe(
      () => {
        this.unitaOrganizzative = this.unitaOrganizzative.filter((u) => u.id !== id);
        console.log(`Unit with ID ${id} deleted successfully.`);
      },
      (err) => {
        console.error(`Error deleting unit with ID ${id}:`, err);
      }
    );
  }
  }







 





  // Update a role by ID
 /* updateRuolo(id: number, updatedRuolo: Ruolo): void {
    this.organigrammaService.updateRuolo(id, updatedRuolo).subscribe(
      (resp) => {
        const index = this.ruoli.findIndex((r) => r.id === id);
        if (index !== -1) this.ruoli[index] = resp;
        console.log(`Role ID ${id} updated:`, resp);
      },
      (err) => {
        console.error(`Error updating role ID ${id}:`, err);
      }
    );
  }*/



  openDialog(): void {
    if (this.unitaOrganizzative) {
      const dialogRef = this.dialog.open(AggiungiUnitaComponent, {
        width: '400px',
        data: { unitaOptions: this.unitaOrganizzative }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.addUnitaOrganizzativa(result);
        }
      });
    } else {
      console.error("unitaOrganizzative non è stato caricato correttamente.");
    }
  }
  goToUnitaDettaglio(id: number): void {
    this.router.navigate(['/unita', id]);
  }
  addUnitaOrganizzativa(unita: UnitaOrganizzativa): void {
    console.log('Aggiunta unità organizzativa:', unita);
    this.organigrammaService.createUnita(unita).subscribe(
      (resp) => {
        console.log('Unità organizzativa aggiunta:', resp);
        this.loadOrganigramma(); // Ricarica i dati per aggiornare l'organigramma
      },
      (err) => {
        console.error('Errore durante l\'aggiunta dell\'unità organizzativa:', err);
      }
    );
  }
  
}
