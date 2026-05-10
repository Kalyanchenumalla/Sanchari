import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-chats',
  imports: [FormsModule, NgClass, DatePipe],
  templateUrl: './chats.html',
  styleUrl: './chats.scss',
})
export class Chats {
  private authService = inject(AuthService);
  private router = inject(Router);

  activeChat = signal<any>(null);
  messageText = signal('');

  chatList = signal([
    { id: '1', name: 'Rahul(Goa Trip)', lastMessage: 'Are we booking?', time: new Date(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', unread: 2},
    { id: '2', name: 'Priyanka', lastMessage: 'Are we booking for RRR?', time: new Date(Date.now()-8640000), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', unread: 0},
    { id: '3', name: 'Hampi Explorers', lastMessage: 'Are we booking as per map?', time: new Date(Date.now()-172800000), avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HE', unread: 0},
  ]);

  messages = signal([
    { senderId: '1', text: 'Hey! Ready for the trip?', time: new Date(Date.now()-3600000), isMe: false },
    { senderId: 'me', text: 'Hey! Ready for the trip take camera?', time: new Date(Date.now()-3500000), isMe: true },
    { senderId: '1', text: 'Hey! Ready for the trip book train?', time: new Date(), isMe: false },
  ]);

  selectChat(chat: any) { 
    this.messageText.set(chat);
  }

  sendMessage() {
    if(!this.messageText().trim()) return;
    
    this.messages.update(msgs => [
      ...msgs,
      { senderId: 'me', text: this.messageText(), time: new Date(), isMe: true }
    ]);
    this.messageText.set('');
  }

  async logout() {
    await this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}
