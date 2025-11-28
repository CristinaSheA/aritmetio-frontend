import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { GameService } from '../../../../../core/services/game.service';
import { RouterLink } from '@angular/router';

const POSITIVE_MESSAGES: string[] = [
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
];
const SUPPORTIVE_MESSAGES: string[] = [
  '¡Uy, esta vez no salió! 💥💪',
  '¡Casi! Vamos a intentarlo de nuevo 🔄⭐',
  '¡Fallaste, pero eso se aprende! 📘✨',
  '¡Hoy no fue, pero mañana sí! ⏳💡',
  '¡No lo lograste, sigue adelante! 🚀🔥',
  '¡Errores hoy, aciertos mañana! 🧠💛',
  '¡Ups! Esto fue difícil 😅📖',
  '¡No llegaste al 50%, pero no te rindas! 💪🌟',
  '¡Hoy fallaste, mañana lo lograrás! 🏆📚',
  '¡Se puede mejorar! Cada fallo cuenta 💡💥',
];
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

  public messages: string[] = POSITIVE_MESSAGES;
  public supportiveMessages: string[] = SUPPORTIVE_MESSAGES;

  public get totalExercises(): number {
    return this.gameService.totalExercises;
  }
  public get correctAnswers(): number {
    return this.gameService.correctAnswers;
  }
  public get accuracyPercentage(): number {
    return this.gameService.accuracyPercentage;
  }
  public get maxStreak(): number {
    return this.gameService.maxStreak + 1;
  }
  public get feedbackMessage(): string {
    if (this.accuracyPercentage > 50) {
      const index = Math.floor(Math.random() * this.messages.length);
      return this.messages[index];
    } else {
      const supportiveIndex = Math.floor(
        Math.random() * this.supportiveMessages.length
      );
      return this.supportiveMessages[supportiveIndex];
    }
  }
  public redirectMainPage(): void {
    this.gameService.showFeedback = false;
    this.gameService.correctAnswers = 0;
    this.gameService.currentStreak = 0;
    this.gameService.maxStreak = 0;
  }
}
