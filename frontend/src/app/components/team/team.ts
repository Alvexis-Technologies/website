import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-team',
  imports: [CommonModule],
  templateUrl: './team.html',
  styleUrls: ['./team.css']
})
export class TeamComponent {
  teamMembers = [
    {
      name: 'Dr. James Mtambo',
      role: 'CEO & Founder',
      expertise: 'AI Research & Enterprise Architecture',
      bio: 'Former tech lead with 10+ years experience in building scalable AI systems. PhD in Computer Science from University of Dar es Salaam.',
      // image: 'https://randomuser.me/api/portraits/men/32.jpg',
      image: 'images/logo/FullLogo.png',
      social: {
        linkedin: 'https://linkedin.com/in/james-mtambo',
        twitter: 'https://twitter.com/jamesmtambo',
        github: 'https://github.com/jamesmtambo'
      }
    },
    {
      name: 'Sarah Kilimanjaro',
      role: 'CTO & Co-Founder',
      expertise: 'Full-Stack Development & Cloud Infrastructure',
      bio: 'Expert in modern web technologies and cloud-native architecture. Previously led engineering teams at leading tech firms.',
      image: 'images/logo/FullLogo.png',
      social: {
        linkedin: 'https://linkedin.com/in/sarah-kilimanjaro',
        twitter: 'https://twitter.com/sarahkili',
        github: 'https://github.com/sarahkili'
      }
    },
    {
      name: 'Michael Nyerere',
      role: 'Head of Product',
      expertise: 'Product Strategy & UX Design',
      bio: 'Product leader focused on building user-centric digital experiences. Certified Scrum Master and UX researcher.',
      image: 'images/logo/FullLogo.png',
      social: {
        linkedin: 'https://linkedin.com/in/michael-nyerere',
        twitter: 'https://twitter.com/michaelnyerere',
        github: 'https://github.com/michaelnyerere'
      }
    }
  ];
}