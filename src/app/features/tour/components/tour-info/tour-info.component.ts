import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Warehouse } from '../../../warehouse/interfaces/warehouse';
import { Driver } from '../../../driver/interfaces/driver';
import { Vehicle } from '../../../vehicle/interfaces/vehicle';
import { Status } from '../../../status/interfaces/status';

@Component({
  selector: 'app-tour-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tour-info.component.html',
  styleUrl: './tour-info.component.scss',
})
export class TourInfoComponent implements OnInit {
  @Input() tourForm!: FormGroup;
  @Input() warehouses: Warehouse[] = [];
  @Input() drivers: Driver[] = [];
  @Input() statuses: Status[] = [];
  @Input() vehicles: Vehicle[] = [];
  @Input() isEditing: boolean = false;
  @Input() isSubmitting: boolean = false;
  @Input() error: string | null = null;
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {}
}
