import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [NgbCollapseModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public authService = inject(AuthService);
  private router = inject(Router);
  isMenuCollapsed = signal(true);

  toggleMenu() {
    this.isMenuCollapsed.update(val => !val);
  }

  async handleLogout() {
    await this.authService.logoutUser();
    this.isMenuCollapsed.set(true);
    this.router.navigate(['/login']);
  }

}
