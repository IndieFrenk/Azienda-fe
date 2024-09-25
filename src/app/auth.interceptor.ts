
  import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { Observable, catchError, switchMap, throwError } from "rxjs";

import { error } from "console";
import { getEnvironmentData } from "worker_threads";
import { AuthService } from "./_services/auth.service";
import { StorageService } from "./_services/storage.service";








@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;

    constructor(
        private authService:AuthService,
        private storageService: StorageService
    ){}

    intercept(request:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        request = request.clone({
            withCredentials: true ,
        });
        
        return next.handle(request).pipe(
            catchError((error) => {
                console.log(error.status)
                if (
                    error instanceof HttpErrorResponse &&
                    !request.url.includes('auth/login') &&
                    error.status === 401
                ) {
                    return this.handle401Error(request,next);
                }
                return throwError(()=> error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

        if (!this.isRefreshing) {
            this.isRefreshing = true;

            if (this.storageService.isLoggedIn()) {
                return this.authService.refreshToken().pipe(
                    switchMap(() => {
                        this.isRefreshing = false;

                        return next.handle(request);
                    }),
                    catchError((error)=> {
                        this.isRefreshing = false;
                        if (error.status == '403' ) {
                           
                           this.storageService.signOut();
                        }
                        return throwError(()=> error);
                    })
            )}
        } 
        return next.handle(request);
    }
   
}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
];

    
