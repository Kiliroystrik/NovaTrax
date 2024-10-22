import { ProductDelivery } from '../../orders/interfaces/ProductDelivery';
import { GeocodedAddress } from '../../orders/interfaces/GeocodedAddress';
import { Status } from '../../status/interfaces/status';
import { Tour } from '../../tour/interfaces/tour';
import { Order } from '../../orders/interfaces/Order';

export interface Delivery {
  id: number;
  createdAt: string;
  updatedAt?: string | null;
  status: Status;
  expectedDeliveryDate: Date;
  actualDeliveryDate: Date | null;
  productDeliveries: ProductDelivery[];
  geocodedAddress: GeocodedAddress;
  tour: Tour;
  order: Order;
}
