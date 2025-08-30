import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WebsocketsService } from '../../../core/services/websockets.service';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { GameService } from '../../../core/services/game.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  public mode!: string;
  public showFeedback: boolean = false;
  private timeSub!: Subscription;
  public solucionCociente!: number;
  public solucionResto!: number;

  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode') || '';
    this.gameService.getExercises(this.mode);
    this.cdr.detectChanges();
    this.timeSub = this.gameService.timeUpdated.subscribe((time) => {
      console.log('Tiempo actualizado:', time);
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    this.timeSub.unsubscribe();
    this.gameService.stopTimer();
  }
  public get timeLeft(): number {
    return this.gameService.timeLeft;
  }
  public get currentExercise():any {
    return this.gameService.currentExercise;
  }
  public checkSolution(solution: any | number) {
    this.gameService.checkSolution(solution);
    if (this.gameService.exercises.length === 0) {
      this.showFeedback = true;
      this.cdr.detectChanges();
    }
  }
  public checkDivision() {
    console.log(this.solucionCociente, this.solucionResto, this.currentExercise);
    this.gameService.checkSolution(this.solucionCociente)
    
    if (this.solucionResto === this.currentExercise.remainder
    ) {
      this.solucionCociente = null as any;
      this.solucionResto = null as any;
      if (this.gameService.exercises.length === 0) {
        this.showFeedback = true;
      }
      this.cdr.detectChanges();
    }

  }
  public getDigits(num: number): string[] {
    return num.toString().split('');
  }
}
