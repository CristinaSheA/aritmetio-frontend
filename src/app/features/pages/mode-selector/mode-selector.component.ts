import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { WebsocketsService } from '../../../core/services/websockets.service';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { StatsComponent } from '../../../shared/components/stats/stats';

@Component({
  selector: 'app-mode-selector',
  imports: [RouterLink, SettingsComponent, FormsModule, StatsComponent],
  templateUrl: './mode-selector.component.html',
  styleUrl: './mode-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectorComponent { 
  private readonly wsService = inject(WebsocketsService);
  private readonly authService = inject(AuthService);
  private readonly settingsService = inject(SettingsService);
  public showStats: boolean = false;

  public logOut() {
    this.authService.logOut();
    this.wsService.disconnect();
  }
  public toggleSettings() {
    this.settingsService.toggleSettings();
  }
  public get showSettings() {
    return this.settingsService.showSettings;
  }
  public toggleStats(stats: boolean) {
    return this.showStats = stats;
  }
}
