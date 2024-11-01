import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {

  constructor(
    private router:Router,
  ){}
  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['home'])
    }, 5000);
  }
}
