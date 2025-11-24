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

  public opDistributionData: any = {
    labels: ['Sumas', 'Restas', 'Multiplicaciones', 'Divisiones'],
    datasets: [
      {
        data: [
          this.getOpsPercent('addition'),
          this.getOpsPercent('subtraction'),
          this.getOpsPercent('multiplication'),
          this.getOpsPercent('division'),
        ],
        backgroundColor: ['#EA6D63', '#2481F1', '#FEB652', '#96E4AB'],
      },
    ],
  };
  public opDistributionOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public dailyPerformanceData = {
    labels: [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ],
    datasets: [
      {
        label: 'Operaciones correctas',
        backgroundColor: '#4f46e5',
        data: [15, 22, 18, 27, 32, 25, 20],
      },
      {
        label: 'Operaciones incorrectas',
        backgroundColor: '#ef4444',
        data: [5, 3, 7, 4, 2, 5, 3],
      },
    ],
  };
  public dailyPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false
  }
  
  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.statsService.getTotalOperations(userId);
    this.statsService.getWeeklyOperations(userId);
    this.statsService.getGlobalPrecision(userId);
    this.statsService.getWeeklyPrecision(userId);
  }

  public get totalOperations() {
    return this.statsService.stats.totalOperations.length;
  }
  public get weeklyOperations() {
    return this.statsService.stats.weeklyOperations;
  }
  public get globalPrecision(): number {
    return this.statsService.stats.globalPrecision;
  }
  public get weeklyPrecision(): number {
    return this.statsService.stats.weeklyPrecision;
  }
  private getOpsPercent(type: string): number {
    let totalOps = this.statsService.stats.totalOperations;
    let addition = totalOps.filter(
      (op: any) => op.operationType === 'ADD'
    );
    let subtraction = totalOps.filter(
      (op: any) => op.operationType === 'SUB'
    );
    let multiplication = totalOps.filter(
      (op: any) => op.operationType === 'MUL'
    );
    let division = totalOps.filter(
      (op: any) => op.operationType === 'DIV'
    );
    switch (type) {
      case 'addition':
        return Math.round((addition.length / totalOps.length) * 100);
      case 'subtraction':
        return Math.round((subtraction.length / totalOps.length) * 100);
      case 'multiplication':
        return Math.round((multiplication.length / totalOps.length) * 100);
      case 'division':
        return Math.round((division.length / totalOps.length) * 100);
      default:
        return Math.round((addition.length / totalOps.length) * 100);
    }
  }
}
