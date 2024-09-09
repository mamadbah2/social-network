import { User } from "./user.model";

export interface Notification {
    id?: number,
    content: string,
    approuved: boolean,
    createdAt?: Date,
    entityType: string,
    entityId: number,
    sender?: Partial<User>,
    receiver?: Partial<User>,
}