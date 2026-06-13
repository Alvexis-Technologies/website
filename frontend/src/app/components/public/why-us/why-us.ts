import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-why-us',
  imports: [CommonModule],
  templateUrl: './why-us.html',
  styleUrls: ['./why-us.css']
})
export class WhyUsComponent {
  reasons = [
    {
      icon: 'bi-lightbulb',
      title: 'Innovative Solutions',
      description: 'Cutting-edge technology tailored to solve real-world problems',
      stat: '10+',
      statLabel: 'Innovations'
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure Systems',
      description: 'Enterprise-grade security protecting your valuable data',
      stat: '99.9%',
      statLabel: 'Security Uptime'
    },
    {
      icon: 'bi-cpu',
      title: 'Modern Technologies',
      description: 'Latest frameworks and tools for optimal performance',
      stat: '15+',
      statLabel: 'Technologies'
    },
    {
      icon: 'bi-graph-up',
      title: 'Scalable Platforms',
      description: 'Solutions that grow with your business needs',
      stat: '∞',
      statLabel: 'Scalability'
    },
    {
      icon: 'bi-heart',
      title: 'Client-Focused',
      description: 'Dedicated support and collaborative development',
      stat: '100%',
      statLabel: 'Satisfaction'
    }
  ];
}