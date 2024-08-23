'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetData from "@/lib/hooks/useget";
import { mapGroup, mapSimpleUser, mapUser } from "@/lib/modelmapper";
import { paginateTable } from "@/lib/utils";
import { Group } from "@/models/group.model";
import { Item } from "@/models/item.model";
import { User } from "@/models/user.model";
import { PlusIcon } from "lucide-react";
import React from "react";

// Voir si possible accordeon de maintenir...
let prevUser = 0, prevGroup = 0, prevJoin = 0
let suivUser = 4, suivGroup = 4, suivJoin = 0
let step = 4

export default function SideBarList() {
    const { expect: users, error: errUsers } = useGetData<User[]>('/users', mapUser)
    const { expect: user, error: errUser } = useGetData<User>(`/users?id=${localStorage.getItem('userID')}`, mapSimpleUser)
    const { expect: groups, error: errGroups } = useGetData<Group[]>('/groups', mapGroup)

    const [ItemUser, setItemUser] = React.useState<Item[]>([])
    const [ItemGroup, setItemGroup] = React.useState<Item[]>([])
    const [ItemJoinedGroup, setItemJoinedGroup] = React.useState<Item[]>([])

    const handlePaginate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log(e.currentTarget.id)
        switch (e.currentTarget.id) {
            case "friendBtn":
                // La logique à optimiser
                setItemUser(paginateTable(users, prevUser, suivUser))
                if (suivUser <= users.length) {
                    prevUser = prevUser + step; suivUser = suivUser + step
                } else {
                    suivUser = 4; prevUser = 0;
                }
                break;
            case "groupBtn":
                setItemGroup(paginateTable(groups, prevGroup, suivGroup))
                if (suivGroup <= groups.length) {
                    prevGroup = prevGroup + step; suivGroup = suivGroup + step
                } else {
                    suivGroup = 4; prevGroup = 0;
                }
                break;
            case "joinedGroupBtn":
                const joinedGroup = user.groups || []
                setItemJoinedGroup(paginateTable(joinedGroup, prevJoin, suivJoin))
                if (suivJoin <= joinedGroup.length) {
                    prevJoin = prevJoin + step; suivJoin = suivJoin + step
                } else {
                    suivJoin = 4; prevJoin = 0;
                }
                break;
            default:
                break;
        }

    }


    return (
        <div className="flex flex-1 overflow-hidden border border-black rounded-lg h-full w-fit">
            <aside className="w-64 ">
                <ScrollArea >
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="suggested-friends">
                            <AccordionTrigger className="px-4">
                                Suggested Friends
                            </AccordionTrigger>
                            <AccordionContent>
                                <SidebarList
                                    items={ItemUser}
                                    showAddButton
                                />
                                <Button onClick={handlePaginate} id="friendBtn" className="w-full mt-2" variant="secondary">View Other</Button>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="suggested-groups">
                            <AccordionTrigger className="px-4">
                                Suggested groups
                            </AccordionTrigger>
                            <AccordionContent>
                                <SidebarList
                                    items={ItemGroup}
                                    showAddButton
                                />
                                <Button onClick={handlePaginate} id="groupBtn" className="w-full mt-2" variant="secondary">View Other</Button>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="joined-groups">
                            <AccordionTrigger className="px-4">
                                Joined groups
                            </AccordionTrigger>
                            <AccordionContent>
                                <SidebarList
                                    items={ItemJoinedGroup}
                                />
                                <Button onClick={handlePaginate} id="joinedGroupBtn" className="w-full mt-2" variant="secondary">View Other</Button>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="created-groups">
                            <AccordionTrigger className="px-4">
                                Created groups
                            </AccordionTrigger>
                            <AccordionContent>
                                <SidebarList
                                    items={ItemJoinedGroup}
                                />
                                <Button className="w-full mt-2" variant="secondary">View Other</Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </ScrollArea>
            </aside>
        </div>
    );
}



function SidebarList({
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
