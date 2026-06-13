import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  activeSection = 'hero';
  isAutoScrolling = false;

  navItems = [
    { name: 'Home', link: 'hero', icon: 'bi-house-door' },
    { name: 'About', link: 'about', icon: 'bi-info-circle' },
    { name: 'Services', link: 'services', icon: 'bi-grid' },
    { name: 'Projects', link: 'projects', icon: 'bi-folder2-open' },
    { name: 'Technologies', link: 'technologies', icon: 'bi-cpu' },
    { name: 'Team', link: 'team', icon: 'bi-people' },
    { name: 'Contact', link: 'contact', icon: 'bi-envelope' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setActiveSectionOnScroll();
    console.table(
    this.navItems.map(item => {
      const el = document.getElementById(item.link);

      return {
        section: item.link,
        top: el?.offsetTop,
        height: el?.offsetHeight
      };
    })
);
  }



  ngAfterViewInit() {
  setTimeout(() => {
    console.table(
      this.navItems.map(item => {
        const el = document.getElementById(item.link);

        return {
          section: item.link,
          top: el?.offsetTop,
          height: el?.offsetHeight
        };
      })
    );
  }, 1000);
}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    // this.setActiveSectionOnScroll();
    if (!this.isAutoScrolling) {
       this.setActiveSectionOnScroll();
     }
  }


  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;

    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';

    const element = document.getElementById(sectionId);

    if (element) {
      this.isAutoScrolling = true;

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setTimeout(() => {
        this.isAutoScrolling = false;
      }, 800);
    }
  }

  // scrollToSection(sectionId: string): void {
  //   this.activeSection = sectionId;

  //   console.log('Clicked:', sectionId);

  //   this.isMobileMenuOpen = false;
  //   document.body.style.overflow = '';
    
  //   const element = document.getElementById(sectionId);

  //   if (element) {
  //     const offset = 80;
  //     const elementPosition = element.getBoundingClientRect().top;
  //     const offsetPosition = elementPosition + window.pageYOffset - offset;
      
  //     this.isAutoScrolling = true;

  //     window.scrollTo({
  //       top: offsetPosition,
  //       behavior: 'smooth'
  //     });

  //     setTimeout(() => {
  //       this.isAutoScrolling = false;
  //     }, 5000);
  //   }
  // }

  setActiveSectionOnScroll(): void {
    const sections = this.navItems.map(item => document.getElementById(item.link));
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    // const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section) {
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          this.activeSection = this.navItems[i].link;
          console.log('SCROLL ACTIVE:', this.navItems[i].link)
          break;
        }
      }
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  onLogoError(event: any): void {
    // Fallback to text if image fails
    const img = event.target;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.logo-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'logo-fallback';
      fallback.innerHTML = 'AT';
      parent.insertBefore(fallback, img.nextSibling);
    }
  }

  onMobileLogoError(event: any): void {
    const img = event.target;
    img.style.display = 'none';
  }

  navigateTo(route: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/app/dashboard']);
    } else {
      this.router.navigate([route]);
    }
  }
}