import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChartModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aritmetio-frontend-u');
}
