import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  public showStats: boolean = false;

  constructor() { }
  progressData: any;
  progressOptions: any;
  distributionData: any;
  distributionOptions: any;
  dailyPerformanceData: any;
  dailyPerformanceOptions: any;
  responseTimeData: any;
  responseTimeOptions: any;
  metrics = {
    globalAccuracy: 87,
    avgTime: 12.4,
    totalOperations: 348,
    maxScore: 92,
    streak: 7,
    improvement: 5.2
  };

  performanceData: any[] = [];
  difficultProblems: any[] = [];
  userRanking: any[] = [];
  sessionHistory: any[] = [];
  achievements: any[] = [];
  difficultyStats: any[] = [];


  public initializeCharts() {
    this.progressData = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Precisión (%)',
          data: [75, 78, 82, 80, 85, 87, 90],
          borderColor: '#2583f2',
          tension: 0.4,
          backgroundColor: '#bedafb55',
          fill: true
        },
        {
          label: 'Operaciones realizadas',
          data: [0, 25, 30, 35, 40, 42, 45],
          borderColor: '#f47c26',
          tension: 0.4,
          borderDash: [5, 5],
          backgroundColor: 'transparent'
        }
      ]
    };
    this.progressOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#64748b'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        y: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            color: '#e2e8f0'
          }
        }
      }
    };
    this.distributionData = {
      labels: ['Suma', 'Resta', 'Multiplicación', 'División'],
      datasets: [
        {
          data: [35, 25, 30, 10],
          backgroundColor: ['#E5665D', '#2583f2', '#10b981', '#FEB94E']
        }
      ]
    };
    this.distributionOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#64748b',
            padding: 20
          }
        }
      },
      cutout: '60%'
    };
    this.dailyPerformanceData = {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Operaciones correctas',
          backgroundColor: '#4f46e5',
          data: [15, 22, 18, 27, 32, 25, 20]
        },
        {
          label: 'Operaciones incorrectas',
          backgroundColor: '#ef4444',
          data: [5, 3, 7, 4, 2, 5, 3]
        }
      ]
    };
    this.dailyPerformanceOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#64748b'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        y: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            color: '#e2e8f0'
          }
        }
      }
    };
    this.responseTimeData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Tiempo promedio (segundos)',
          data: [18.5, 16.2, 14.8, 13.5, 12.9, 12.4],
          borderColor: '#10b981',
          tension: 0.4,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }
      ]
    };
    this.responseTimeOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#64748b'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        y: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            color: '#e2e8f0'
          }
        }
      }
    };
  }
  public loadPerformanceData() {
    this.performanceData = [
      { operation: 'Multiplicación', accuracy: 94, total: 105, correct: 99 },
      { operation: 'Suma', accuracy: 88, total: 122, correct: 107 },
      { operation: 'Resta', accuracy: 82, total: 87, correct: 71 },
      { operation: 'División', accuracy: 76, total: 34, correct: 26 }
    ];
  }
  public loadDifficultProblems() {
    this.difficultProblems = [
      { 
        type: 'División', 
        problem: '128 ÷ 7 = ?', 
        accuracy: 32, 
        time: 24.3,
        attempts: 25,
        correct: 8
      },
      { 
        type: 'Multiplicación', 
        problem: '17 × 23 = ?', 
        accuracy: 45, 
        time: 18.7,
        attempts: 20,
        correct: 9
      },
      { 
        type: 'Resta', 
        problem: '215 - 187 = ?', 
        accuracy: 52, 
        time: 14.2,
        attempts: 23,
        correct: 12
      },
      { 
        type: 'Suma', 
        problem: '379 + 168 = ?', 
        accuracy: 58, 
        time: 12.8,
        attempts: 19,
        correct: 11
      }
    ];
  }
  public loadUserRanking() {
    this.userRanking = [
      { name: 'María González', accuracy: 92, position: 1, operations: 412, avatar: 'MG' },
      { name: 'Juan Pérez', accuracy: 87, position: 2, operations: 387, avatar: 'JP' },
      { name: 'Ana Rodríguez', accuracy: 85, position: 3, operations: 365, avatar: 'AR' },
      { name: 'Tú', accuracy: 87, position: 4, operations: 348, avatar: 'TÚ', highlight: true },
      { name: 'Carlos López', accuracy: 83, position: 5, operations: 321, avatar: 'CL' }
    ];
  }
  public loadSessionHistory() {
    this.sessionHistory = [
      { date: '2023-11-15', duration: '15 min', operations: 32, accuracy: 91 },
      { date: '2023-11-14', duration: '12 min', operations: 28, accuracy: 85 },
      { date: '2023-11-13', duration: '18 min', operations: 42, accuracy: 88 },
      { date: '2023-11-12', duration: '10 min', operations: 22, accuracy: 82 },
      { date: '2023-11-11', duration: '20 min', operations: 45, accuracy: 87 },
      { date: '2023-11-10', duration: '14 min', operations: 35, accuracy: 90 },
      { date: '2023-11-09', duration: '16 min', operations: 38, accuracy: 84 }
    ];
  }
  public loadAchievements() {
    this.achievements = [
      { name: 'Primeros pasos', description: 'Completar 10 operaciones', icon: 'pi pi-star', unlocked: true, progress: 100 },
      { name: 'Precisión perfecta', description: 'Obtener 100% de precisión en una sesión', icon: 'pi pi-check', unlocked: true, progress: 100 },
      { name: 'Racha de 7 días', description: 'Practicar 7 días consecutivos', icon: 'pi pi-calendar', unlocked: true, progress: 100 },
      { name: 'Velocidad relámpago', description: 'Resolver 10 operaciones en menos de 2 min', icon: 'pi pi-bolt', unlocked: false, progress: 70 },
      { name: 'Maestro de la multiplicación', description: 'Dominar todas las tablas de multiplicar', icon: 'pi pi-times', unlocked: false, progress: 65 },
      { name: '100 operaciones', description: 'Completar 100 operaciones en total', icon: 'pi pi-trophy', unlocked: false, progress: 87 }
    ];
  }
  public loadDifficultyStats() {
    this.difficultyStats = [
      { level: 'Fácil', operations: 145, accuracy: 95, avgTime: 8.2 },
      { level: 'Intermedio', operations: 127, accuracy: 86, avgTime: 12.7 },
      { level: 'Avanzado', operations: 76, accuracy: 72, avgTime: 18.4 }
    ];
  }
  public getOperationSeverity(type: string) {
    switch (type) {
      case 'Suma': return 'primary';
      case 'Resta': return 'danger';
      case 'Multiplicación': return 'success';
      case 'División': return 'warning';
      default: return 'info';
    }
  }
  // private getDifficultySeverity(level: string) {
  //   switch (level) {
  //     case 'Fácil': return 'success';
  //     case 'Intermedio': return 'warning';
  //     case 'Avanzado': return 'danger';
  //     default: return 'info';
  //   }
  // }
  // private getAchievementSeverity(unlocked: boolean) {
  //   return unlocked ? 'success' : 'secondary';
  // }
  // private formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  // }
}
