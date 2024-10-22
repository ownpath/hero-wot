import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Calendar, User } from "lucide-react";

export interface Greeting {
  id: number;
  title: string;
  body: string;
  created_at: string;
  author: { name: string };
}

interface GreetingItemProps {
  card: Greeting;
}

const GreetingItem: React.FC<GreetingItemProps> = ({ card }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  return (
    <Card className="bg-zinc-800 w-full">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <h4 className="font-bold text-lg text-white">{card.title}</h4>
      </CardHeader>
      <CardBody className="py-2">
        <p className="text-sm text-gray-300">{card.body}</p>
      </CardBody>
      <CardFooter className="text-xs justify-between bg-zinc-800 border-t border-zinc-700">
        <div className="flex items-center">
          <User size={16} className="text-gray-400 mr-1" />
          <span className="text-gray-400">{card.author.name}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-400 mr-1" />
          <span className="text-gray-400">{formatDate(card.created_at)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GreetingItem;
