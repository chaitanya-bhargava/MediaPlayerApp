import { useState, useEffect } from "react";
import Card from "../Card/Card";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

const CardGrid = ({ cards, bucketId, bucketlist }) => {
  const [orderedCards, setOrderedCards] = useState(cards);

  useEffect(() => {
    setOrderedCards(cards);
  }, [cards]);

  return (
    <SortableContext
      items={orderedCards.map((c) => c.id)}
      strategy={rectSortingStrategy}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orderedCards.map((item) => (
          <Card
            key={item.id}
            bucketlist={bucketlist}
            bucketId={bucketId}
            {...item}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default CardGrid;
