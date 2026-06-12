import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../../services/audit';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-logs',
  standalone:true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrls: ['./audit-logs.css']
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];
  statistics: any = {};
  isLoading = true;
  
  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  };
  
  filters = {
    action: '',
    startDate: '',
    endDate: ''
  };
  
  actions = [
    'property_create', 'property_update', 'property_delete', 'property_view',
    'verification_submit', 'verification_approve', 'verification_reject', 'verification_review',
    'document_upload', 'document_delete', 'status_change', 'ownership_transfer',
    'report_generate', 'audit_view', 'property_search'
  ];
  
  constructor(private auditService: AuditService) {}
  
  ngOnInit(): void {
    this.loadAuditLogs();
    this.loadStatistics();
  }
  
  loadAuditLogs(): void {
    this.isLoading = true;
    const params = {
      page: this.pagination.page,
      limit: this.pagination.limit,
      ...this.filters
    };
    
    this.auditService.getAuditLogs(params).subscribe({
      next: (response) => {
        this.logs = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.isLoading = false;
      }
    });
  }
  
  loadStatistics(): void {
    this.auditService.getAuditStatistics().subscribe({
      next: (response) => {
        this.statistics = response.data;
      },
      error: (error) => console.error('Error loading statistics:', error)
    });
  }
  
  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadAuditLogs();
  }
  
  onFilterChange(): void {
    this.pagination.page = 1;
    this.loadAuditLogs();
  }
  
  clearFilters(): void {
    this.filters = {
      action: '',
      startDate: '',
      endDate: ''
    };
    this.loadAuditLogs();
  }
  
  getActionBadgeClass(action: string): string {
    const classes: any = {
      'property_create': 'bg-success',
      'property_update': 'bg-info',
      'property_delete': 'bg-danger',
      'verification_approve': 'bg-success',
      'verification_reject': 'bg-danger',
      'verification_submit': 'bg-primary',
      'verification_review': 'bg-warning'
    };
    return classes[action] || 'bg-secondary';
  }
  
  formatAction(action: string): string {
    return action.replace(/_/g, ' ').toUpperCase();
  }
  
  getChangesPreview(changes: any): string {
    const changesStr = JSON.stringify(changes);
    return changesStr.length > 100 ? changesStr.substring(0, 100) + '...' : changesStr;
  }
}