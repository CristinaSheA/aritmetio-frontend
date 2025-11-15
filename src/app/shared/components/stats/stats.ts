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
  styleUrl: './stats.css'
})
export class StatsComponent {

  
  // data: any;
  // options: any;
  // public readonly statsService = inject(StatsService);

  // ngOnInit() {
  //   this.statsService.initializeCharts();
  //   this.statsService.loadPerformanceData();
  //   this.statsService.loadDifficultProblems();
  //   this.statsService.loadUserRanking();
  //   this.statsService.loadSessionHistory();
  //   this.statsService.loadAchievements();
  //   this.statsService.loadDifficultyStats();
  // }

  // public getInfo(info: string) {
  //   switch (info) {
  //     case 'progressData': return this.statsService.progressData
  //     case 'progressOptions': return this.statsService.progressOptions
  //     case 'distributionData': return this.statsService.distributionData
  //     case 'distributionOptions': return this.statsService.distributionOptions
  //     case 'dailyPerformanceData': return this.statsService.dailyPerformanceData
  //     case 'dailyPerformanceOptions': return this.statsService.dailyPerformanceOptions
  //     case 'responseTimeData': return this.statsService.responseTimeData
  //     case 'responseTimeOptions': return this.statsService.responseTimeOptions
  //     case 'metrics': return this.statsService.metrics
  //     case 'performanceData': return this.statsService.performanceData
  //     case 'difficultProblems': return this.statsService.difficultProblems
  //     case 'userRanking': return this.statsService.userRanking
  //     case 'sessionHistory': return this.statsService.sessionHistory
  //     case 'achievements': return this.statsService.achievements
  //     case 'difficultyStats': return this.statsService.difficultyStats
  //   }
  // }
  // getOperationSeverity(type: string) {
  //   return this.statsService.getOperationSeverity(type);
  // }
}

