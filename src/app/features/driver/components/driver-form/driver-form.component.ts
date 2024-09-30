import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../../unit-of-measure/services/unit-of-measure.service';
import { UnitOfMeasure } from './../../../unit-of-measure/interfaces/unit-of-measure';
import { Component, EventEmitter, inject, Output } from '@angular/core';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.scss'
})
export class DriverFormComponent {
  @Output() submitForm = new EventEmitter<any>();

  private formBuilder = inject(FormBuilder);

  public licenseNumberList: UnitOfMeasure[] = [];

  public driverForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    licenseNumber: ['', [Validators.required]]
  });


  Submit() {
    // Émettre l'événement avec les valeurs du formulaire
    this.submitForm.emit(this.driverForm.value);
  }
}
