// frontend/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
// import { AuthInterceptor } from './app/interceptors/auth';
// import { ErrorInterceptor } from './app/interceptors/error';

import { withInMemoryScrolling } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
      provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    // provideHttpClient(
    //   withInterceptors([AuthInterceptor, ErrorInterceptor])
    // ),
    // provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
      tapToDismiss: true
    })
  ]
}).catch(err => console.error(err));


// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, withInMemoryScrolling } from '@angular/router';
// import { AppComponent } from './app/app';
// import { routes } from './app/app.routes';
// import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(
//       routes,
//       withInMemoryScrolling({
//         scrollPositionRestoration: 'enabled',
//         anchorScrolling: 'enabled'
//       })
//     ),
//     ...appConfig.providers
//   ]
// }).catch(err => console.error(err));





// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { AppComponent } from './app/app';
// import { routes } from './app/app.routes';
// import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes, {
//       scrollPositionRestoration: 'enabled',
//       anchorScrolling: 'enabled'
//     }),
//     ...appConfig.providers // merge any other providers you defined
//   ]
// }).catch(err => console.error(err));

// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
