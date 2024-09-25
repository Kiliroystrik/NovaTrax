import { ProductDelivery } from "./ProductDelivery";
import { GeocodedAddress } from "./GeocodedAddress";

export interface Delivery {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
    status: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string;
    productDeliveries: ProductDelivery[];
    geocodedAddress: GeocodedAddress;
}
