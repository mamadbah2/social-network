import { Item } from "@/models/item.model";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

export function ListBar({
    items,
    showAddButton = false,
}: {
    items: Item[];
    showAddButton?: boolean;
}) {
    return (
        <ul className="space-y-2 px-4">
            {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={item.image} alt={item.name} />
                            <AvatarFallback>{item.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.name}</span>
                    </div>
                    {showAddButton && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    )}
                </li>
            ))}
            {/* Ajouter un bouton là pour paginer */}
        </ul>
    );
}