import { Product } from "./product";

export interface ProductDelivery {
    id: number;
    product: Product;
    quantity: string;
}
