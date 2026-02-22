import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCard, deleteCard } from "../../services/firestore";
import { fetchCards } from "../../state/slices/cardsSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { toast } from "sonner";

const MoveCard = ({ open, onClose, bucketlist, card }) => {
  const [dest, setDest] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const destinations = bucketlist.filter((b) => b.id !== card.bucketId);

  async function handleMove(e) {
    e.preventDefault();
    if (!dest) return;

    try {
      await createCard(user.uid, dest, {
        id: card.id,
        name: card.name,
        link: card.link,
      });
      await deleteCard(user.uid, card.bucketId, card.id);
      dispatch(fetchCards({ userId: user.uid, bucketId: card.bucketId }));
      dispatch(fetchCards({ userId: user.uid, bucketId: dest }));
      const destName = bucketlist.find((b) => b.id === dest)?.name;
      toast.success(`Moved "${card.name}" to ${destName}`);
      onClose();
    } catch {
      toast.error("Failed to move video.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleMove} className="space-y-4">
          <div className="space-y-2">
            <Label>Destination Collection</Label>
            <Select value={dest} onValueChange={setDest}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a collection" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!dest}>
              Move
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MoveCard;
