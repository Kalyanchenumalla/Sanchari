import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  username = signal('');
  firstName = signal('');
  lastName = signal('');
  confirmPassword = signal('');
  dobDay = signal('');
  dobMonth = signal('');
  dobYear = signal('');
  gender = signal('');
  mobile = signal('');

  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  currentYear = new Date().getFullYear();
  years = Array.from({ length: this.currentYear - 1899 }, (_, i) => this.currentYear - i);

  private nameRegex = /^[a-zA-Z]+$/;
  private userRegex = /^[a-z0-9_]{3,25}$/;
  private passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private phoneRegex = /^[0-9]{10,15}$/;

  isFirstNameInvalid = computed(() => {
    const val = this.firstName();
    return val.length > 0 && !this.nameRegex.test(val);
  });

  isLastNameInvalid = computed(() => {
    const val = this.lastName();
    return val.length > 0 && !this.nameRegex.test(val);
  });

  isUsernameInvalid = computed(() => {
    const val = this.username();
    return val.length > 0 && !this.userRegex.test(val);
  });

  isEmailInvalid = computed(() => {
    const val = this.email();
    return val.length > 0 && (!val.includes('@') || !val.includes('.'));
  });

  isPasswordInvalid = computed(() => {
    const val = this.password();
    return val.length > 0 &&  !this.passRegex.test(val);
  });
  
  isConfirmPasswordInvalid = computed(() => {
    const val = this.confirmPassword();
    return val.length > 0 && val !== this.password();
  });

  isMobileInvalid = computed(() => {
    const val = this.mobile();
    return val.length > 0 && !this.phoneRegex.test(val);
  });

  isDobInvalid = computed(() => {
    const d = parseInt(this.dobDay());
    const m = this.dobMonth();
    
    if (d === 31 && ['February', 'April', 'June', 'September', 'November'].includes(m)) return true;
    if (d > 29 && m === 'February') return true;
    
    return false;
  });

  isFormReady = computed(() => {
  // 1. Check if everything is filled
  const isFilled = {
    first: this.firstName().trim().length > 0,
    last: this.lastName().trim().length > 0,
    user: this.username().trim().length > 0,
    email: this.email().trim().length > 0,
    pass: this.password().length > 0,
    confirm: this.confirmPassword().length > 0,
    mobile: this.mobile().trim().length >= 10,
    day: String(this.dobDay()) !== '',
    month: String(this.dobMonth()) !== '',
    year: String(this.dobYear()) !== '',
    gender: this.gender() !== ''
  };

  const allFilled = Object.values(isFilled).every(val => val === true);

  // 2. Check if there are zero validation errors
  const isValid = {
    first: !this.isFirstNameInvalid(),
    last: !this.isLastNameInvalid(),
    user: !this.isUsernameInvalid(),
    email: !this.isEmailInvalid(),
    pass: !this.isPasswordInvalid(),
    mobile: !this.isMobileInvalid(),
    dob: !this.isDobInvalid(),
    passMatch: this.password() === this.confirmPassword()
  };

  const noErrors = Object.values(isValid).every(val => val === true);
  return allFilled && noErrors;
});

  async registerWanderer() {
    if(!this.isFormReady()) return;
    const authCredentials = {
      email: this.email(),
      password: this.password()
    };

    const newUser = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      username: this.username().toLowerCase(),
      mobile: this.mobile(),
      gender: this.gender(),
      dateOfBirth: `${this.dobYear()}-${this.dobMonth()}-${this.dobDay()}`
    };
    try {
      await this.authService.registerUser(authCredentials, newUser);
      console.log('profile created successfully')
    } catch (error: any) {
      alert(error.message);
    }
    console.log('valid', newUser);
  }

}
