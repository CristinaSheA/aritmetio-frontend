import { inject, Injectable } from '@angular/core';
import { WebsocketsService } from './websockets.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly wsService = inject(WebsocketsService);
  private readonly audio = new Audio();
  public exercises: any[] = [];
  public correctAnswers: number = 0;
  public incorrectAnswers: number = 0;
  public timeLeft: number = 0;
  private timerInterval: any;
  public timeUpdated = new Subject<number>();
  public currentExercise!: any;
  public currentStreak: number = 0;
  public maxStreak: number = 0;


  public startTimer(): void {
    this.timeLeft = this.calculateTotalTime();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timeUpdated.next(this.timeLeft);
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  public stopTimer(): void {
    clearInterval(this.timerInterval);
  }
  public checkSolution(solution: any | number): void {
    console.log('a');
    let inputValue
    let parsedValue
    let a
    if (typeof solution === 'number') {
      a = true
      inputValue = solution.toString();
      parsedValue = solution;
      console.log(inputValue, parsedValue);
    } else {
      a = false
      inputValue = solution.target.value;
      parsedValue = parseInt(inputValue, 10);
      console.log(inputValue, parsedValue);
    }
    
    if (parsedValue === this.currentExercise.result && inputValue !== '') {
      if (this.exercises.length === 0) {
        this.playSound('./sounds/sucess.mp3');
        return
      }
      if (a) {
        solution = null
      } else {
        solution.target.value = '';
      }
      this.playSound('./sounds/pop.mp3');
      this.correctAnswers++;
      console.log(this.correctAnswers);
      
      this.currentStreak++;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }
      this.currentExercise = this.exercises.pop();
    } else if (parsedValue !== this.currentExercise.result || inputValue === '') {
      solution.target.value = '';
      this.playSound('./sounds/error.mp3');
      this.incorrectAnswers++;
      console.log(this.incorrectAnswers);
      this.currentStreak = 0;
      solution.target.value = '';
      return
    }
  }
  public async getExercises(mode: string): Promise<void> {
    await this.wsService.connect();
    this.wsService.emit('startGame', { operationType: mode.toUpperCase() });
    this.wsService
      .on<{ exercises: any[] }>('gameStarted')
      .subscribe((payload) => {
        
        this.exercises = payload.exercises;
        console.log('Ejercicios recibidos:', this.exercises);
        this.currentExercise = this.exercises.pop();
        console.log('Current Exercise:', this.currentExercise);
        this.startTimer();
      });
  }
  private playSound(soundPath: string): void {
    this.audio.src = soundPath;
    this.audio.load();
    this.audio.play().catch((e) => console.error('Error al reproducir sonido:', e));
  }
  private calculateTotalTime(): number {
    const secondsPerExercise = 7;
    return this.exercises.length * secondsPerExercise;
  }
}