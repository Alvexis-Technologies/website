import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  isLoading = true;
  today: Date = new Date();

  
  constructor(private dashboardService: DashboardService) {}
  
  ngOnInit(): void {
    this.loadDashboardStats();
  }
  
  loadDashboardStats(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.isLoading = false;
        this.createCharts();
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;
      }
    });
  }
  
  createCharts(): void {
    // User Growth Chart
    if (this.stats.userGrowth && this.stats.userGrowth.length > 0) {
      const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.stats.userGrowth.map((item: any) => item._id),
            datasets: [{
              label: 'New Users',
              data: this.stats.userGrowth.map((item: any) => item.count),
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
    
    // Activity Chart
    if (this.stats.hourlyActivity && this.stats.hourlyActivity.length > 0) {
      const ctx = document.getElementById('activityChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.stats.hourlyActivity.map((item: any) => `${item._id}:00`),
            datasets: [{
              label: 'Activities',
              data: this.stats.hourlyActivity.map((item: any) => item.count),
              backgroundColor: '#27ae60',
              borderRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  }
  
  getPercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}