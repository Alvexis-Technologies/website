import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports:[CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements AfterViewInit {
  
  ngAfterViewInit(): void {
    this.initParticleEffect();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onLogoError(event: any): void {
    // Fallback to text if image fails to load
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="logo-fallback">AV</div>';
    }
  }

  private initParticleEffect(): void {
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
      const duration = 20 + index * 5;
      (shape as HTMLElement).style.animation = `float ${duration}s infinite ease-in-out`;
    });
  }
}