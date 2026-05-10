import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  imports: [NgbCollapseModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuCollapsed = signal(true);

  toggleMenu() {
    this.isMenuCollapsed.update(val => !val);
  }

}
