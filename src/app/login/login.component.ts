import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule
  ]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient) {}

  onLogin() {
    this.http.post('https://your-api.com/login', {
      username: this.username,
      password: this.password
    }).subscribe(
      (response: any) => {
        // 存储 token
        localStorage.setItem('token', response.token);
        // 跳转到统计页面
      },
      error => {
        console.error('登录失败', error);
      }
    );
  }
} 