import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  @Input() showSettings!: boolean;
  public showChangePassword = false;
  public showConfirmDelete = false;

  public exerciseCount!: string;
  public prevExerciseCount!: string;

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.authService.users.filter(user => {
      if (user.id === userId) {
        this.exerciseCount = String(user.exercisesPerGame);
      } 
    });
    this.prevExerciseCount = this.exerciseCount;
  }
  public passwordForm: FormGroup = this.fb!.group({
    currentPassword: [
      '',
      [Validators.required, Validators.minLength(3), Validators.required],
    ],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    newPasswordCheck: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });
  public toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
  }
  public toggleConfirmDeletePopup() {
    this.showConfirmDelete = !this.showConfirmDelete;
  }
  public hideAllPopUps() {
    this.showConfirmDelete = false;
    this.showChangePassword = false;
    this.showSettings = true;
  }
  public deleteUser() {
    this.authService.deleteUser();
  }
  public hideSettings() {
    this.settingsService.toggleSettings();
  }
  public async changePassword() {
    this.settingsService.changePassword(this.passwordForm);
  }
  public confirmChanges() {
    const userId = localStorage.getItem('userId');
    const user = this.authService.users.filter(user => user.id === userId)[0];
    if (this.exerciseCount !== this.prevExerciseCount) {
      console.log(user);
      user.exercisesPerGame = Number(this.exerciseCount);
      this.authService.updateUser(user)
      console.log(user);
    }
    if (this.passwordForm.touched && this.passwordForm.valid) {
      if (!this.passwordForm.get('currentPassword')) return
      if (this.passwordForm.get('newPassword') !== this.passwordForm.get('newPasswordCheck')) return
      user.password = this.passwordForm.get('newPassword')?.value;
      this.authService.updateUser(user)
    }
  }
}
