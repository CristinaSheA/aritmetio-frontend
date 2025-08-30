import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { WebsocketsService } from './websockets.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly wsService = inject(WebsocketsService);
  private readonly http = inject(HttpClient);
  public apiUrl = 'http://localhost:3000/user';
  private readonly router = inject(Router);
  public users: User[] = [];

  constructor() {
    this.getUsers();
  }
  public getUsers(): any {
    return this.http.get<any[]>(`${this.apiUrl}`).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.error('Error al recibir los usuarios', error);
      },
    });
  }
  public getCurrentUser(): any {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.apiUrl}/${userId}`).subscribe({
      next: (response) => {
        return response;
      },
      error: (error) => {
        console.error('Error al recibir el usuario', error);
        return;
      },
    });
  }
  public get isLoggedIn(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    return isAuthenticated === 'true';
  }
  public logOut(): void {
    localStorage.removeItem('userId');
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
  public createUser(form: FormGroup) {
    const username = form.get('username')!.value;
    const password = form.get('password')!.value;
    const passwordCheck = form.get('passwordCheck')!.value;

    if (!this.checkErrors(username, password, passwordCheck, form)) return
    this.createQuery(username, password).subscribe({
      next: (response) => {
        this.setLocalStorage(response.user.id, response.token);
        console.log('Usuario creado exitosamente', response);
        this.wsService.connect();
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        return;
      },
    });
    this.router.navigate(['/mode-selector']);
  }
  public loginUser(form: FormGroup): void {
    const username = form.get('username')!.value;
    const password = form.get('password')!.value;
    if (!this.checkErrors(username, password, null, form)) return

    this.loginQuery(username, password).subscribe({
      next: (response) => {
        console.log('Session successfully started', response);
        this.setLocalStorage(response.user.id, response.token);
        this.router.navigate(['/mode-selector']);
        this.wsService.connect();
      },
      error: (error) => {
        console.error('Error logging in', error);
      },
    });
  }
  public async updateUser(user: User): Promise<void> {
    if (!user?.id) {
      throw new Error('Invalid user data');
    }
    try {
      const response = await this.http
        .patch(`${this.apiUrl}/${user.id}`, user)
      console.log('User stats updated:', response);
      this.getUsers();
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
  public deleteUser() {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'undefined') {
      console.error('Error', 'User ID not found', 'error');
      return;
    }

    this.http.delete(`${this.apiUrl}/${userId}`)
    localStorage.removeItem('userId');
    localStorage.setItem('isAuthenticated', 'false');
    this.router.navigate(['/auth']);
  }

  private setLocalStorage(userId: string, token: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', token);
  }
  private createQuery(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      username,
      password,
    });
  }
  private loginQuery(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      username,
      password,
    });
  }
  private checkErrors(
    username: string,
    password: string,
    passwordCheck: string | null,
    form: FormGroup
  ): boolean {
    const result = this.users.find((user) => user.username === username);

    if (form.invalid) {
      console.error('Invalid form');
      return false;
    }
    if (passwordCheck) {
       if (password !== passwordCheck) {
        console.error(
          'The password and password verification do not match.'
        );
        return false;
      }
    }
    if (result) {
      console.error('This user already exists.');
      return false;
    }
    if (username.length < 3) {
      console.error('The username must be at least 3 characters long.');
      return false;
    }
    if (password.length < 8 || password.length > 20) {
      console.error('The password must be between 8 and 20 characters long.');
      return false;
    }
    return true;
  }
}
