import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';

import { Title,Meta } from '@angular/platform-browser';
import { TimeLike } from 'node:fs';


@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent implements AfterViewInit {

  //  constructor(private title:Title,private meta: Meta){}

  //   ngOnInit() {
  //     this.title.setTitle('About Us | Alvexis Technologies');

  //     this.meta.updateTag({
  //       name: 'description',
  //       content: 'Learn more about Alvexis Technologies and our mission in AI and software development.'
  //     });
  //  }
  
  ngAfterViewInit(): void {
    this.initScrollReveal();
  }

  private initScrollReveal(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }
}