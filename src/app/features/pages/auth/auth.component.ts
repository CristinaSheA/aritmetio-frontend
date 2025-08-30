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
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    passwordCheck: [''],
  });
  public authMode = 'sign-up';

  public changeAuthMode(mode: string) {
    switch (mode) {
      case 'log-in':
        this.authMode = 'log-in';
        break;
      case 'sign-up':
        this.authMode = 'sign-up';
        break;
    }
  }
  public createUser() {
    this.authService!.createUser(this.form);
  }
  public loginUser() {
    this.authService!.loginUser(this.form);
  }
}
