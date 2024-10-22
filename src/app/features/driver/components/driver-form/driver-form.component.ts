import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, inject, Output } from '@angular/core';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.scss',
})
export class DriverFormComponent {
  @Output() submitForm = new EventEmitter<any>();

  private formBuilder = inject(FormBuilder);

  public driverForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    licenseNumber: ['', [Validators.required]],
  });

  Submit() {
    // Émettre l'événement avec les valeurs du formulaire
    this.submitForm.emit(this.driverForm.value);
  }
}
