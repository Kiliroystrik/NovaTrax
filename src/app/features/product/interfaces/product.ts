import { UnitOfMeasure } from "../../unit-of-measure/interfaces/unit-of-measure";

export interface Product {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
    name: string;
    description: string;
    unitOfMeasure: UnitOfMeasure;
}
