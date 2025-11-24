import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Stats } from '../interfaces/stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  public url: string = 'http://localhost:3000/stats';
  private readonly http = inject(HttpClient);

  public stats: Stats = {
    totalOperations: [],
    weeklyOperations: 0,
    globalPrecision: 0,
    weeklyPrecision: 0
  }
  
  public getGlobalPrecision(userId: string) {
    const response = this.http.get(`${this.url}/global-precision/${userId}`)
    this.stats.globalPrecision = response as unknown as number;
    this.stats.globalPrecision = Math.round(this.stats.globalPrecision * 100) / 100;
  }
  public getWeeklyPrecision(userId: string) {
    const response = this.http.get(`${this.url}/weekly-precision/${userId}`)
    this.stats.weeklyPrecision = response as unknown as number;
    this.stats.weeklyPrecision = Math.round(this.stats.weeklyPrecision * 100) / 100;
    
  }
  public async getTotalOperations(userId: string) {
    const response = this.http.get(`${this.url}/total-operations/${userId}`)
    this.stats.totalOperations = response as unknown as [];
    console.log(this.stats.totalOperations);
  }
  public async getWeeklyOperations(userId: string) {
    const response = this.http.get(`${this.url}/weekly-operations/${userId}`)
    this.stats.weeklyOperations = response as unknown as number;
  }
  public increaseTotalOperations(userId: string, isCorrect: boolean, type: string) {
    this.http.post(`${this.url}`, { userId: userId, isCorrect, type })
  }
}
