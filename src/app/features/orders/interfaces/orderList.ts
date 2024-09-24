export interface Order {
    id: number | null; // Identifiant unique
    orderNumber: string | null; // N° de commande
    createdAt: string | null; // Date de création (string au format ISO 8601)
    updatedAt: string | null; // Date de mise à jour (nullable)
    client: Client; // Nom du client
    orderDate: string | null; // Date de la commande (string au format ISO 8601)
    expectedDeliveryDate: string | null; // Date de livraison prévue (string au format ISO 8601)
    status: string | null; // Statut de la commande
}

export interface Client {
    id: number | null; // Identifiant unique
    name: string | null; // Nom du client
}