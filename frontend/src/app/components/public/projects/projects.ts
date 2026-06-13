import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent {
  projects = [
    {
      title: 'ArdhiVision-Tz',
      description: 'Digital land management platform with GIS integration, escrow marketplace, and government verification workflows.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      tags: ['Angular', 'Node.js', 'PostGIS', 'Blockchain'],
      link: '#'
    },
    {
      title: 'AI Security Platform',
      description: 'Intelligent security monitoring system using computer vision and anomaly detection for enterprise clients.',
      image: 'images/projects/agrihealth.png',
      tags: ['Python', 'TensorFlow', 'React', 'AWS'],
      link: '#'
    },
    {
      title: 'Smart Land Management',
      description: 'Integrated cadastral system with real-time parcel mapping and automated verification workflows.',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop',
      tags: ['Angular', 'PostgreSQL', 'Leaflet', 'Node.js'],
      link: '#'
    },
    {
      title: 'Intelligent Business Suite',
      description: 'Enterprise resource planning system with AI-powered analytics and automation capabilities.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      tags: ['React', 'Django', 'MongoDB', 'AI/ML'],
      link: '#'
    }
  ];

  viewProject(link: string): void {
    window.open(link, '_blank');
  }
}