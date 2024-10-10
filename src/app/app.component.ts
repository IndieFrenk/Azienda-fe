import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FEED-fe';
  hideHeader: boolean = false;
  hideFooter: boolean = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideHeader = /^\/home\/login\/?.*$/.test(event.url);
       if ( event.url === '/home' )
        this.hideFooter = true;
      else this.hideFooter = false;
      }
    });
  }
 
}
