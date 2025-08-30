import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { GameService } from '../../../../../core/services/game.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'feedback',
  imports: [RouterLink],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  @Input() mode!: string;
  private readonly gameService = inject(GameService);

  public messages: string[] = [
    '¡Increíble trabajo, campeón! 🏅✨',
    '¡Sigue así, eres una estrella! ⭐️🚀',
    '¡Matemáticas dominadas, genio! 🧠🔥',
    '¡Qué gran esfuerzo, felicidades! 👏😃',
    '¡Lo lograste, sigue aprendiendo! 📚🥳',
    '¡Tus respuestas brillan como tú! 💡😎',
    '¡Superaste el reto, eres valiente! 🦸‍♂️💪',
    '¡Cada día mejor, sigue practicando! ⏳🌟',
    '¡Tu constancia es admirable! 🏆🔢',
    '¡Te has superado, ¡qué orgullo! 🥇🎉',
  ]
  public get totalExercises(): number {
  return this.gameService.correctAnswers + this.gameService.incorrectAnswers;
  }
  public get correctAnswers(): number {
    return this.gameService.correctAnswers;
  }
  public get incorrectAnswers(): number {
    return this.gameService.incorrectAnswers;
  }
  public get successPercentage(): number {
    const total = this.totalExercises;
    if (total === 0) return 0;
    return Math.round((this.correctAnswers / total) * 100);
  }
  public get maxStreak(): number {
    return this.gameService.maxStreak;
  }
  public get randomMessage(): string {
    const 
    index = Math.floor(Math.random() * this.messages.length);
    return this.messages[index];
  }

}

