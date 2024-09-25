import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private location: Location) { }

  
  indietro(): void {
    this.location.back();
  }
}
