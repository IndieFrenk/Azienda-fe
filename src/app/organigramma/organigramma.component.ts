import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrganigrammaService } from '../_services/organigramma.service';
import { UnitaOrganizzativa } from '../_models/unitaOrganizzativa.model';
import { Ruolo } from '../_models/ruolo.model';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-organigramma',
  templateUrl: './organigramma.component.html',
  styleUrls: ['./organigramma.component.css']
})
export class OrganigrammaComponent implements OnInit {
  dipendenti: any[] = [];
  ruoli: Ruolo[] = [];
  unitaOrganizzative: UnitaOrganizzativa[] = [];
  data: TreeNode[] = [];
  unita: UnitaOrganizzativa | null = null;

  constructor(
    private organigrammaService: OrganigrammaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRuoli();
    this.loadOrganigramma();
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

  // Load organizational chart data
  loadOrganigramma(): void {
    this.organigrammaService.getUnitaOrganizzative().subscribe(
      (unitaOrganizzative) => {
        this.unitaOrganizzative = unitaOrganizzative;
        this.data = this.formatOrganizationalData(unitaOrganizzative);
      },
      (err) => {
        console.error('Error loading organizational units:', err);
      }
    );
  }

  // Format organizational data for PrimeNG's TreeNode structure
  formatOrganizationalData(units: UnitaOrganizzativa[]): TreeNode[] {
    return units.map((unit) => ({
      label: unit.nome,
      expanded: true,
      children: unit.dipendenti?.map((dipendente:any) => ({
        label: dipendente.nome,
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        children: dipendente.ruoli?.map((ruolo:any) => ({
          label: ruolo.nome,
          type: 'role',
          styleClass: 'p-role'
        }))
      }))
    }));
  }

  // Retrieve organizational unit by ID
  getUnitaById(id: number): void {
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

  // Update an organizational unit
  updateUnitaOrganizzativa(id: number, updatedUnita: UnitaOrganizzativa): void {
    this.organigrammaService.updateUnita(id, updatedUnita).subscribe(
      (resp) => {
        const index = this.unitaOrganizzative.findIndex((u) => u.id === id);
        if (index !== -1) this.unitaOrganizzative[index] = resp;
        console.log('Updated unit:', resp);
      },
      (err) => {
        console.error(`Error updating unit with ID ${id}:`, err);
      }
    );
  }

  // Delete an organizational unit
  deleteUnitaOrganizzativa(id: number): void {
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

  // Load all employees in a specific unit
  loadDipendentiUnita(unitaId: number): void {
    this.organigrammaService.getDipendentiUnita(unitaId).subscribe(
      (resp) => {
        this.dipendenti = resp;
        console.log(`Loaded employees for unit ID ${unitaId}:`, resp);
      },
      (err) => {
        console.error(`Error loading employees for unit ID ${unitaId}:`, err);
      }
    );
  }

  // Add an employee to a unit
  aggiungiDipendente(unitaId: number, dipendenteId: number): void {
    this.organigrammaService.aggiungiDipendente(unitaId, dipendenteId).subscribe(
      (resp) => {
        console.log(`Employee ID ${dipendenteId} added to unit ID ${unitaId}`);
        this.loadDipendentiUnita(unitaId); // Refresh the employee list for the unit
      },
      (err) => {
        console.error(`Error adding employee ID ${dipendenteId} to unit ID ${unitaId}:`, err);
      }
    );
  }

  // Remove an employee from a unit
  rimuoviDipendente(unitaId: number, dipendenteId: number): void {
    this.organigrammaService.rimuoviDipendente(unitaId, dipendenteId).subscribe(
      (resp) => {
        console.log(`Employee ID ${dipendenteId} removed from unit ID ${unitaId}`);
        this.loadDipendentiUnita(unitaId); // Refresh the employee list for the unit
      },
      (err) => {
        console.error(`Error removing employee ID ${dipendenteId} from unit ID ${unitaId}:`, err);
      }
    );
  }

  // Transfer an employee between units
  trasferisciDipendente(dipendenteId: number, unitaDaId: number, unitaAId: number): void {
    this.organigrammaService.trasferisciDipendente(dipendenteId, unitaDaId, unitaAId).subscribe(
      () => {
        console.log(`Employee ID ${dipendenteId} transferred from unit ID ${unitaDaId} to unit ID ${unitaAId}`);
        this.loadDipendentiUnita(unitaDaId); // Refresh both units
        this.loadDipendentiUnita(unitaAId);
      },
      (err) => {
        console.error(`Error transferring employee ID ${dipendenteId} from unit ID ${unitaDaId} to unit ID ${unitaAId}:`, err);
      }
    );
  }

  // Create a new role
  createRuolo(newRuolo: Ruolo): void {
    this.organigrammaService.createRuolo(newRuolo).subscribe(
      (resp) => {
        this.ruoli.push(resp);
        console.log('Role created:', resp);
      },
      (err) => {
        console.error('Error creating role:', err);
      }
    );
  }

  // Get a specific role by ID
  getRuoloById(id: number): void {
    this.organigrammaService.getRuoloById(id).subscribe(
      (resp) => {
        console.log(`Role ID ${id} loaded:`, resp);
      },
      (err) => {
        console.error(`Error loading role ID ${id}:`, err);
      }
    );
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

  // Delete a role by ID
  deleteRuolo(id: number): void {
    this.organigrammaService.deleteRuolo(id).subscribe(
      () => {
        this.ruoli = this.ruoli.filter((r) => r.id !== id);
        console.log(`Role ID ${id} deleted.`);
      },
      (err) => {
        console.error(`Error deleting role ID ${id}:`, err);
      }
    );
  }
}
