import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Product } from '../../interfaces/product';
import { SolidProduct } from '../../interfaces/SolidProduct';
import { LiquidProduct } from '../../interfaces/LiquidProduct';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  @Output() submitForm = new EventEmitter<any>();
  @Input() product: Product | undefined; // Le produit peut être passé en entrée

  private formBuilder = inject(FormBuilder);
  public productForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initForm();
  }

  // Initialisation du formulaire
  initForm(): void {
    if (!this.product) return;

    // Champs communs
    this.productForm = this.formBuilder.group({
      name: [this.product.name, [Validators.required]],
      description: [this.product.description],
      weightKg: [this.product.weightKg],
    });

    // Champs spécifiques en fonction du type de produit
    if (this.isLiquidProduct(this.product)) {
      this.productForm.addControl(
        'densityKgPerLiter',
        new FormControl(this.product.densityKgPerLiter)
      );
      this.productForm.addControl(
        'isTemperatureSensitive',
        new FormControl(this.product.isTemperatureSensitive)
      );
      this.productForm.addControl(
        'thermalExpansionCoefficientPerDegreeCelsius',
        new FormControl(
          this.product.thermalExpansionCoefficientPerDegreeCelsius
        )
      );
    } else if (this.isSolidProduct(this.product)) {
      this.productForm.addControl(
        'lengthCm',
        new FormControl(this.product.lengthCm)
      );
      this.productForm.addControl(
        'widthCm',
        new FormControl(this.product.widthCm)
      );
      this.productForm.addControl(
        'heightCm',
        new FormControl(this.product.heightCm)
      );
    }
  }

  // check si le formulaire à été changé
  isFormChanged(): boolean {
    return this.productForm.dirty;
  }

  // Méthodes pour vérifier le type de produit
  isLiquidProduct(product: Product): product is LiquidProduct {
    return 'densityKgPerLiter' in product;
  }

  isSolidProduct(product: Product): product is SolidProduct {
    return 'lengthCm' in product;
  }

  // Soumettre le formulaire
  Submit(): void {
    if (this.productForm.invalid) return;

    this.submitForm.emit(this.productForm.value);
  }
}
