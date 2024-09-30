export interface Driver {
    id: number;
    createdAt: Date;
    updatedAt: Date | null;
    firstName: string;
    lastName: string;
    licenseNumber: string;
}