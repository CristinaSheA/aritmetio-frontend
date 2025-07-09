import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mode-selector',
  imports: [],
  templateUrl: './mode-selector.component.html',
  styleUrl: './mode-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectorComponent { }
