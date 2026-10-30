import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError, of, map } from 'rxjs';
import { LoginRequest } from '../../auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();

  constructor(private http: HttpClient) {}

  /** 🔹 LOGIN */
  login(data: LoginRequest) {
    return this.http.post(
      'http://localhost:5128/api/auth/login',
      data,
      { withCredentials: true }
    ).pipe(
      tap(() => this.authState.next(true))
    );
  }

  /** 🔹 REFRESH TOKEN (used by interceptor) */
  refreshToken() {
    return this.http.post(
      'http://localhost:5128/api/auth/refresh-token',
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.authState.next(true))
    );
  }

  /** 🔹 LOGOUT */
  logout() {
    return this.http.post(
      'http://localhost:5128/api/auth/logout',
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.authState.next(false))
    );
  }

  /** 🔹 CHECK AUTH ON APP START / PAGE REFRESH */
  checkAuth() {
  return this.http.get(
    'http://localhost:5128/api/auth/me',
    { withCredentials: true }
  ).pipe(
    tap(() => this.authState.next(true)),
    map(() => true),
    catchError(() => {
      this.authState.next(false);
      return of(false);
    })
  );
}


  /** 🔹 SYNC CHECK (used by Guard) */
  isLoggedIn(): boolean {
    return this.authState.value;
  }
}
