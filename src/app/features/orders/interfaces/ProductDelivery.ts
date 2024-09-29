import { Product } from "../../product/interfaces/product";

export interface ProductDelivery {
    id: number;
    product: Product;
    quantity: string;
}
