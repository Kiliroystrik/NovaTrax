import { GeocodedAddress } from '../../orders/interfaces/GeocodedAddress';
import { Tour } from '../../tour/interfaces/tour';

export interface Warehouse {
  id?: number;
  name: string;
  address: GeocodedAddress;
  //   company: Company;
  tours?: Tour[];
}
