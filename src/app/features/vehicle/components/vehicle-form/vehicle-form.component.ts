import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss',
})
export class VehicleFormComponent {
  @Output() submitForm = new EventEmitter<any>();

  private formBuilder = inject(FormBuilder);

  public vehicleForm = this.formBuilder.group({
    licensePlate: ['', [Validators.required]],
    model: ['', [Validators.required]],
    weight: ['', [Validators.required]],
    volume: ['', [Validators.required]],
  });

  Submit() {
    // Émettre l'événement avec les valeurs du formulaire
    this.submitForm.emit(this.vehicleForm.value);
  }
}
