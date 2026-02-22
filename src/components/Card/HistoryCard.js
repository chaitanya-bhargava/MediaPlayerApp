import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteHistory } from "../../services/firestore";
import { fetchHistory } from "../../state/slices/historySlice";
import { getYoutubeThumbnail } from "../../utils/youtube";
import { Button } from "../ui/button";
import { Trash2, ExternalLink, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

const HistoryCard = ({ id, name, link, time }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const thumbnail = getYoutubeThumbnail(link);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteHistory(user.uid, id);
      dispatch(fetchHistory(user.uid));
      toast.success("Removed from history");
    } catch {
      toast.error("Failed to remove from history.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      {thumbnail && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{name}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {time}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> YouTube
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Remove from history"
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
