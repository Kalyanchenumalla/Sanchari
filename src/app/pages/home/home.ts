import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = signal([
    { icon: '⚡', title: 'Instant Messaging', description: 'Real-time sync.' },
    { icon: '🔍', title: 'Find Travelers', description: 'Search by handle.' },
    { icon: '🛡️', title: 'Secure', description: 'Auth protected.' }
  ]);
}
