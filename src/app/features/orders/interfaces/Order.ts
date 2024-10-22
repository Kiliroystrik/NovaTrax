import { Delivery } from '../../delivery/interfaces/Delivery';
import { Client } from '../../client/components/interfaces/Client';
import { Status } from '../../status/interfaces/status';

export interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  updatedAt?: string | null;
  orderDate: string;
  expectedDeliveryDate: string;
  status: Status;
  deliveries: Delivery[];
  client: Client;
}
