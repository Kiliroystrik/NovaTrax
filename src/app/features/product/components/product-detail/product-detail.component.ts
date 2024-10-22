import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../client/services/client.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DatePipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { SolidProduct } from '../../interfaces/SolidProduct';
import { LiquidProduct } from '../../interfaces/LiquidProduct';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, ReactiveFormsModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  private productSubscription: Subscription | undefined;

  productId: number | undefined;
  productToDelete: number | null = null;
  public product: Product | undefined;
  public isModalOpen = false;

  // Formulaire réactif adapté pour les produits liquides et solides
  public productForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    // Champs spécifiques pour les produits liquides
    densityKgPerLiter: [''],
    isTemperatureSensitive: [false],
    thermalExpansionCoefficientPerDegreeCelsius: [''],
    // Champs spécifiques pour les produits solides
    lengthCm: [''],
    widthCm: [''],
    heightCm: [''],
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.getProduct();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  getProduct() {
    if (!this.productId) return;

    this.productSubscription = this.productService
      .getProduct(this.productId)
      .subscribe({
        next: (product) => {
          this.product = product;

          // Pré-remplir le formulaire avec les données du produit
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
          });

          // Vérifier si le produit est liquide ou solide
          if (product.type === 'liquid') {
            const liquidProduct = product as LiquidProduct;
            // Tu peux maintenant accéder aux propriétés spécifiques à un produit liquide
            console.log('Produit liquide détecté:', liquidProduct);
          } else if (product.type === 'solid') {
            const solidProduct = product as SolidProduct;
            // Tu peux maintenant accéder aux propriétés spécifiques à un produit solide
            console.log('Produit solide détecté:', solidProduct);
          }
        },
        error: (err) => console.error(err),
      });
  }

  onSubmit() {
    if (this.productForm.invalid || !this.productId) return;

    const productUpdateData = this.productForm.value as Partial<Product>;

    this.productService
      .patchProduct(this.productId, productUpdateData)
      .subscribe({
        next: () => {
          console.log('Produit mis à jour avec succès !');
          this.getProduct();
          this.closeUpdateModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du produit :', err);
        },
      });
  }

  openUpdateModal() {
    this.isModalOpen = true;
  }

  closeUpdateModal() {
    this.isModalOpen = false;
  }

  openDeleteModal(productId: number) {
    this.productToDelete = productId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  onConfirmDelete(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.router.navigate(['/produits']);
        console.log('Produit supprimé avec succès !');
      },
      error: (error) =>
        console.error('Erreur lors de la suppression du produit :', error),
    });
  }

  onCancelDelete() {
    console.log('Suppression annulée');
  }

  isLiquidProduct(product: Product): product is LiquidProduct {
    return (product as LiquidProduct).densityKgPerLiter !== undefined;
  }

  isSolidProduct(product: Product): product is SolidProduct {
    return (product as SolidProduct).lengthCm !== undefined;
  }
}
