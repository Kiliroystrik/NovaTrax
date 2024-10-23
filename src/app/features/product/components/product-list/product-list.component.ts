import { ProductService } from './../../services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Product } from '../../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { LiquidProduct } from '../../interfaces/LiquidProduct';
import { SolidProduct } from '../../interfaces/SolidProduct';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    DeleteConfirmationModalComponent,
    SlicePipe,
    ProductFormComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  products: Product[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  productToDelete: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService
      .getProducts(this.currentPage, this.limit)
      .subscribe((response) => {
        this.products = response.items;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
      });
  }

  getPagesAroundCurrent(): number[] {
    const range = 2;
    const pages: number[] = [];

    if (this.totalPages <= 1) {
      return pages;
    }

    for (
      let i = Math.max(2, this.currentPage - range);
      i <= Math.min(this.totalPages - 1, this.currentPage + range);
      i++
    ) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchProducts();
    }
  }

  /***Partie Modal de création d'product ****/
  openModal() {
    const dialog: any = document.getElementById('productCreationModal');
    dialog?.showModal();
  }

  closeModal() {
    const dialog: any = document.getElementById('productCreationModal');
    dialog?.close();
  }

  onProductFormSubmit(productData: any) {
    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.closeModal();
        this.fetchProducts();
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande :', error);
      },
    });
  }

  /***Partie Modal de suppression d'product ****/
  // Ouvrir la modale de confirmation avec l'ID de la commande à supprimer
  openDeleteModal(productId: number) {
    this.productToDelete = productId;
    const deleteModal: any = document.getElementById('deleteConfirmationModal');
    deleteModal?.showModal();
  }

  // Gérer la suppression confirmée
  onConfirmDelete(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.fetchProducts();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la commande :', error);
      },
    });
  }

  // Gérer l'annulation de la suppression
  onCancelDelete() {}

  isLiquidProduct(product: Product): product is LiquidProduct {
    return (product as LiquidProduct).densityKgPerLiter !== undefined;
  }

  isSolidProduct(product: Product): product is SolidProduct {
    return (product as SolidProduct).lengthCm !== undefined;
  }
}
