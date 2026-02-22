import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCard } from "../../services/firestore";
import { fetchCards } from "../../state/slices/cardsSlice";
import { isValidYoutubeUrl } from "../../utils/youtube";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";

const AddCard = ({ id, onDone }) => {
  const nameRef = useRef();
  const linkRef = useRef();
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    const enteredName = nameRef.current.value.trim();
    const enteredLink = linkRef.current.value.trim();

    if (!enteredName || !enteredLink) {
      setError("Name and link are required.");
      return;
    }
    if (!isValidYoutubeUrl(enteredLink)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    const newCard = {
      id: String(Date.now()),
      name: enteredName,
      link: enteredLink,
    };

    try {
      await createCard(user.uid, id, newCard);
      dispatch(fetchCards({ userId: user.uid, bucketId: id }));
      nameRef.current.value = "";
      linkRef.current.value = "";
      setError("");
      toast.success(`"${enteredName}" added!`);
      if (onDone) onDone();
    } catch {
      toast.error("Failed to add video.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-dashed bg-muted/30 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-1">
          <Label htmlFor={`name-${id}`} className="text-xs">
            Video Name
          </Label>
          <Input
            id={`name-${id}`}
            ref={nameRef}
            placeholder="My awesome video"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`link-${id}`} className="text-xs">
            YouTube URL
          </Label>
          <Input
            id={`link-${id}`}
            ref={linkRef}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
          {onDone && (
            <Button type="button" variant="ghost" size="sm" onClick={onDone}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default AddCard;
