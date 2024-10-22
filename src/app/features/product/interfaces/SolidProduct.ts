import { Product } from './product';

export interface SolidProduct extends Product {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  type: 'solid'; // Le type est toujours "solid" pour les produits solides
}
