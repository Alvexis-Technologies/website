import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

// Define interface for menu items with optional badge
interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles: string[];
  badge?: number | string;  // Optional badge property
}

interface MenuGroup {
  title: string;
  icon: string;
  roles?: string[];
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  
  // Grouped menu structure with badge support
  menuGroups: MenuGroup[] = [
    {
      title: 'Home',
      icon: 'bi-grid',
      items: [
        { path: '/app/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', roles: ['admin', 'user'] }
      ]
    },
    {
      title: 'MARKETPLACE',
      icon: 'bi-shop',
      items: [
        { path: '/app/marketplace', icon: 'bi-grid', label: 'Browse Land', roles: ['admin', 'user'] },
        { path: '/app/marketplace-map', icon: 'bi-map', label: 'Map View', roles: ['admin', 'user'] },
        { path: '/app/create-listing', icon: 'bi-plus-circle', label: 'Sell Land', roles: ['admin', 'user'] },
        { path: '/app/listings', icon: 'bi-list-ul', label: 'My Listings', roles: ['admin', 'user'] },
        { path: '/app/transactions', icon: 'bi-receipt', label: 'Transactions', roles: ['admin', 'user'] }
      ]
    },
    {
      title: 'LAND MANAGEMENT',
      icon: 'bi-building',
      items: [
        { path: '/app/cadastral-map', icon: 'bi-map', label: 'Cadastral Map', roles: ['admin', 'user'] },
        { path: '/app/properties', icon: 'bi-files', label: 'Properties', roles: ['admin', 'user'] },
        { path: '/app/verifications', icon: 'bi-check-circle', label: 'Verifications', roles: ['admin', 'user'] }
      ]
    },
    {
      title: 'ADMINISTRATION',
      icon: 'bi-gear',
      roles: ['admin'],
      items: [
        { path: '/app/users', icon: 'bi-people', label: 'User Management', roles: ['admin'] },
        { path: '/app/audit-logs', icon: 'bi-journal-text', label: 'Audit Logs', roles: ['admin'] },
        { path: '/app/logs', icon: 'bi-activity', label: 'System Logs', roles: ['admin'] },
        { 
          path: '/app/admin-marketplace', 
          icon: 'bi-graph-up', 
          label: 'Marketplace Stats', 
          roles: ['admin'],
          badge: 3  // Example badge - shows pending approvals count
        }
      ]
    }
  ];

  // Expanded sections state
  expandedSections: { [key: string]: boolean } = {};

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize all sections as expanded by default
    this.menuGroups.forEach(group => {
      this.expandedSections[group.title] = true;
    });
  }

  hasPermission(roles: string[] | any): boolean {
    const userRole = this.authService.getCurrentUser()?.role;
    return roles.includes(userRole);
  }

  hasAnyVisibleItem(group: MenuGroup): boolean {
    // Check group-level role first
    if (group.roles && !this.hasPermission(group.roles)) {
      return false;
    }
    return group.items.some((item: MenuItem) => this.hasPermission(item.roles));
  }

  toggleSection(sectionTitle: string): void {
    this.expandedSections[sectionTitle] = !this.expandedSections[sectionTitle];
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // logout(): void {
  //   this.authService.logout().subscribe({
  //     next: () => {
  //       this.router.navigate(['/login']);
  //     },
  //     error: () => {
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }
  logout(): void {
   this.authService.logout();
   }


  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }
}

// import { Component, Input, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-sidebar',
//   standalone:false,
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent implements OnInit {
//   @Input() isCollapsed = false;
  
//   // Grouped menu structure for better organization
//   menuGroups = [
//     {
//       title: 'MAIN',
//       icon: 'bi-grid',
//       items: [
//         { path: '/app/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', roles: ['admin', 'user'] }
//       ]
//     },
//     {
//       title: 'MARKETPLACE',
//       icon: 'bi-shop',
//       items: [
//         { path: '/app/marketplace', icon: 'bi-store', label: 'Browse Land', roles: ['admin', 'user'] },
//         { path: '/app/marketplace-map', icon: 'bi-map', label: 'Map View', roles: ['admin', 'user'] },
//         { path: '/app/create-listing', icon: 'bi-plus-circle', label: 'Sell Land', roles: ['admin', 'user'] },
//         { path: '/app/my-listings', icon: 'bi-list-ul', label: 'My Listings', roles: ['admin', 'user'] },
//         { path: '/app/my-transactions', icon: 'bi-receipt', label: 'Transactions', roles: ['admin', 'user'] }
//       ]
//     },
//     {
//       title: 'LAND MANAGEMENT',
//       icon: 'bi-building',
//       items: [
//         { path: '/app/cadastral-map', icon: 'bi-map', label: 'Cadastral Map', roles: ['admin', 'user'] },
//         { path: '/app/properties', icon: 'bi-files', label: 'Properties', roles: ['admin', 'user'] },
//         { path: '/app/verifications', icon: 'bi-check-circle', label: 'Verifications', roles: ['admin', 'user'] }
//       ]
//     },
//     {
//       title: 'ADMINISTRATION',
//       icon: 'bi-gear',
//       roles: ['admin'],
//       items: [
//         { path: '/app/users', icon: 'bi-people', label: 'User Management', roles: ['admin'] },
//         { path: '/app/audit-logs', icon: 'bi-journal-text', label: 'Audit Logs', roles: ['admin'] },
//         { path: '/app/logs', icon: 'bi-activity', label: 'System Logs', roles: ['admin'] },
//         { path: '/app/admin-marketplace', icon: 'bi-graph-up', label: 'Marketplace Stats', roles: ['admin'] }
//       ]
//     }
//   ];

//   // Expanded sections state
//   expandedSections: { [key: string]: boolean } = {};

//   constructor(
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     // Initialize all sections as expanded by default
//     this.menuGroups.forEach(group => {
//       this.expandedSections[group.title] = true;
//     });
//   }

//   hasPermission(roles: string[]): boolean {
//     const userRole = this.authService.getCurrentUser()?.role;
//     return roles.includes(userRole);
//   }

//   hasAnyVisibleItem(group: any): boolean {
//     return group.items.some((item: any) => this.hasPermission(item.roles));
//   }

//   toggleSection(sectionTitle: string): void {
//     this.expandedSections[sectionTitle] = !this.expandedSections[sectionTitle];
//   }

//   isActive(path: string): boolean {
//     return this.router.url === path;
//   }

//   logout(): void {
//     this.authService.logout().subscribe({
//       next: () => {
//         this.router.navigate(['/login']);
//       },
//       error: () => {
//         this.router.navigate(['/login']);
//       }
//     });
//   }

//   getCurrentUser(): any {
//     return this.authService.getCurrentUser();
//   }
// }
// import { Component, Input } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-sidebar',
//   standalone:false,
//   // imports: [CommonModule,RouterModule],
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent {
//   @Input() isCollapsed = false;
  
// //   menuItems = [
// //     { path: '/app/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', roles: ['admin', 'user'] },
// //     { path: '/app/users', icon: 'bi-people', label: 'Users', roles: ['admin'] },
// //     { path: '/app/logs', icon: 'bi-journal-text', label: 'Activity Logs', roles: ['admin'] }
// //   ];


// menuItems = [
//   { path: '/app/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', roles: ['admin', 'user'] },
//   { path: '/app/marketplace', icon: 'bi-shop', label: 'Marketplace', roles: ['admin', 'user'] },
//   { path: '/app/marketplace-map', icon: 'bi-map', label: 'Marketplace Map', roles: ['admin', 'user'] },
//   { path: '/app/create-listing', icon: 'bi-plus-circle', label: 'Sell Land', roles: ['admin', 'user'] },
//   { path: '/app/my-listings', icon: 'bi-list-ul', label: 'My Listings', roles: ['admin', 'user'] },
//   { path: '/app/my-transactions', icon: 'bi-receipt', label: 'My Transactions', roles: ['admin', 'user'] },
//   { path: '/app/cadastral-map', icon: 'bi-map', label: 'Cadastral Map', roles: ['admin', 'user'] },
//   { path: '/app/properties', icon: 'bi-building', label: 'Properties', roles: ['admin', 'user'] },
//   { path: '/app/verifications', icon: 'bi-check-circle', label: 'Verifications', roles: ['admin', 'user'] },
//   { path: '/app/users', icon: 'bi-people', label: 'Users', roles: ['admin'] },
//   { path: '/app/audit-logs', icon: 'bi-journal-text', label: 'Audit Logs', roles: ['admin'] },
//   { path: '/app/logs', icon: 'bi-activity', label: 'Activity Logs', roles: ['admin'] },
//   { path: '/app/admin-marketplace', icon: 'bi-graph-up', label: 'Marketplace Stats', roles: ['admin'] }
  
// ];
//   constructor(
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   hasPermission(roles: string[]): boolean {
//     const userRole = this.authService.getCurrentUser()?.role;
//     return roles.includes(userRole);
//   }

//   isActive(path: string): boolean {
//     return this.router.url === path;
//   }
// }