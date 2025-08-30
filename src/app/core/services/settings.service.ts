import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FormGroup } from '@angular/forms';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
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
    const currentUserId = localStorage.getItem('userId');
    const user = this.authService.users.find((u) => u.id === currentUserId);
    if (!user) return;
    if (!this.validatePasswordChange(currentPassword, newPassword, newPasswordCheck, user)) {
      return;
    }

    user.password = newPassword;
    this.authService.updateUser(user).catch((error) => {
      console.error('Failed to update user password', error);
    });
  }
  private validatePasswordChange(currentPassword: string, newPassword: string, confirmPassword: string, user: User): boolean {
    if (user.password !== currentPassword) {
      console.error('La contraseña actual es incorrecta');
      return false;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.error('Todos los campos son obligatorios');
      return false;
    }
    if (newPassword.length < 8 || newPassword.length > 20) {
      console.error('La contraseña debe tener entre 8 y 20 caracteres');
      return false;
    }
    if (newPassword !== confirmPassword) {
      console.error('La nueva contraseña y la confirmación no coinciden');
      return false;
    }
    return true;
  }
}
