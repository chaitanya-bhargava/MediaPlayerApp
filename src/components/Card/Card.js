import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteCard, addHistory } from "../../services/firestore";
import { fetchCards } from "../../state/slices/cardsSlice";
import { fetchHistory } from "../../state/slices/historySlice";
import { parseYoutubeId, getYoutubeThumbnail } from "../../utils/youtube";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import EditCard from "./EditCard";
import MoveCard from "./MoveCard";
import ConfirmDialog from "../ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Play,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowRightLeft,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

const Card = ({ id, name, link, bucketId, bucketlist }) => {
  const [playerOpen, setPlayerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const videoId = parseYoutubeId(link);
  const thumbnail = getYoutubeThumbnail(link);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handlePlay() {
    setPlayerOpen(true);
    addHistory(user.uid, {
      name,
      link,
      time: new Date().toLocaleString(),
    })
      .then(() => dispatch(fetchHistory(user.uid)))
      .catch(() => {});
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCard(user.uid, bucketId, id);
      dispatch(fetchCards({ userId: user.uid, bucketId }));
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error("Failed to delete video.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
      >
        <button
          {...attributes}
          {...listeners}
          className="absolute left-2 top-2 z-10 cursor-grab rounded p-1 opacity-0 transition-opacity group-hover:opacity-70 hover:!opacity-100 bg-black/30 text-white"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div
          className="relative aspect-video cursor-pointer overflow-hidden bg-muted"
          onClick={handlePlay}
          role="button"
          aria-label={`Play ${name}`}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <Play className="h-10 w-10 text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{name}</h3>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> Open in YouTube
            </a>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Card actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePlay}>
                <Play className="mr-2 h-4 w-4" /> Play
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMoveOpen(true)}>
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {playerOpen && (
        <MediaPlayer
          videoId={videoId}
          title={name}
          link={link}
          onClose={() => setPlayerOpen(false)}
        />
      )}
      {editOpen && (
        <EditCard
          open={editOpen}
          onClose={() => setEditOpen(false)}
          bucketId={bucketId}
          cardId={id}
          currentName={name}
          currentLink={link}
        />
      )}
      {moveOpen && (
        <MoveCard
          open={moveOpen}
          onClose={() => setMoveOpen(false)}
          bucketlist={bucketlist}
          card={{ id, name, link, bucketId }}
        />
      )}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${name}"?`}
        description="This video will be permanently removed from this collection."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Card;
