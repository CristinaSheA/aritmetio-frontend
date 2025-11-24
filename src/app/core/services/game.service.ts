import { inject, Injectable } from '@angular/core';
import { WebsocketsService } from './websockets.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { StatsService } from './stats.service';
import { Exercise } from '../interfaces/exercise';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly wsService = inject(WebsocketsService);
  private readonly statsService = inject(StatsService);

  public exercises: any[] = [];
  public currentExercise!: any;
  public totalExercises: number = 0;
  public correctAnswers: number = 0;
  public currentStreak: number = 0;
  public maxStreak: number = 0;
  public showFeedback: boolean = false;
  private operationRecorded: boolean = false;
  public readonly timeLeft$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private timerInterval: number | undefined;

  public get progress(): number {
    const completed = this.totalExercises - this.exercises.length - 1;
    return Math.max(0, (completed / this.totalExercises) * 100);
  }
  public async getAllExercises(mode: string, count: number): Promise<void> {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    await this.wsService.connect(userId!, token!);

    this.wsService
      .on<{ exercises: any[] }>('gameStarted')
      .subscribe((payload) => {
        this.exercises = payload.exercises;
        this.totalExercises = payload.exercises.length;
        this.currentExercise = this.exercises.pop();
        this.startTimer();
      });

    this.wsService.emit('startGame', {
      operationType: mode.toUpperCase(),
      count: count,
    });
  }
  public checkSolution(solution: any | number, type: string): void {
    let inputValue;
    let parsedValue;
    let isNumberInput;

    if (typeof solution === 'number') {
      isNumberInput = true;
      inputValue = solution.toString();
      parsedValue = solution;
    } else {
      isNumberInput = false;
      inputValue = solution.target.value;
      parsedValue = parseInt(inputValue, 10);
    }
    if (inputValue === '') return;
    if (parsedValue !== this.currentExercise.result) {
      if (!this.operationRecorded) {
        this.statsService.increaseTotalOperations(
          localStorage.getItem('userId')!,
          false,
          type
        );
        this.operationRecorded = true;
      }
      this.playSound('./sounds/error.mp3');
      this.currentStreak = 0;
      if (!isNumberInput) solution.target.value = '';
      return;
    }
    if (!this.operationRecorded) {
      this.statsService.increaseTotalOperations(
        localStorage.getItem('userId')!,
        true,
        type
      );
    }
    this.correctAnswers++;
    this.currentStreak++;
    if (this.currentStreak > this.maxStreak) this.maxStreak = this.currentStreak;
    this.operationRecorded = false;
    if (this.exercises.length === 0) {
      this.playSound('./sounds/sucess.mp3');
      return;
    }

    if (!isNumberInput) solution.target.value = '';
    this.playSound('./sounds/pop.mp3');
    this.currentExercise = this.exercises.pop();
  }
  private startTimer() {
    const totalTime = this.getInitialTime();
    this.timeLeft$.next(totalTime);

    this.timerInterval = setInterval(() => {
      const current = this.timeLeft$.value - 1;
      this.timeLeft$.next(current);

      if (current <= 5 && current > 0) this.playSound('./sounds/beep.mp3');
      if (current <= 0) clearInterval(this.timerInterval);
    }, 1000);
  }
  private getInitialTime() {
    return this.exercises.length * 7;
  }
  private playSound(audioPath: string) {
    const audio = new Audio(audioPath);
    audio.play().catch();
  }
}
