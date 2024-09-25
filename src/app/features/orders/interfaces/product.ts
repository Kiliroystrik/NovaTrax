import { UnitOfMeasure } from "./UnitOfMeasure";

export interface Product {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
    name: string;
    description: string;
    unitOfMeasure: UnitOfMeasure;
}
