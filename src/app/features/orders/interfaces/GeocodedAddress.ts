export interface GeocodedAddress {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
    streetName: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    department: string;
    country: string;
    latitude: string;
    longitude: string;
    streetNumber: string;
    isVerified: boolean;
    source: string;
}
