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
    weeklyOperations: 0,
    globalPrecision: 0,
    weeklyPrecision: 0
  }
  
  public getGlobalPrecision(userId: string) {
    this.http.get(`${this.url}/global-precision/${userId}`).subscribe({
      next: (response) => {
        this.settings.globalPrecision = response as number;
        this.settings.globalPrecision = Math.round(this.settings.globalPrecision * 100) / 100;
      },
      error: (error) => {
        console.error('Error al recibir las operaciones totales', error);
        return;
      },
    });
  }
  public getWeeklyPrecision(userId: string) {
    this.http.get(`${this.url}/weekly-precision/${userId}`).subscribe({
      next: (response) => {
        this.settings.weeklyPrecision = response as number;
        this.settings.weeklyPrecision = Math.round(this.settings.weeklyPrecision * 100) / 100;
      },
      error: (error) => {
        console.error('Error al recibir las operaciones de la última semana', error); 
        return;
      }
    });
  }
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
  public increaseTotalOperations(userId: string, isCorrect: boolean) {
    this.http.post(`${this.url}`, { userId: userId, isCorrect }).subscribe({
      next: (response) => {
        console.log('Operación registrada correctamente', response);
      },
      error: (error) => {
        console.error('Error al registrar la operación', error);
        return;
      },
    });
  }
}
