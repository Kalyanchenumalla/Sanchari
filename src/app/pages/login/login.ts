import { Component, computed, inject, NgZone, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  email = signal('');
  password = signal('');
  
  activeField = signal<'none' | 'email' | 'password'>('none');
  showPassword = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  eyeTranslateX = computed(() => {
    if (this.activeField() !== 'email') return 0;
    const len = this.email().length;
    return Math.min(Math.max(len * 0.8 - 12, -12), 12);
  });

  eyeTranslateY = computed(() => {
    return this.activeField() === 'email' ? 10 : 0;
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async handleLogin() {
    if(!this.email().includes('@')) {
      this.showPandaMessage('Enter correct credentials, Mr. Sanchari!');
      return;
    }

    if(this.password().length < 6) {
      this.showPandaMessage('Remember that your password is atleast 8 characters.');
      return;
    }
    this.isLoading.set(true);
    this.activeField.set('none');

    try {
      await this.authService.loginUser(this.email(), this.password());
      console.log('login successful');
      await this.router.navigate(['/chats']);
    } catch(error: any) {
      this.handleFirebaseError(error.code);
    } finally {
      this.isLoading.set(false);
    }
  }

  async triggerForgotPassword() {
    if(!this.email().includes('@')) {
      this.showPandaMessage("Type your email first so I know where to send it!");
      return;
    }
    this.isLoading.set(true);
    try {
      await this.authService.resetPassword(this.email());
      this.showPandaMessage('A magic reset link is sent to your inbox! Check spam folder too', 5000);
    } catch (error: any) {
      this.showPandaMessage("Couldn't send the email. Are you registered?");
    } finally {
      this.isLoading.set(false);
    }
  }

  private showPandaMessage(msg: string, duration = 10000) {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(''), duration);
  }

  private handleFirebaseError(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        this.showPandaMessage("Uh oh! Wrong email or password! Try again.");
        break;
      case 'auth/too-many-requests':
        this.showPandaMessage("Whoa, too many tries! Let me rest for a minute.");
        break;
      default:
        this.showPandaMessage("Something went wrong on the trail. Try again!");
        break;
    }
  }

}
