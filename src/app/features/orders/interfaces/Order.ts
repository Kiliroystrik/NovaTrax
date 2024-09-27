import { Delivery } from "./Delivery";
import { Client } from '../../client/components/interfaces/Client';

export interface Order {
    id: number;
    orderNumber: string;
    createdAt: string;
    updatedAt?: string | null;
    orderDate: string;
    expectedDeliveryDate: string;
    status: string;
    deliveries: Delivery[];
    client: Client;
}
