import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { HomeComponent } from './features/saas/components/home/home.component';

export const routes: Routes = [

    // {
    //     path: 'login',
    //     loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
    // },

    // {
    //     path: 'register',
    //     loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
    // },
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./features/dashboard/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    // },
    // {
    //     path: '',
    //     loadComponent: () => import('./app.component').then(m => m.AppComponent)
    // }
    {
        path: '',
        component: PublicLayoutComponent,  // Layout public
        children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ],
    },
    {
        path: '',
        component: PrivateLayoutComponent,  // Layout privé (utilisateurs connectés)
        canActivate: [authGuard],  // Utilisation du guard
        children: [
            { path: 'dashboard', component: DashboardComponent },
            // D'autres pages accessibles aux utilisateurs connectés
        ],
    },
    { path: '**', redirectTo: '/home' },  // Route par défaut si l'URL n'est pas trouvée

];
