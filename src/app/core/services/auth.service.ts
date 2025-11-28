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
  scope: 'openid profile email',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly wsService = inject(WebsocketsService);
  private readonly oauthService = inject(OAuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  public users: User[] = [];

  constructor() {
    this.fetchUsers;
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
  public fetchUsers(): any {
    return this.http.get<any[]>(`${environment.authURL}`).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.error('Error al recibir los usuarios', error);
      },
    });
  }
  public get isLoggedIn(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true';
  }
  public createUser(form: FormGroup, authState: string) {
    const username = form.get('username')!.value;
    const password = form.get('password')!.value;
    const passwordCheck = form.get('passwordCheck')!.value;
    console.log('here');
    if (!this.checkErrors(username, password, passwordCheck, form, authState))
      return;
    console.log('here');

    this.createQuery(username, password, undefined).subscribe({
      next: (response) => {
        let userId = response.user?.id || response.id;
        if (!userId || userId === 'undefined') return;
        this.persistSessionAndRedirect(response);
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        this.router.navigate(['/mode-selector']);
        return;
      },
    });
  }
  public loginUser(form: FormGroup, authState: string): void {
    const username = form.get('username')!.value;
    const password = form.get('password')!.value;
    if (!this.checkErrors(username, password, null, form, authState)) return;

    this.loginQuery(username, password).subscribe({
      next: (response) => {
        this.persistSessionAndRedirect(response);
      },
      error: (error) => {
        console.error('Error logging in', error);
      },
    });
  }
  public loginOrRegisterGoogle(username: string, email: string): void {
    this.createQuery(username, undefined, email).subscribe({
      next: (response) => {
        this.persistSessionAndRedirect(response);
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
  public logOut(): void {
    localStorage.removeItem('userId');
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('userToken');
    this.router.navigate(['/auth']);
  }
  public async updateUser(user: User): Promise<void> {
    if (!user?.id) {
      throw new Error('Invalid user data');
    }
    try {
      const response = await this.http
        .patch(`${environment.authURL}/${user.id}`, user)
        .toPromise();
      console.log('User stats updated:', response);
      this.fetchUsers();
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

    this.http.delete(`${environment.authURL}/${userId}`);
    localStorage.removeItem('userId');
    localStorage.setItem('isAuthenticated', 'false');
    this.router.navigate(['/auth']);
  }
  private createQuery(
    username: string,
    password?: string,
    email?: string
  ): Observable<any> {
    return this.http.post(`${environment.authURL}`, {
      username,
      email,
      password,
    });
  }
  private loginQuery(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.authURL}/login`, {
      username,
      password,
    });
  }
  private checkErrors(
    username: string,
    password: string,
    passwordCheck: string | null,
    form: FormGroup,
    authState: string
  ): boolean {
    const result = this.users.find((user) => user.username === username);

    if (form.invalid) {
      console.error('Invalid form');
      return false;
    }
    if (passwordCheck) {
      if (password !== passwordCheck) {
        console.error('The password and password verification do not match.');
        return false;
      }
    }
    if (authState === 'sign-up') {
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
  private persistSessionAndRedirect(response: any): void {
    localStorage.setItem('userId', response.user.id);
    localStorage.setItem('userToken', response.token);
    localStorage.setItem('isAuthenticated', 'true');
    this.wsService.connect(response.user.id, response.token);
    this.router.navigate(['/mode-selector']);
  }
  public loginOAuth(): void {
    this.oauthService.initLoginFlow(undefined, { prompt: 'select_account' });
  }
  public handleGoogleLogin(form: FormGroup) {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (
        this.oauthService.hasValidIdToken() &&
        this.oauthService.hasValidAccessToken()
      ) {
        const claims: any = this.oauthService.getIdentityClaims();
        console.log('Usuario autenticado:', claims);
        console.log(claims.name);
        let randomNum = Math.floor(Math.random() * 10000);
        let username =
          claims.name.toLowerCase().split(' ').join('') + randomNum;
        form.get('username')?.setValue(username);
        console.log(claims.name.toLowerCase().split(' ').join(''));
        this.loginOrRegisterGoogle(username, claims.email);
        console.log();
      }
    });
  }
}
