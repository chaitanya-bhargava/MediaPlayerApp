import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createCard, deleteCard } from "../../services/firestore";
import { fetchCards } from "../../state/slices/cardsSlice";
import { getYoutubeThumbnail } from "../../utils/youtube";
import Bucket from "../Bucket/Bucket";
import { toast } from "sonner";

const BucketList = ({ list, search }) => {
  const [activeCard, setActiveCard] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const allCards = useSelector((state) => state.cards.byBucket);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findCardBucket(cardId) {
    for (const bucketId of Object.keys(allCards)) {
      if (allCards[bucketId]?.some((c) => c.id === cardId)) {
        return bucketId;
      }
    }
    return null;
  }

  function handleDragStart(event) {
    const cardId = event.active.id;
    const bucketId = findCardBucket(cardId);
    if (bucketId) {
      const card = allCards[bucketId].find((c) => c.id === cardId);
      setActiveCard({ ...card, bucketId });
    }
  }

  async function handleDragEnd(event) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || !user) return;

    const sourceBucketId = findCardBucket(active.id);
    if (!sourceBucketId) return;

    const overId = String(over.id);
    let destBucketId = null;

    if (overId.startsWith("bucket-")) {
      destBucketId = overId.replace("bucket-", "");
    } else {
      destBucketId = findCardBucket(overId);
    }

    if (!destBucketId || sourceBucketId === destBucketId) return;

    const card = allCards[sourceBucketId].find((c) => c.id === active.id);
    if (!card) return;

    try {
      await createCard(user.uid, destBucketId, {
        id: card.id,
        name: card.name,
        link: card.link,
      });
      await deleteCard(user.uid, sourceBucketId, card.id);
      dispatch(fetchCards({ userId: user.uid, bucketId: sourceBucketId }));
      dispatch(fetchCards({ userId: user.uid, bucketId: destBucketId }));
      const destName = list.find((b) => b.id === destBucketId)?.name;
      toast.success(`Moved "${card.name}" to ${destName}`);
    } catch {
      toast.error("Failed to move video.");
    }
  }

  function handleDragCancel() {
    setActiveCard(null);
  }

  const thumbnail = activeCard ? getYoutubeThumbnail(activeCard.link) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-6">
        {list.map((item) => (
          <Bucket
            key={item.id}
            bucketlist={list}
            name={item.name}
            id={item.id}
            search={search}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="w-64 rounded-lg border bg-card shadow-xl opacity-90 rotate-2 scale-105">
            {thumbnail && (
              <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={thumbnail}
                  alt={activeCard.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-3">
              <h3 className="truncate text-sm font-medium">
                {activeCard.name}
              </h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BucketList;
