import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { TestComponent } from './test/test.component';
import { Statistics1Component } from './statistics-1/statistics.component';
import { Statistics2Component } from './statistics-2/statistics-2.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'statistics-1', component: Statistics1Component},
  { path: 'statistics-2', component: Statistics2Component},
  { path: '', redirectTo: '/statistics', pathMatch: 'full' },
  { path: 'test', component: TestComponent},

  {
    path: 'main',
    component: MainComponent,
    children: [
      
    ]
  }
];
