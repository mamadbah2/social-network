import { Group } from "@/models/group.model"
import { Item } from "@/models/item.model"
import { User } from "@/models/user.model"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function paginateTable<T>(table: T[], prev:number, suiv :number): Item[] {
 
    let current: Array<T> = table.slice(prev, suiv)
    const paginated : Array<Item> = current.map((c:T): Item => {
        return {
          name: (c as User).firstname || (c as Group).name ,
          image: "",
        }
      })
    
  return paginated
}