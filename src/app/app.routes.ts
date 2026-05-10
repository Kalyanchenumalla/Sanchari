import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Chats } from './pages/chats/chats';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'chats', component: Chats, canActivate: [authGuard] },
    { path: '**', redirectTo: ''}
];
