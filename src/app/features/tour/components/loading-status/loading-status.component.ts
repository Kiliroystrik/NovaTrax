import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-status.component.html',
  styleUrl: './loading-status.component.scss',
})
export class LoadingStatusComponent {
  @Input() totalWeight: number = 0;
  @Input() totalVolume: number = 0;
  @Input() weightPercentage: number = 0;
  @Input() volumePercentage: number = 0;
  @Input() vehicleWeight: number = 0;
  @Input() vehicleVolume: number = 0;

  constructor() {}
}
