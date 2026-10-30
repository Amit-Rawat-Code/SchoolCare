import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const http = inject(HttpClient);
  const router = inject(Router);

  // 🚫 Do not intercept auth endpoints
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh-token')
  ) {
    return next(req.clone({ withCredentials: true }));
  }

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError(err => {

      if (err.status === 401) {
        return http.post(
          'http://localhost:5128/api/auth/refresh-token',
          {},
          { withCredentials: true }
        ).pipe(
          switchMap(() => next(authReq)),
          catchError(() => {
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
