
import { LoginComponent } from './login/login.component';
import { NgModule , viewChild} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule }   from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MY_DATE_FORMATS } from './custom-date-format';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { AdminComponent } from './admin/admin.component';
import {MatSelectModule} from '@angular/material/select';
import {  ReactiveFormsModule } from '@angular/forms';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import {MatIconModule} from '@angular/material/icon'; 
import {MatListModule} from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserComponent } from './user/user.component';
import {MatSortModule, Sort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { RecoverPassComponent } from './recover-pass/recover-pass.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FooterComponent } from './footer/footer.component';
import { UserPageComponent } from './user-page/user-page.component';
import { DipendenteDetailComponent } from './dipendente/dipendente-detail/dipendente-detail.component';
import { DipendenteListComponent } from './dipendente/dipendente-list/dipendente-list.component';
import { UnitaOrganizzativaListComponent } from './unita-organizzativa/unita-organizzativa-list/unita-organizzativa-list.component';
import { UnitaOrganizzativaDetailComponent } from './unita-organizzativa/unita-organizzativa-detail/unita-organizzativa-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SendFeedbackComponent,
    AdminComponent,
    FeedbackDetailsComponent,
    UserComponent,
    FeedbackListComponent,
    UserListComponent,
    UserDetailsComponent,
    ChangePassComponent,
    RecoverPassComponent,
    NotFoundPageComponent,
    FooterComponent,
    UserPageComponent,
    DipendenteListComponent,
    DipendenteDetailComponent,
    UnitaOrganizzativaListComponent,
    UnitaOrganizzativaDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
