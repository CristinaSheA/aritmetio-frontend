import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Stats } from '../interfaces/stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  public showStats: boolean = true;
  public url: string = 'http://localhost:3000/stats';
  private readonly http = inject(HttpClient);

  public settings: Stats = {
    totalOperations: 0,
    weeklyOperations: 0
  }

  
  public getGlobalPrecision(userId: string) {}
  public getWeeklyPrecision(userId: string) {}
  public getAverageTimePerOperation(userId: string) {}

  public async getTotalOperations(userId: string) {
    this.http.get(`${this.url}/total-operations/${userId}`).subscribe({
      next: (response) => {
        this.settings.totalOperations = response as number;
      },
      error: (error) => {
        console.error('Error al recibir las operaciones totales', error);
        return;
      },
    });
  }
  public async getWeeklyOperations(userId: string) {
    this.http.get(`${this.url}/weekly-operations/${userId}`).subscribe({
      next: (response) => {
        this.settings.weeklyOperations = response as number;
      },
      error: (error) => {
        console.error('Error al recibir las operaciones de la última semana', error);
        return;
      },
    });
  }
  public increaseTotalOperations(userId: string) {
    this.http.post(`${this.url}`, { userId: userId }).subscribe({
      next: (response) => {
        console.log('Operación registrada correctamente', response);
      },
      error: (error) => {
        console.error('Error al registrar la operación', error);
        return;
      },
    });
  }
  public getMaximumPunctuation(userId: string) {}
}
