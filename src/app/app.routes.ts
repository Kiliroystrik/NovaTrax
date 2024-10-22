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
import { TourListComponent } from './features/tour/components/tour-list/tour-list.component';
import { TourDetailComponent } from './features/tour/components/tour-detail/tour-detail.component';
// Importez les composants de livraison
import { DeliveryListComponent } from './features/delivery/components/delivery-list/delivery-list.component';
import { DeliveryDetailComponent } from './features/delivery/components/delivery-detail/delivery-detail.component';
// import { DeliveryCreateComponent } from './features/delivery/components/delivery-create/delivery-create.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent, // Layout public
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent, // Layout privé (utilisateurs connectés)
    canActivate: [authGuard], // Utilisation du guard
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/components/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },
      {
        path: 'commandes',
        loadComponent: () =>
          import(
            './features/orders/components/order-list/order-list.component'
          ).then((m) => m.OrderListComponent),
      },
      {
        path: 'commandes/:id',
        loadComponent: () =>
          import(
            './features/orders/components/order-detail/order-detail.component'
          ).then((m) => m.OrderDetailComponent),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import(
            './features/client/components/client-list/client-list.component'
          ).then((m) => m.ClientListComponent),
      },
      { path: 'clients/:id', component: ClientListComponent }, // Vérifiez si c'est bien le composant voulu
      {
        path: 'produits',
        loadComponent: () =>
          import(
            './features/product/components/product-list/product-list.component'
          ).then((m) => m.ProductListComponent),
      },
      {
        path: 'produits/:id',
        loadComponent: () =>
          import(
            './features/product/components/product-detail/product-detail.component'
          ).then((m) => m.ProductDetailComponent),
      },
      {
        path: 'conducteurs',
        loadComponent: () =>
          import(
            './features/driver/components/driver-list/driver-list.component'
          ).then((m) => m.DriverListComponent),
      },
      {
        path: 'conducteurs/:id',
        loadComponent: () =>
          import(
            './features/driver/components/driver-detail/driver-detail.component'
          ).then((m) => m.DriverDetailComponent),
      },
      {
        path: 'vehicules',
        loadComponent: () =>
          import(
            './features/vehicle/components/vehicle-list/vehicle-list.component'
          ).then((m) => m.VehicleListComponent),
      },
      {
        path: 'vehicules/:id',
        loadComponent: () =>
          import(
            './features/vehicle/components/vehicle-detail/vehicle-detail.component'
          ).then((m) => m.VehicleDetailComponent),
      },
      {
        path: 'tournees',
        loadComponent: () =>
          import(
            './features/tour/components/tour-list/tour-list.component'
          ).then((m) => m.TourListComponent),
      },
      {
        path: 'tournees/:id',
        loadComponent: () =>
          import(
            './features/tour/components/tour-detail/tour-detail.component'
          ).then((m) => m.TourDetailComponent),
      },
      // **Ajout des routes pour les livraisons**
      {
        path: 'planning',
        loadComponent: () =>
          import(
            './features/planner/components/planner/planner.component'
          ).then((m) => m.PlannerComponent),
      },
      // {
      //   path: 'livraisons/create',
      //   loadComponent: () =>
      //     import(
      //       './features/delivery/components/delivery-create/delivery-create.component'
      //     ).then((m) => m.DeliveryCreateComponent),
      // },
      {
        path: 'livraisons/:id',
        loadComponent: () =>
          import(
            './features/delivery/components/delivery-detail/delivery-detail.component'
          ).then((m) => m.DeliveryDetailComponent),
      },
      // {
      //   path: 'livraisons/:id/edit',
      //   loadComponent: () =>
      //     import(
      //       './features/delivery/components/delivery-edit/delivery-edit.component'
      //     ).then((m) => m.DeliveryEditComponent),
      // },
    ],
  },
  { path: '**', redirectTo: '/home' }, // Route par défaut si l'URL n'est pas trouvée
];
