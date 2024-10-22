export interface Product {
  id: number;
  name: string;
  description: string;
  weightKg: number;
  isHazardous: boolean;
  hazardClass?: string;
  adrCompliant: boolean;
  // Ajout du champ discriminant
  type: 'liquid' | 'solid';
}
