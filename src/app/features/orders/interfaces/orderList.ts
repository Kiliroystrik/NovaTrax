export interface Order {
    id: number | null; // Identifiant unique
    orderNumber: string | null; // N° de commande
    createdAt: string | null; // Date de création (string au format ISO 8601)
    updatedAt: string | null; // Date de mise à jour (nullable)
    customerName: string | null; // Nom du client
    orderDate: string | null; // Date de la commande (string au format ISO 8601)
    expectedDeliveryDate: string | null; // Date de livraison prévue (string au format ISO 8601)
    status: string | null; // Statut de la commande
}