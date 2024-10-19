import React, { useState } from 'react';
import GreetingItem, { Greeting } from './GreetingsItem';
import ModalCard from './ModalCard';

interface GreetingsListProps {
  greetings: Greeting[];
}

const GreetingsList: React.FC<GreetingsListProps> = ({ greetings }) => {
  const [selectedCard, setSelectedCard] = useState<Greeting | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCardPress = (card: Greeting) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {greetings.map((greeting) => (
            <div key={greeting.id} className="break-inside-avoid w-full inline-block">
              <GreetingItem 
                card={greeting} 
                onPress={handleCardPress}
              />
            </div>
          ))}
        </div>
      </div>
      <ModalCard 
        card={selectedCard} 
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};

export default GreetingsList;