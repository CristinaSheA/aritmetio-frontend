import { ChangeDetectionStrategy, Component, inject, NgModule } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AuthComponent { 
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly oauthService = inject(OAuthService);

  public form: FormGroup = this.fb!.group({
    username: ['', [Validators.minLength(3), Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    passwordCheck: [''],
  });
  public authMode = 'sign-up';

  ngOnInit() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()) {
        const claims: any = this.oauthService.getIdentityClaims();
        console.log("Usuario autenticado:", claims);
        console.log(claims.name);
        let randomNum = Math.floor(Math.random() * 10000);
        let username = claims.name.toLowerCase().split(" ").join("") + randomNum;
        this.form.get('username')?.setValue(username);
        console.log(claims.name.toLowerCase().split(" ").join(""));
        this.authService.createUserGoogle(username, claims.email);
        console.log();
      }
    });
  }

  public changeAuthMode(mode: string) {
    if (mode === 'log-in') this.authMode = 'log-in'; 
    else this.authMode = 'sign-up';
  }
  public createUser() {
    this.authService!.createUser(this.form);
  }
  public loginUser() {
    this.authService!.loginUser(this.form);
  }
  public loginOAuth() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
 