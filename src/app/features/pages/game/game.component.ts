import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { GameService } from '../../../core/services/game.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-game',
  imports: [FormsModule, FeedbackComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly gameService = inject(GameService);
  private readonly authService = inject(AuthService);
  public mode!: string;
  public solucionCociente!: number;
  public solucionResto!: number;
  public timeLeft$ = this.gameService.timeLeft$;

  ngOnInit() {
    let count
    this.mode = this.route.snapshot.paramMap.get('mode') || '';
    const userId = localStorage.getItem('userId');
    this.authService.users.filter(user => {
      if (user.id === userId) {
        count = Number(user.exercisesPerGame);
      } 
    });
    if (!count) count = 10;
    this.gameService.getExercises(this.mode, count);
  }

  public get currentExercise(): any {
    return this.gameService.currentExercise;
  }
  public get progress(): number {
    return this.gameService.progress;
  }
  public get showFeedback(): boolean {
    return this.gameService.showFeedback;
  }
  public get timeLeft(): number {
    return this.gameService.timeLeft;
  }

  public checkDivision(): void {
    console.log(this.solucionCociente, this.solucionResto, this.currentExercise);
    this.gameService.checkSolution(this.solucionCociente)
    
    if (this.solucionResto === this.currentExercise.remainder
    ) {
      this.solucionCociente = null as any;
      this.solucionResto = null as any;
      if (this.gameService.exercises.length === 0) {
        this.gameService.showFeedback = true;
      }
      this.cdr.detectChanges();
    }

  }
  public checkSolution(solution: any | number): void {
    this.gameService.checkSolution(solution);
    if (this.gameService.exercises.length === 0) {
      this.gameService. showFeedback = true;
    }
  }
  public getDigits(num: number): string[] {
    return num.toString().split('');
  }
}
