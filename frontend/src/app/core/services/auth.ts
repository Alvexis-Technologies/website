// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/api/auth';
//   private currentUserSubject = new BehaviorSubject<any>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();
  
//   constructor(private http: HttpClient) {
//     const storedUser = localStorage.getItem('currentUser');
//     if (storedUser) {
//       this.currentUserSubject.next(JSON.parse(storedUser));
//     }
//   }
  
//   login(credentials: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
//       tap((response: any) => {
//         this.setAuthData(response.token, response.user);
//       })
//     );
//   }
  
//   register(userData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, userData);
//   }
  
//   logout(): Observable<any> {
//     return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
//       tap(() => {
//         this.clearAuthData();
//       })
//     );
//   }
  
//   getMe(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/me`);
//   }
  
//   changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/change-password`, data);
//   }
  
//   setAuthData(token: string, user: any): void {
//     localStorage.setItem('token', token);
//     localStorage.setItem('currentUser', JSON.stringify(user));
//     this.currentUserSubject.next(user);
//   }
  
//   clearAuthData(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }
  
//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }
  
//   getCurrentUser(): any {
//     return this.currentUserSubject.value;
//   }
  
//   isLoggedIn(): boolean {
//     return !!this.getToken() && !!this.getCurrentUser();
//   }
  
//   isAdmin(): boolean {
//     const user = this.getCurrentUser();
//     return user && user.role === 'admin';
//   }


// }









// frontend/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  headline?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.url;
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshTokenTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loadStoredUser();
    this.startRefreshTokenTimer();
  }

  // private loadStoredUser(): void {
  //   const token = localStorage.getItem('accessToken');
  //   const user = localStorage.getItem('user');
    
  //   if (token && !this.jwtHelper.isTokenExpired(token) && user) {
  //     this.currentUserSubject.next(JSON.parse(user));
  //     this.startRefreshTokenTimer();
  //   } else {
  //     this.logout();
  //   }
  // }
  private loadStoredUser(): void {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');

  if (token && !this.jwtHelper.isTokenExpired(token) && user) {
    this.currentUserSubject.next(JSON.parse(user));
    this.startRefreshTokenTimer();
  } else {
    // REMOVE logout()
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.storeTokens(response);
          this.currentUserSubject.next(response.user);
          this.startRefreshTokenTimer();
          this.toastr.success('Login successful!', 'Welcome back!');
        }),
        catchError(error => {
          this.toastr.error(error.error?.error || 'Login failed', 'Error');
          return throwError(() => error);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(() => {
          this.toastr.success('Registration successful! Please login.', 'Success');
        }),
        catchError(error => {
          this.toastr.error(error.error?.error || 'Registration failed', 'Error');
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    
    this.stopRefreshTokenTimer();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
    this.toastr.info('Logged out successfully', 'Goodbye!');
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.startRefreshTokenTimer();
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private storeTokens(response: LoginResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  private startRefreshTokenTimer(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    const expires = this.jwtHelper.getTokenExpirationDate(token);
    if (!expires) return;
    
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }
}