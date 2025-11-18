import { inject, Injectable } from '@angular/core';
import { WebsocketsService } from './websockets.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { StatsService } from './stats.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly wsService = inject(WebsocketsService);
  private readonly statsService = inject(StatsService);

  private readonly audio = new Audio();
  public exercises: any[] = [];
  public correctAnswers: number = 0;
  public incorrectAnswers: number = 0;
  public timeLeft: number = 0;
  public timeLeft$ = new BehaviorSubject<number>(0);
  private timerInterval: any;
  public timeUpdated = new Subject<number>();
  public currentExercise!: any;
  public currentStreak: number = 0;
  public maxStreak: number = 0;
  public showFeedback: boolean = false;
  public totalExercises: number = 0;

  // public checkSolution(solution: any | number): void {
  //   let inputValue
  //   let parsedValue
  //   let a
  //   if (typeof solution === 'number') {
  //     a = true
  //     inputValue = solution.toString();
  //     parsedValue = solution;
  //   } else {
  //     a = false
  //     inputValue = solution.target.value;
  //     parsedValue = parseInt(inputValue, 10);
  //     console.log(inputValue, parsedValue);
  //   }
  //   if (inputValue === '') return
  //   if (parsedValue === this.currentExercise.result && inputValue !== '') {
  //     if (this.exercises.length === 0) {
  //       this.playSound('./sounds/sucess.mp3');
  //       return
  //     }
  //     if (a) solution = null
  //     else solution.target.value = '';
  //     this.playSound('./sounds/pop.mp3');
  //     this.correctAnswers++;
  //     this.currentStreak++;
  //     if (this.currentStreak > this.maxStreak) this.maxStreak = this.currentStreak;
  //     this.statsService.increaseTotalOperations(localStorage.getItem('userId')!, false);
  //     this.currentExercise = this.exercises.pop();
  //   } else if (parsedValue !== this.currentExercise.result || inputValue === '') {
  //     this.playSound('./sounds/error.mp3');
  //     this.incorrectAnswers++;
  //     this.currentStreak = 0;
  //     solution.target.value = '';
  //     return
  //   }
  // }

  public hasRecordedOperation = false;

  public checkSolution(solution: any | number): void {
    let inputValue;
    let parsedValue;
    let a;

    if (typeof solution === 'number') {
      a = true;
      inputValue = solution.toString();
      parsedValue = solution;
    } else {
      a = false;
      inputValue = solution.target.value;
      parsedValue = parseInt(inputValue, 10);
    }
    if (inputValue === '') return;
    if (parsedValue !== this.currentExercise.result) {
      
      if (!this.hasRecordedOperation) {
        this.statsService.increaseTotalOperations(
          localStorage.getItem('userId')!,
          false
        );
        this.hasRecordedOperation = true;
      }

      this.playSound('./sounds/error.mp3');
      this.incorrectAnswers++;
      this.currentStreak = 0;

      if (!a) solution.target.value = '';
      return;
    }

    if (!this.hasRecordedOperation) {
      this.statsService.increaseTotalOperations(
        localStorage.getItem('userId')!,
        true
      );
    }

    this.correctAnswers++;
    this.currentStreak++;
    if (this.currentStreak > this.maxStreak) this.maxStreak = this.currentStreak;

    this.hasRecordedOperation = false;

    if (this.exercises.length === 0) {
      this.playSound('./sounds/sucess.mp3');
      return;
    }

    if (!a) solution.target.value = '';
    this.playSound('./sounds/pop.mp3');
    this.currentExercise = this.exercises.pop();
  }


  public get progress(): number {
    const completed = this.totalExercises - this.exercises.length - 1;  
    return Math.max(0, (completed / this.totalExercises) * 100);
  }
  public async getExercises(mode: string, count: number): Promise<void> {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    await this.wsService.connect(userId!, token!);

    this.wsService.on<{ exercises: any[] }>('gameStarted').subscribe((payload) => {
      this.exercises = payload.exercises;
      this.totalExercises = payload.exercises.length;
      this.currentExercise = this.exercises.pop();
      this.startTimer();
    });

    this.wsService.emit('startGame', { operationType: mode.toUpperCase(), count: count});
  }
  public startTimer(): void {
    this.timeLeft = this.calculateTotalTime();
    this.timeLeft$.next(this.timeLeft);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timeLeft$.next(this.timeLeft);
      if (this.timeLeft <= 5 && this.timeLeft > 0) this.playSound('./sounds/beep.mp3');
      if (this.timeLeft <= 0) this.stopTimer();
    }, 1000);
  }
  public stopTimer(): void {
    clearInterval(this.timerInterval);
    this.showFeedback = true
  }
  private calculateTotalTime(): number {
    const secondsPerExercise = 7;
    return this.exercises.length * secondsPerExercise;
  }
  private playSound(soundPath: string): void {
    this.audio.src = soundPath;
    this.audio.load();
    this.audio.play().catch((e) => console.error('Error al reproducir sonido:', e));
  }
  
}