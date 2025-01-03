import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { TestComponent } from './test/test.component';
import { StatisticsRealComponent } from './statistics-real/statistics-real.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'statistics-real', component: StatisticsRealComponent},
  { path: '', redirectTo: '/statistics', pathMatch: 'full' },
  { path: 'test', component: TestComponent},

  {
    path: 'main',
    component: MainComponent,
    children: [
      
    ]
  }
];
