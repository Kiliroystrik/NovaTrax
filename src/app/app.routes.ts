import { LoadingComponent } from './shared/components/loading/loading.component';
import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { HomeComponent } from './features/saas/components/home/home.component';
import { OrderListComponent } from './features/orders/components/order-list/order-list.component';
import { OrderDetailComponent } from './features/orders/components/order-detail/order-detail.component';
import { ClientListComponent } from './features/client/components/client-list/client-list.component';
import { ProductListComponent } from './features/product/components/product-list/product-list.component';
import { ProductDetailComponent } from './features/product/components/product-detail/product-detail.component';
import { DriverListComponent } from './features/driver/components/driver-list/driver-list.component';
import { DriverDetailComponent } from './features/driver/components/driver-detail/driver-detail.component';
import { VehicleListComponent } from './features/vehicle/components/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './features/vehicle/components/vehicle-detail/vehicle-detail.component';

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
            { path: 'dashboard', loadComponent: () => import('./features/dashboard/components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'commandes', loadComponent: () => import('./features/orders/components/order-list/order-list.component').then(m => m.OrderListComponent) },
            { path: 'commandes/:id', loadComponent: () => import('./features/orders/components/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
            { path: 'clients', loadComponent: () => import('./features/client/components/client-list/client-list.component').then(m => m.ClientListComponent) },
            { path: 'clients/:id', component: ClientListComponent },
            { path: 'produits', loadComponent: () => import('./features/product/components/product-list/product-list.component').then(m => m.ProductListComponent) },
            { path: 'produits/:id', loadComponent: () => import('./features/product/components/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
            { path: 'conducteurs', loadComponent: () => import('./features/driver/components/driver-list/driver-list.component').then(m => m.DriverListComponent) },
            { path: 'conducteurs/:id', loadComponent: () => import('./features/driver/components/driver-detail/driver-detail.component').then(m => m.DriverDetailComponent) },
            { path: 'vehicules', loadComponent: () => import('./features/vehicle/components/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent) },
            { path: 'vehicules/:id', loadComponent: () => import('./features/vehicle/components/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent) },
            // D'autres pages accessibles aux utilisateurs connectés
        ],
    },
    { path: '**', redirectTo: '/home' },  // Route par défaut si l'URL n'est pas trouvée

];
