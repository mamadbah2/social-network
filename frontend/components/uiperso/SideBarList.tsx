import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";

export default function SideBarList() {
  return (
    <div className="flex flex-1 overflow-hidden border rounded-lg h-full">
      <aside className="w-64">
        <ScrollArea className="h-full">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="suggested-friends">
              <AccordionTrigger className="px-4">
                Suggested Friends
              </AccordionTrigger>
              <AccordionContent>
                <SidebarList
                  items={[
                    {
                      name: "Call of duty",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                    {
                      name: "bahahah",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                    {
                      name: "bahahah",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                  ]}
                  showAddButton
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="suggested-groups">
              <AccordionTrigger className="px-4">
                Suggested groups
              </AccordionTrigger>
              <AccordionContent>
                <SidebarList
                  items={[
                    {
                      name: "Call of duty",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                    {
                      name: "bahahah",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                    {
                      name: "bahahah",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                    {
                      name: "bahahah",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                  ]}
                  showAddButton
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="joined-groups">
              <AccordionTrigger className="px-4">
                Joined groups
              </AccordionTrigger>
              <AccordionContent>
                <SidebarList
                  items={[
                    {
                      name: "Call of duty",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                    {
                      name: "bahahah",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="created-groups">
              <AccordionTrigger className="px-4">
                Created groups
              </AccordionTrigger>
              <AccordionContent>
                <SidebarList
                  items={[
                    {
                      name: "Call of duty",
                      image: "/placeholder.svg?height=40&width=40",
                    },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </aside>
    </div>
  );
}

interface Item {
  name: string;
  image: string;
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
              <AvatarFallback>{item.name[0]}</AvatarFallback>
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
    </ul>
  );
}
