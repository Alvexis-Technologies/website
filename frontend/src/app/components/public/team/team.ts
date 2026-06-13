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
      name: 'Mr. Alfred Rwambo',
      role: 'Co-Founder | Product & AI Systems',
      expertise: 'AI Research & Enterprise Architecture',
      bio: 'Builds AI-driven solutions and helps define product direction.',
      // image: 'https://randomuser.me/api/portraits/men/32.jpg',
      image: 'images/team/a.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/james-mtambo',
        // twitter: 'https://twitter.com/jamesmtambo',
        github: 'https://github.com/jamesmtambo'
      }
    },
    {
      name: 'Mr Jastin Salvatory',
      role: 'Co-Founder & Mobile developer',
      expertise: 'Mobile application development',
      bio: 'Builds cross-platform mobile applications and user-friendly mobile experiences ',
      image: 'images/team/j.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/sarah-kilimanjaro',
        // twitter: 'https://twitter.com/sarahkili',
        github: 'https://github.com/sarahkili'
      }
    },
    {
      name: 'Mr Anovi Buckoti',
      role: 'Co-Founder | Software Architect',
      expertise: 'Full-Stack Engineering & Cloud Infrastructure',
      bio: 'Designs and builds scalable software systems and backend infrastructure',
      image: 'images/team/b.JPG',
      social: {
        linkedin: 'https://www.linkedin.com/in/buckoti/',
        // twitter: 'https://twitter.com/michaelnyerere',
        github: 'https://github.com/buckoti-lab/'
      }
    }
  ];
}