import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-technologies',
  imports: [CommonModule],
  templateUrl: './technologies.html',
  styleUrls: ['./technologies.css']
})
export class TechnologiesComponent {
  technologies = [
    { name: 'Angular', icon: 'bi-window', color: '#DD0031' },
    { name: 'React', icon: 'bi-window', color: '#61DAFB' },
    { name: 'Node.js', icon: 'bi-node-plus', color: '#8CC84B' },
    { name: 'MongoDB', icon: 'bi-database', color: '#47A248' },
    { name: 'PostgreSQL', icon: 'bi-database', color: '#336791' },
    { name: 'Python', icon: 'bi-code-square', color: '#3776AB' },
    { name: 'TensorFlow', icon: 'bi-cpu', color: '#FF6F00' },
    { name: 'AWS', icon: 'bi-cloud', color: '#FF9900' },
    { name: 'Docker', icon: 'bi-box', color: '#2496ED' },
    { name: 'Kubernetes', icon: 'bi-grid', color: '#326CE5' },
    { name: 'Blockchain', icon: 'bi-link', color: '#3C3C3D' },
    { name: 'AI/ML', icon: 'bi-robot', color: '#00BCD4' }
  ];
}