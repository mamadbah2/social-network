import { User } from "./user.model";

export interface Msg {
    id: number
    content: string
    type: string
    sentAt?: string
    sender?: Partial<User>
    receiver?: Partial<User>
}

export type Contact = {
    id: number
    name: string
    avatar: string
  }