
// frontend/src/app/interceptors/error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An error occurred';
      let statusMessage = '';
      
      // Client-side error
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
        console.error('Client Error:', error.error);
        toastr.error(errorMessage, 'Client Error');
      } 
      // Server-side error
      else {
        errorMessage = error.error?.error || error.error?.message || error.message;
        statusMessage = error.error?.status || error.statusText;
        
        console.error(`Server Error ${error.status}:`, error.error);
        
        // Handle specific status codes
        switch (error.status) {
          case 0:
            toastr.error('Cannot connect to server. Please check your internet connection.', 'Connection Error');
            break;
            
          case 400:
            toastr.error(errorMessage || 'Bad request. Please check your input.', 'Bad Request');
            break;
            
          case 401:
            toastr.error('Your session has expired. Please login again.', 'Unauthorized');
            authService.logout();
            router.navigate(['/login']);
            break;
            
          case 403:
            toastr.error(errorMessage || 'You do not have permission to access this resource.', 'Access Denied');
            router.navigate(['/dashboard']);
            break;
            
          case 404:
            toastr.warning(errorMessage || 'The requested resource was not found.', 'Not Found');
            break;
            
          case 409:
            toastr.warning(errorMessage || 'Conflict with current state of the resource.', 'Conflict');
            break;
            
          case 422:
            toastr.error(errorMessage || 'Validation failed. Please check your input.', 'Validation Error');
            break;
            
          case 429:
            toastr.error('Too many requests. Please try again later.', 'Rate Limit Exceeded');
            break;
            
          case 500:
            toastr.error('Internal server error. Please try again later.', 'Server Error');
            break;
            
          case 502:
            toastr.error('Bad gateway. The server is temporarily unavailable.', 'Gateway Error');
            break;
            
          case 503:
            toastr.error('Service unavailable. Please try again later.', 'Service Error');
            break;
            
          default:
            toastr.error(errorMessage || `Error ${error.status}: ${statusMessage}`, 'Error');
        }
      }
      
      return throwError(() => error);
    })
  );
};
// // frontend/src/app/interceptors/error.interceptor.ts
// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';

// @Injectable()
// export class ErrorInterceptor implements HttpInterceptor {
//   constructor(
//     private toastr: ToastrService,
//     private router: Router
//   ) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => {
//         let errorMessage = 'An error occurred';
        
//         if (error.error instanceof ErrorEvent) {
//           // Client-side error
//           errorMessage = error.error.message;
//           console.error('Client Error:', error.error);
//         } else {
//           // Server-side error
//           errorMessage = error.error?.error || error.error?.message || `Error ${error.status}: ${error.statusText}`;
//           console.error('Server Error:', error.status, error.error);
          
//           // Handle specific status codes
//           switch (error.status) {
//             case 403:
//               this.toastr.error('You do not have permission to perform this action', 'Access Denied');
//               break;
//             case 404:
//               this.toastr.warning('Resource not found', 'Not Found');
//               break;
//             case 500:
//               this.toastr.error('Server error. Please try again later.', 'Server Error');
//               break;
//             default:
//               this.toastr.error(errorMessage, 'Error');
//           }
//         }
        
//         return throwError(() => error);
//       })
//     );
//   }
// }