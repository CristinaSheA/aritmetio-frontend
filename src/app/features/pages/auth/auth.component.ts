import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../core/environments/environment';

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

  public form: FormGroup = this.fb!.group({
    username: ['', [Validators.minLength(3), Validators.required]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    passwordCheck: [''],
  });
  public authState = 'sign-up';

  ngOnInit() {
    this.authService.handleGoogleLogin(this.form);
  }

  public setAuthState(state: string) {
    if (state === 'log-in') this.authState = 'log-in';
    else this.authState = 'sign-up';
  }
  public createUser() {
    this.authService!.createUser(this.form, this.authState);
  }
  public loginUser() {
    this.authService!.loginUser(this.form, this.authState);
  }
  public loginWithGoogle() {
    window.location.href = `${environment.authURL}/google`;
  }
}
