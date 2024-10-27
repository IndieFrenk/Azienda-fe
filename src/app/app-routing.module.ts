import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { AdminComponent } from './admin/admin.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { RecoverPassComponent } from './recover-pass/recover-pass.component';
import { AuthGuard } from './auth.guard';
import { NotFoundError } from 'rxjs';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { OrganigrammaComponent } from './organigramma/organigramma.component';
import { UnitaDettaglioComponent } from './unita-dettaglio/unita-dettaglio.component';


const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch:'full'},
    {path: 'login', redirectTo: 'home/login', pathMatch:'full'}, 
    {path: 'home', component:HomeComponent},
    {path: 'home/login',component:LoginComponent},
    {path: 'home/sendFeedback',component:SendFeedbackComponent, canActivate: [AuthGuard], data: { role: 'user' }},
    {path: 'home/admin',component:AdminComponent, canActivate: [AuthGuard], data: { role: 'admin' }},
    {path: 'home/feedback',component:FeedbackDetailsComponent},
    {path: 'home/user/myFeedback',component:UserComponent, canActivate: [AuthGuard], data: { role: 'user' }},
    {path: 'home/user',component:UserPageComponent, canActivate: [AuthGuard], data: { role: 'user' }},
    {path: 'home/admin/userList',component:UserListComponent, canActivate: [AuthGuard], data: { role: 'admin' }},
    {path: 'home/admin/feedbackList',component:FeedbackListComponent, canActivate: [AuthGuard], data: { role: 'admin' }},
    {path: 'home/admin/userDetails',component:UserDetailsComponent, canActivate: [AuthGuard], data: { role: 'admin' }},
    {path: 'home/user/changePass', component:ChangePassComponent},
    {path: 'home/recoverPass', component:RecoverPassComponent},
    {path: 'home/organigramma', component:OrganigrammaComponent},
    { path: 'unita/:id', component: UnitaDettaglioComponent },
    
    { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  
}
