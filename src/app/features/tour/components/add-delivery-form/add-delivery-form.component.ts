import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DeliveryService } from '../../../delivery/services/delivery-service';

@Component({
  selector: 'app-add-delivery-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-delivery-form.component.html',
  styleUrl: './add-delivery-form.component.scss',
})
export class AddDeliveryFormComponent {
  @Output() deliveryAdded = new EventEmitter<void>();
  deliveryForm: FormGroup;
  isSubmitting: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService
  ) {
    this.deliveryForm = this.fb.group({
      // Définissez les contrôles du formulaire ici
      geocodedAddress: ['', Validators.required],
      expectedDeliveryDate: ['', Validators.required],
      // ... autres champs nécessaires
    });
  }

  onSubmit() {
    if (this.deliveryForm.invalid) return;

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.deliveryForm.value;

    this.deliveryService.createDelivery(formValue).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.deliveryAdded.emit();
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de l'ajout de la livraison.";
        this.isSubmitting = false;
      },
    });
  }

  onCancel() {
    this.deliveryAdded.emit(); // Fermer le formulaire sans ajouter
  }
}
