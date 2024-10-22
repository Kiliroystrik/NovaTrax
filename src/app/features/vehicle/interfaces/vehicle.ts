export interface Vehicle {
  id: number;
  createdAt: Date;
  updatedAt: Date | null;
  licensePlate: string;
  type: string;
  weight: string;
  volume: string;
}
