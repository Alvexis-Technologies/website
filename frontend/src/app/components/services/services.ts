import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent {
  services = [
    {
      icon: 'bi-cpu',
      title: 'Artificial Intelligence',
      description: 'Custom AI solutions including machine learning, computer vision, and natural language processing.',
      color: '#667eea'
    },
    {
      icon: 'bi-window',
      title: 'Web Development',
      description: 'Modern, responsive web applications using Angular, React, and cutting-edge technologies.',
      color: '#764ba2'
    },
    {
      icon: 'bi-phone',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      color: '#f093fb'
    },
    {
      icon: 'bi-robot',
      title: 'Intelligent Automation',
      description: 'Process automation, RPA, and intelligent workflow solutions for business efficiency.',
      color: '#4facfe'
    },
    {
      icon: 'bi-shield-lock',
      title: 'Cybersecurity',
      description: 'Enterprise-grade security solutions, penetration testing, and security audits.',
      color: '#43e97b'
    },
    {
      icon: 'bi-cloud',
      title: 'Cloud Platforms',
      description: 'Cloud architecture, migration, and management on AWS, Azure, and Google Cloud.',
      color: '#f5576c'
    },
    {
      icon: 'bi-arrow-repeat',
      title: 'Digital Transformation',
      description: 'End-to-end digital transformation strategy and implementation services.',
      color: '#ff9800'
    },
    {
      icon: 'bi-database',
      title: 'Data Management',
      description: 'Database design, optimization, and management including Big Data solutions.',
      color: '#00f2fe'
    }
  ];
}