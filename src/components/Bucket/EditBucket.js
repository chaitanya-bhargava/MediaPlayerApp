import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { renameBucket } from "../../services/firestore";
import { fetchBuckets } from "../../state/slices/bucketsSlice";
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

const EditBucket = ({ open, onClose, bucketId, currentName }) => {
  const nameRef = useRef();
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  async function handleSave(e) {
    e.preventDefault();
    const newName = nameRef.current.value.trim();
    if (!newName) {
      setError("Please enter a name.");
      return;
    }
    try {
      await renameBucket(user.uid, bucketId, newName);
      dispatch(fetchBuckets(user.uid));
      toast.success(`Collection renamed to "${newName}"`);
      onClose();
    } catch {
      toast.error("Failed to rename collection.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bucket-name">New Name</Label>
            <Input
              id="bucket-name"
              ref={nameRef}
              defaultValue={currentName}
              key={`bucket-${open}`}
              placeholder="Enter collection name"
              autoFocus
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBucket;
