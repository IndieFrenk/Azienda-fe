import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnitaOrganizzativa } from '../_models/unitaOrganizzativa.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-aggiungi-unita',
  templateUrl: './aggiungi-unita.component.html'
})
export class AggiungiUnitaComponent implements OnInit {
  unita: UnitaOrganizzativa = { id: 0, nome: '', unitaSuperiore: 0, ruoli: [], dipendenti: [], unitaSottostanti: [] };
  unitaOptions: UnitaOrganizzativa[];

  constructor(
    public dialogRef: MatDialogRef<AggiungiUnitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Data passed to dialog:', data);
 
    this.unitaOptions = data.unitaOptions;
  }

  ngOnInit(): void {
    
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(this.unita);
    }
  }
}
