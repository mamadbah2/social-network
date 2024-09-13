"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/models/item.model";
import { User } from "@/models/user.model";
import React, { useEffect } from "react";
import useGetData from "../../lib/hooks/useGet";
import { mapGroup, mapSimpleUser } from "../../lib/modelmapper";
import { paginateTable } from "../../lib/utils";
import { Group } from "../../models/group.model";
import { ListBar } from "./listbar";

// Voir si possible accordeon de maintenir...
let prevUser = 0,
  prevGroup = 0,
  prevJoin = 0,
  prevCreated = 0;
let suivUser = 4,
  suivGroup = 4,
  suivJoin = 4,
  suivCreated = 4;
let step = 4;

export default function SideBarList() {
  const [userID, setUserID] = React.useState<string>("0");
  useEffect(() => {
    setUserID(localStorage.getItem("userID") || "0");
  }, []);

  const {
    expect: user,
    error: errUser,
    refetch: mutate,
  } = useGetData<User>(`/users?id=${userID}`, mapSimpleUser);
  const { expect: groups, error: errGroups } = useGetData<Group[]>(
    "/groups",
    mapGroup
  );
  useEffect(() => {
    console.log("user :>> ", user);
  }, [user]);

  const [ItemUser, setItemUser] = React.useState<Item[]>([]);
  const [ItemGroup, setItemGroup] = React.useState<Item[]>([]);
  const [ItemJoinedGroup, setItemJoinedGroup] = React.useState<Item[]>([]);
  const [ItemCreatedGroup, setItemCreatedGroup] = React.useState<Item[]>([]);

  const handlePaginate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "friendBtn":
        const suggestedFriends = user?.suggestedFriends || [];
        setItemUser(paginateTable(suggestedFriends, prevUser, suivUser));
        if (suivUser <= suggestedFriends.length) {
          prevUser = prevUser + step;
          suivUser = suivUser + step;
        } else {
          suivUser = 4;
          prevUser = 0;
        }
        break;
      case "groupBtn":
        setItemGroup(paginateTable(groups ?? [], prevGroup, suivGroup));
        if (suivGroup <= (groups?.length ?? 0)) {
          prevGroup = prevGroup + step;
          suivGroup = suivGroup + step;
        } else {
          suivGroup = 4;
          prevGroup = 0;
        }
        break;
      case "joinedGroupBtn":
        const joinedGroup = user?.groups || [];
        setItemJoinedGroup(paginateTable(joinedGroup, prevJoin, suivJoin));
        if (suivJoin <= joinedGroup.length) {
          prevJoin = prevJoin + step;
          suivJoin = suivJoin + step;
        } else {
          suivJoin = 4;
          prevJoin = 0;
        }
        break;
      case "createdGroupBtn":
        const createdGroup = user?.createdGroups || [];
        setItemCreatedGroup(
          paginateTable(createdGroup, prevCreated, suivCreated)
        );
        if (suivCreated <= createdGroup.length) {
          prevCreated = prevCreated + step;
          suivCreated = suivCreated + step;
        } else {
          suivCreated = 4;
          prevCreated = 0;
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden p-4 h-[850px] w-fit">
      <aside className="w-64">
        <ScrollArea className="h-full">
          <Accordion type="multiple" className="w-full">
            <AccordionItem
              onClick={() => {
                setItemUser(
                  paginateTable(
                    user?.suggestedFriends || [],
                    prevUser,
                    suivUser
                  )
                );
              }}
              value="suggested-friends"
            >
              <AccordionTrigger className="px-4">
                Suggested Friends
              </AccordionTrigger>
              <AccordionContent>
                <ListBar
                  items={ItemUser}
                  showAddButton
                  section="friend"
                  mutation={() => mutate().then(() => true)}
                />
                {(user?.suggestedFriends?.length || 0) > step && (
                  <Button
                    onClick={handlePaginate}
                    id="friendBtn"
                    className="w-full mt-2"
                    variant="secondary"
                  >
                    View Other
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="suggested-groups">
              <AccordionTrigger
                onClick={() =>
                  setItemGroup(
                    paginateTable(groups || [], prevGroup, suivGroup)
                  )
                }
                className="px-4"
              >
                Social groups
              </AccordionTrigger>
              <AccordionContent>
                <ListBar
                  items={ItemGroup}
                  showAddButton={false}
                  section="group"
                />
                {(groups?.length || 0) > step && (
                  <Button
                    onClick={handlePaginate}
                    id="groupBtn"
                    className="w-full mt-2"
                    variant="secondary"
                  >
                    View Other
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="joined-groups">
              <AccordionTrigger
                onClick={() =>
                  setItemJoinedGroup(
                    paginateTable(user?.groups || [], prevJoin, suivJoin)
                  )
                }
                className="px-4"
              >
                Joined groups
              </AccordionTrigger>
              <AccordionContent>
                <ListBar items={ItemJoinedGroup} />
                {(user?.groups?.length || 0) > step && (
                  <Button
                    onClick={handlePaginate}
                    id="joinedGroupBtn"
                    className="w-full mt-2"
                    variant="secondary"
                  >
                    View Other
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="created-groups">
              <AccordionTrigger
                onClick={() =>
                  setItemCreatedGroup(
                    paginateTable(
                      user?.createdGroups || [],
                      prevCreated,
                      suivCreated
                    )
                  )
                }
                className="px-4"
              >
                Created groups
              </AccordionTrigger>
              <AccordionContent>
                <ListBar items={ItemCreatedGroup} />
                {(user?.createdGroups?.length || 0) > step && (
                  <Button
                    onClick={handlePaginate}
                    id="createdGroupBtn"
                    className="w-full mt-2"
                    variant="secondary"
                  >
                    View Other
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </aside>
    </div>
  );
}
