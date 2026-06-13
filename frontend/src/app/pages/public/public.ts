import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeroComponent } from '../../components/public/hero/hero';
import { AboutComponent } from '../../components/public/about/about';
import { ServicesComponent } from '../../components/public/services/services';
import { ProjectsComponent } from '../../components/public/projects/projects';
import { TeamComponent } from '../../components/public/team/team';
import { WhyUsComponent } from '../../components/public/why-us/why-us';
import { TechnologiesComponent } from '../../components/public/technologies/technologies';
import { ContactComponent } from '../../components/public/contact/contact';


@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ProjectsComponent,
    TeamComponent,
    WhyUsComponent,
    TechnologiesComponent,
    ContactComponent
  ],
  templateUrl: './public.html',
  styleUrl: './public.css'
})
export class PublicComponent {}