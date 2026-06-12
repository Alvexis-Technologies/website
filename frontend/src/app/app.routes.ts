import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { AuthGuard } from './guards/auth-guard';
import { LoginComponent } from './components/portal/login/login';


export const routes: Routes = [
  { path: '', component: AppComponent },
  // { path: 'login',component: LoginComponent},
  // { 
  //   path: 'login', 
  //   loadComponent: () => import('./components/portal/login/login').then(m => m.LoginComponent)
  // },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/portal/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' },
];


// import { Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth-guard';

// export const routes: Routes = [

//   // Default route
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   // Lazy loaded login
//   {
//     path: 'login',
//     loadComponent: () =>
//       import('./components/portal/login/login')
//         .then(m => m.LoginComponent)
//   },

//   // Protected dashboard
//   {
//     path: 'dashboard',
//     loadComponent: () =>
//       import('./components/portal/dashboard/dashboard')
//         .then(m => m.DashboardComponent),
//     canActivate: [AuthGuard]
//   },

//   // Wildcard LAST
//   { path: '**', redirectTo: 'login' }
// ];
