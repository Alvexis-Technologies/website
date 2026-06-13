import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  quickLinks = [
    { name: 'Home', link: 'hero' },
    { name: 'About', link: 'about' },
    { name: 'Services', link: 'services' },
    { name: 'Projects', link: 'projects' },
    { name: 'Team', link: 'team' },
    { name: 'Contact', link: 'contact' }
  ];
  
  services = [
    { name: 'AI Solutions', link: 'services' },
    { name: 'Web Development', link: 'services' },
    { name: 'Mobile Apps', link: 'services' },
    { name: 'Cybersecurity', link: 'services' },
    { name: 'Cloud Platforms', link: 'services' }
  ];
  
  socialLinks = [
    { icon: 'bi-linkedin', link: 'https://www.linkedin.com/company/alvexis-technologies/', name: 'LinkedIn' },
    // { icon: 'bi-twitter', link: '#', name: 'Twitter' },
    { icon: 'bi-instagram', link: 'https://www.instagram.com/alvexis_technologies/', name:'Instagram'},
    { icon: 'bi-youtube', link: 'https://youtube.com/@AlvexisTechnologies', name: 'YouTube'},
    { icon: 'bi-github', link: 'https://github.com/organizations/Alvexis-Technologies/', name: 'GitHub' },
    { icon: 'bi-envelope', link: 'mailto:alvexis146@gmail.com', name: 'Email' }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onFooterLogoError(event: any): void {
    event.target.style.display = 'none';
  }
}