import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/users';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  showCreateModal = false;
  showEditModal = false;
  selectedUser: any = null;
  userForm: FormGroup;
  editForm: FormGroup;
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };
  filters = {
    search: '',
    role: '',
    isActive: ''
  };
  
  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
      phoneNumber: ['']
    });
    
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      isActive: [true],
      phoneNumber: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.isLoading = true;
    const params = {
      page: this.pagination.page,
      limit: this.pagination.limit,
      ...this.filters
    };
    
    this.userService.getUsers(params).subscribe({
      next: (response) => {
        this.users = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadUsers();
  }
  
  onSearch(): void {
    this.pagination.page = 1;
    this.loadUsers();
  }
  
  onFilterChange(): void {
    this.pagination.page = 1;
    this.loadUsers();
  }
  
  clearFilters(): void {
    this.filters = {
      search: '',
      role: '',
      isActive: ''
    };
    this.loadUsers();
  }
  
  openCreateModal(): void {
    this.userForm.reset({ role: 'user' });
    this.showCreateModal = true;
  }
  
  openEditModal(user: any): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phoneNumber: user.phoneNumber
    });
    this.showEditModal = true;
  }
  
  createUser(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.showCreateModal = false;
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }
  
  updateUser(): void {
    if (this.editForm.valid && this.selectedUser) {
      this.userService.updateUser(this.selectedUser._id, this.editForm.value).subscribe({
        next: () => {
          this.showEditModal = false;
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }
  
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
  
  toggleUserStatus(user: any): void {
    const newStatus = !user.isActive;
    this.userService.updateUser(user._id, { isActive: newStatus }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
      }
    });
  }
}