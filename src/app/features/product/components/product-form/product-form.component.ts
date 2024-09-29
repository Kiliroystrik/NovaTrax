import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../../unit-of-measure/services/unit-of-measure.service';
import { UnitOfMeasure } from './../../../unit-of-measure/interfaces/unit-of-measure';
import { Component, EventEmitter, inject, Output } from '@angular/core';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  @Output() submitForm = new EventEmitter<any>();

  private unitOfMeasureService = inject(UnitOfMeasureService);
  private formBuilder = inject(FormBuilder);

  public unitOfMeasureList: UnitOfMeasure[] = [];

  public productForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    unitOfMeasure: [0, [Validators.required]]
  });

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.unitOfMeasureService.getUnitOfMeasures(1, 0).subscribe((response) => {
      this.unitOfMeasureList = response.items;
    })
  }

  Submit() {
    // Émettre l'événement avec les valeurs du formulaire
    this.submitForm.emit(this.productForm.value);
  }
}
