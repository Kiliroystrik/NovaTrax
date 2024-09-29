import { UnitOfMeasure } from './../../../unit-of-measure/interfaces/unit-of-measure';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../client/services/client.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DatePipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { UnitOfMeasureService } from '../../../unit-of-measure/services/unit-of-measure.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, ReactiveFormsModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  // ----- Services et dépendances -----
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private unitOfMeasureService = inject(UnitOfMeasureService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  // ----- Subscription -----
  private productSubscription: Subscription | undefined;

  // ----- Données -----
  public unitOfMeasureList: any[] = [];
  productId: number | undefined;
  productToDelete: number | null = null;
  public product: Product | undefined;
  public isModalOpen = false;

  // ----- Formulaire réactif -----
  public productForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    unitOfMeasure: [0, [Validators.required]]  // Sélecteur client obligatoire
  });

  // ----- Cycle de vie -----
  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.getProduct();
    this.getUnitOfMeasureList();  // Récupérer les clients pour le sélecteur
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  // ----- Gestion de la commande -----

  /** Récupération des détails de la commande */
  getProduct() {
    if (!this.productId) return;

    this.productSubscription = this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.product = product;

        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          unitOfMeasure: product.unitOfMeasure.id  // Utiliser l'ID du client
        });
      },
      error: (err) => console.error(err),
    });
  }

  /** Récupération de la liste des clients */
  getUnitOfMeasureList() {
    this.unitOfMeasureService.getUnitOfMeasures().subscribe({
      next: (data) => {
        this.unitOfMeasureList = data.items;  // Charger la liste des clients
      },
      error: (err) => console.error(err),
    });
  }

  /** Mise à jour de la commande */
  onSubmit() {
    if (this.productForm.invalid || !this.productId) return;

    const productUpdateData = this.productForm.value as Partial<Product>;

    this.productService.patchProduct(this.productId, productUpdateData).subscribe({
      next: () => {
        console.log('Commande mise à jour avec succès !');
        this.getProduct();  // Rafraîchir la commande
        this.closeUpdateModal();  // Fermer la modale après la mise à jour
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la commande :', err);
      }
    });
  }

  // ----- Modale de mise à jour -----

  /** Ouvrir la modale de mise à jour */
  openUpdateModal() {
    this.isModalOpen = true;  // Ouvre la modale de mise à jour
  }

  /** Fermer la modale de mise à jour */
  closeUpdateModal() {
    this.isModalOpen = false;  // Ferme la modale
  }

  // ----- Gestion de la suppression -----

  /** Ouvrir la modale de suppression */
  openDeleteModal(productId: number) {
    this.productToDelete = productId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  /** Confirmation de la suppression */
  onConfirmDelete(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.router.navigate(['/produits']);  // Redirection après suppression
        console.log('Commande supprimée avec succès !');
      },
      error: (error) => console.error('Erreur lors de la suppression de la commande :', error),
    });
  }

  /** Annulation de la suppression */
  onCancelDelete() {
    console.log('Suppression annulée');
  }

}
