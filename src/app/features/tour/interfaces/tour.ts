import { Driver } from '../../driver/interfaces/driver';
import { Vehicle } from '../../vehicle/interfaces/vehicle';
import { Delivery } from '../../delivery/interfaces/Delivery';
import { Warehouse } from '../../warehouse/interfaces/warehouse';
import { Status } from '../../status/interfaces/status';

export interface Tour {
  id: number;
  tourNumber: string;
  createdAt: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  status: Status;
  driver?: Driver;
  vehicle?: Vehicle;
  deliveries: Delivery[];
  loading?: Warehouse;
}
