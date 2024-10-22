// src/app/features/tour/components/tour-form/tour-form.component.ts

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, inject, Output } from '@angular/core';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.scss'],
})
export class TourFormComponent {
  @Output() submitForm = new EventEmitter<any>();

  private formBuilder = inject(FormBuilder);

  public tourForm = this.formBuilder.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: [null, [Validators.required]],
    loading: [null, [Validators.required]],
    vehicle: [null, [Validators.required]],
    driver: [null, [Validators.required]],
  });

  submit() {
    if (this.tourForm.valid) {
      // Émettre l'événement avec les valeurs du formulaire
      this.submitForm.emit(this.tourForm.value);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.tourForm.markAllAsTouched();
    }
  }
}
