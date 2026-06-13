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
      description: 'Digital land management platform with GIS integration, and government verification workflows.',
      image: 'images/projects/lands.',
      tags: ['Angular', 'Node.js', 'PostGIS', 'Blockchain'],
      link: '#'
    },
    {
      title: 'Agri-Tech System',
      description: 'An AI-powered agricultural platform that detects and diagnoses vegetable crop diseases from images, helping farmers make informed treatment decisions and improve crop productivity',
      image: 'images/projects/agrihealth.png',
      tags: ['Python', 'TensorFlow', 'React', 'AWS'],
      link: '#'
    },
    // {
    //   title: 'Utenzi wangu',
    //   description: 'Integrated cadastral system with real-time parcel mapping and automated verification workflows.',
    //   image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop',
    //   tags: ['Angular', 'PostgreSQL', 'Leaflet', 'Node.js'],
    //   link: '#'
    // },
    {
      title: 'Utenzi wangu',
      description: 'A digital hymns platform featuring a mobile application and backend system that enables users to discover, read, share, and manage Swahili hymns through an intuitive and engaging experience.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      tags: ['React', 'Django', 'MongoDB', 'AI/ML'],
      link: '#'
    }
  ];

  viewProject(link: string): void {
    window.open(link, '_blank');
  }
}