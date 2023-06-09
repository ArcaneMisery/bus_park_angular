import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, catchError, filter, finalize, from, switchMap, take, throwError } from 'rxjs';
import { ManageService } from 'src/app/services/manage.service';

@Injectable()
export class authInterceptor { }

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor(
    private cookieService: CookieService,
    private manageService: ManageService
    ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.cookieService.get("accesstoken");
    const role = this.cookieService.get("role");
    if (authToken) {
      request = this.addTokenHeader(request, authToken, role);
      return next.handle(request).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && !request.url.includes('user/sign_in') && error.status === 403) {
          return this.handle403Error(request, next);
        }

        return throwError(error);
      }));
    }
    return next.handle(request);
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const role = this.cookieService.get("role");
  
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.cookieService.get("accesstoken");
      if (token) {
        return this.manageService.refresh(token).pipe(
          switchMap((data: any) => {
            this.refreshTokenSubject.next(data.accessToken);
            const updatedRequest = this.addTokenHeader(request, data.accessToken, role);
            return next.handle(updatedRequest);
          }),
          catchError((err) => {
            this.isRefreshing = false;
            return throwError(err);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      } else {
        this.isRefreshing = false;
      }
    }
  
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        const updatedRequest = this.addTokenHeader(request, token, role);
        return next.handle(updatedRequest);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string, role: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        "Authorization": "Bearer " + token,
        "Role": role
      }
    });
  }
}