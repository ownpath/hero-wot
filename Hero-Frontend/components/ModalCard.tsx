import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image } from "@nextui-org/react";
import { Calendar, User } from 'lucide-react';
import { Greeting } from './GreetingsItem';

interface ModalCardProps {
  card: Greeting | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalCard: React.FC<ModalCardProps> = ({ card, isOpen, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  if (!card) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      scrollBehavior="inside"
      size="2xl"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{card.title}</ModalHeader>
            <ModalBody>
              <p className="whitespace-pre-line">{card.body}</p>
              {card.media.length > 0 && (
                <Image
                  alt="Greeting image"
                  className="object-cover rounded-xl mt-4"
                  src={card.media[0].url}
                  width="100%"
                  height={200}
                />
              )}
            </ModalBody>
            <ModalFooter className="text-small text-default-500 flex justify-between">
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{card.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(card.created_at)}</span>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCard;