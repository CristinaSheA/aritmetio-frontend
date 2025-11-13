import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { WebsocketsService } from './websockets.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/auth',
  clientId: environment.googleClientId,
  scope: 'openid profile email'
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly wsService = inject(WebsocketsService);
  private readonly oauthService = inject(OAuthService);
  private readonly http = inject(HttpClient);
  public apiUrl = 'http://localhost:3000/auth';

  private readonly router = inject(Router);
  public users: User[] = [];

  constructor() {
    this.getUsers();
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
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
    localStorage.removeItem('userToken');
    this.router.navigate(['/auth']);
  }
  public createUser(form: FormGroup, authMode: string) {
    const username = form.get('username')!.value;
    const password = form.get('password')!.value;
    const passwordCheck = form.get('passwordCheck')!.value;
    console.log('here');
    if (!this.checkErrors(username, password, passwordCheck, form, authMode)) return
    console.log('here');
    
    this.createQuery(username, password, undefined).subscribe({
      next: (response) => {
        let userId = response.user?.id || response.id;
        if (!userId || userId === 'undefined') {
          console.error('ID de usuario inválido:', userId);
          return;
        }
        this.saveAndRedirect(response.user.id, response.token);
        this.wsService.connect(userId, response.token);
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        this.router.navigate(['/mode-selector']);
        return;
      },
    });
  }
  public createUserGoogle(username: string, email: string): void {
    this.createQuery(username, undefined, email).subscribe({
      next: (response) => {
        console.log('Usuario OAuth creado', response);  
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userToken', response.token);
        this.router.navigate(['/mode-selector']);
        this.wsService.connect(response.user.id, response.token);
      },
      error: (error) => {
        if (error.status === 409) {
          console.warn('Usuario ya existe, iniciando sesión...');
        } else {
          console.error('Error OAuth', error);
        }
      },
    });
  }
  public loginUser(form: FormGroup, authMode: string): void {
    const username = form.get('username')!.value;
    const password = form.get('password')!.value;
    if (!this.checkErrors(username, password, null, form, authMode)) return

    this.loginQuery(username, password).subscribe({
      next: (response) => {
        this.saveAndRedirect(response.user.id, response.token);
        this.wsService.connect(response.user.id, response.token);
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
  private createQuery(username: string, password?: string, email?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      username,
      email,
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
    form: FormGroup, 
    authMode: string
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
    if (authMode === 'sign-up') { 
      if (result) {
        console.error('This user already exists.');
        return false;
      }
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
  private saveAndRedirect(id: string, token: string): void {
    localStorage.setItem('userId', id);
    localStorage.setItem('userToken', token);
    localStorage.setItem('isAuthenticated', 'true');
    this.router.navigate(['/mode-selector']);
  }
  public loginOAuth() {
    this.oauthService.initLoginFlow(undefined, { prompt: 'select_account' });
  }


  get profile() {
    return this.oauthService.getIdentityClaims();
  }

  get isLoggedInG() {
    return !!this.oauthService.getAccessToken();
  }
}
