import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FormGroup } from '@angular/forms';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly authService = inject(AuthService);
  public showSettings: boolean = false;
  public toggleSettings() {
    this.showSettings = !this.showSettings;
  }
  public async changePassword(form: FormGroup) {
    const currentPassword = form.get('currentPassword')!.value;
    const newPassword = form.get('newPassword')!.value;
    const newPasswordCheck = form.get('newPasswordCheck')!.value;
    const user = this.authService.users.find(
      (u) => u.id === localStorage.getItem('userId')
    );
    if (!user) return;
    if (
      !this.validatePasswordChange(
        currentPassword,
        newPassword,
        newPasswordCheck,
        user
      )
    ) {
      return;
    }

    user.password = newPassword;
    this.authService.updateUser(user).catch((error) => {
      console.error('Failed to update user password', error);
    });
  }
  private validatePasswordChange(
    current: string,
    next: string,
    confirm: string,
    user: User
  ): boolean {
    if (user.password !== current) {
      console.error('La contraseña actual es incorrecta');
      return false;
    }
    if (!current || !next || !confirm) {
      console.error('Todos los campos son obligatorios');
      return false;
    }
    if (next.length < 8 || next.length > 20) {
      console.error('La contraseña debe tener entre 8 y 20 caracteres');
      return false;
    }
    if (next !== confirm) {
      console.error('La nueva contraseña y la confirmación no coinciden');
      return false;
    }
    return true;
  }
}
