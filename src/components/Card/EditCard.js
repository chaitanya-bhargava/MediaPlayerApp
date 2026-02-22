import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCard } from "../../services/firestore";
import { fetchCards } from "../../state/slices/cardsSlice";
import { isValidYoutubeUrl } from "../../utils/youtube";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const EditCard = ({ open, onClose, bucketId, cardId, currentName, currentLink }) => {
  const nameRef = useRef();
  const linkRef = useRef();
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  async function handleSave(e) {
    e.preventDefault();
    const newName = nameRef.current.value.trim();
    const newLink = linkRef.current.value.trim();

    if (!newName || !newLink) {
      setError("Both fields are required.");
      return;
    }
    if (!isValidYoutubeUrl(newLink)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    try {
      await updateCard(user.uid, bucketId, cardId, {
        name: newName,
        link: newLink,
      });
      dispatch(fetchCards({ userId: user.uid, bucketId }));
      toast.success("Video updated!");
      onClose();
    } catch {
      toast.error("Failed to update video.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              ref={nameRef}
              defaultValue={currentName}
              key={`name-${open}`}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-link">YouTube URL</Label>
            <Input
              id="edit-link"
              ref={linkRef}
              defaultValue={currentLink}
              key={`link-${open}`}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCard;
