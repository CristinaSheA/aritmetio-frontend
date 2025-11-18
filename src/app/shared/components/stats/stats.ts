import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-stats',
  imports: [ChartModule, TagModule, CardModule, ProgressBarModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class StatsComponent {
  public readonly statsService = inject(StatsService);

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.statsService.getTotalOperations(userId);
    this.statsService.getWeeklyOperations(userId);
    this.statsService.getGlobalPrecision(userId);
    this.statsService.getWeeklyPrecision(userId);

    this.data = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ejercicios hechos',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: '#42A5F5'
      }
    ]
  };

  this.options = {
    responsive: true,
    maintainAspectRatio: false
  };
  }

  public get totalOperations() {
    return this.statsService.settings.totalOperations;
  }
  public get weeklyOperations() {
    return this.statsService.settings.weeklyOperations;
  }

  public get globalPrecision(): number {
    return this.statsService.settings.globalPrecision;
  }
  public get weeklyPrecision(): number {
    return this.statsService.settings.weeklyPrecision;
  }

  data: any;
options: any;


}
