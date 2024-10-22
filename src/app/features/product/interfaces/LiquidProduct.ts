import { Product } from './product';

export interface LiquidProduct extends Product {
  densityKgPerLiter: number;
  isTemperatureSensitive: boolean;
  thermalExpansionCoefficientPerDegreeCelsius: number;
  type: 'liquid'; // Le type est toujours "liquid" pour les produits liquides
}
