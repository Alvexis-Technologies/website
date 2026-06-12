import { Component, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Components
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { ServicesComponent } from './components/services/services';
import { ProjectsComponent } from './components/projects/projects';
import { TeamComponent } from './components/team/team';
import { WhyUsComponent } from './components/why-us/why-us';
import { TechnologiesComponent } from './components/technologies/technologies';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { LoginComponent } from './components/portal/login/login';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [
    CommonModule,
    // RouterOutlet,   
    HttpClientModule,

    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ProjectsComponent,
    TeamComponent,
    WhyUsComponent,
    TechnologiesComponent,
    ContactComponent,
    FooterComponent
   ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('frontend');
}













// // frontend/src/app/app.component.ts
// import { Component, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ToastrModule } from 'ngx-toastr';
// import { AuthService } from './services/auth';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     CommonModule,
//     // DashboardComponent,
//     // RegisterComponent,
//     // LoginComponent,
//     // AssignmentSubmitComponent,
//     // CourseViewComponent,
//     // LiveClassComponent,
//     ],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// // export class AppComponent {
// //   protected readonly title = signal('Alearning-frontend');
// // }
// export class AppComponent{
//   title = 'Alvexis Technologis Portal';
//   constructor(){}
// }