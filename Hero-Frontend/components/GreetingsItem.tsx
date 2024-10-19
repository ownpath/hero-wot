import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Calendar, User } from 'lucide-react';

export interface Greeting {
  id: number;
  title: string;
  body: string;
  created_at: string;
  author: { name: string };
  media: { url: string; type: string }[];
}

interface GreetingItemProps {
  card: Greeting;
  onPress: (card: Greeting) => void;
}

const GreetingItem: React.FC<GreetingItemProps> = ({ card, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  return (
    <motion.div layoutId={`card-${card.id}`}>
      <Card 
        isPressable
        onPress={() => onPress(card)}
        className="mb-4 w-full"
      >
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h4 className="font-bold text-large">{card.title}</h4>
        </CardHeader>
        <CardBody className="py-2 px-4">
          <p className="whitespace-pre-line">{card.body}</p>
          {card.media.length > 0 && (
            <Image
              alt="Greeting image"
              className="object-cover rounded-xl mt-4"
              src={card.media[0].url}
              width="100%"
              height={140}
            />
          )}
        </CardBody>
        <CardFooter className="text-small text-default-500 flex justify-between px-4 py-4">
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            <span>{card.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{formatDate(card.created_at)}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GreetingItem;