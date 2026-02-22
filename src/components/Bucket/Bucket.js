import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDroppable } from "@dnd-kit/core";
import { fetchCards } from "../../state/slices/cardsSlice";
import { clearBucket as clearBucketDb } from "../../services/firestore";
import CardGrid from "../CardGrid/CardGrid";
import AddCard from "../Card/AddCard";
import EditBucket from "./EditBucket";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  MoreVertical,
  Inbox,
} from "lucide-react";
import ConfirmDialog from "../ui/confirm-dialog";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

const Bucket = ({ id, name, bucketlist, search }) => {
  const user = useSelector((state) => state.auth.user);
  const allCards = useSelector((state) => state.cards.byBucket);
  const cardLoading = useSelector((state) => state.cards.loading[id]);
  const cards = allCards[id] || [];
  const dispatch = useDispatch();

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [manualCollapsed, setManualCollapsed] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: `bucket-${id}` });

  useEffect(() => {
    if (user) {
      dispatch(fetchCards({ userId: user.uid, bucketId: id }));
    }
  }, [user, id, dispatch]);

  const filteredCards = search
    ? cards.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : cards;

  const collapsed = search ? false : manualCollapsed;
  const hideBucket = search && filteredCards.length === 0;

  async function handleClear() {
    if (!cards.length) return;
    setClearing(true);
    try {
      await clearBucketDb(user.uid, id, cards);
      dispatch(fetchCards({ userId: user.uid, bucketId: id }));
      toast.success(`Cleared all videos from "${name}"`);
    } catch {
      toast.error("Failed to clear bucket.");
    } finally {
      setClearing(false);
      setClearOpen(false);
    }
  }

  if (hideBucket) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "overflow-hidden rounded-xl border border-l-4 border-l-primary/60 card-gradient shadow-sm transition-all",
        isOver
          ? "ring-2 ring-primary border-l-primary shadow-lg scale-[1.01]"
          : "hover:shadow-md"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <button
          onClick={() => setManualCollapsed((c) => !c)}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:text-primary transition-colors"
        >
          {collapsed ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
          {name}
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
            {cards.length}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddOpen((o) => !o)}
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setClearOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Drop hint */}
      {isOver && (
        <div className="bg-primary/10 px-5 py-2 text-center text-sm font-medium text-primary animate-fade-in">
          Drop here to move to "{name}"
        </div>
      )}

      {/* Body */}
      {!collapsed && (
        <div className="p-5">
          {addOpen && (
            <div className="mb-5">
              <AddCard id={id} onDone={() => setAddOpen(false)} />
            </div>
          )}

          {cardLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                {search
                  ? "No matching videos found."
                  : "No videos yet. Click Add to get started!"}
              </p>
            </div>
          ) : (
            <CardGrid cards={filteredCards} bucketId={id} bucketlist={bucketlist} />
          )}
        </div>
      )}

      {editOpen && (
        <EditBucket
          open={editOpen}
          onClose={() => setEditOpen(false)}
          bucketId={id}
          currentName={name}
        />
      )}
      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title={`Clear "${name}"?`}
        description={`This will permanently delete all ${cards.length} video(s) from this collection.`}
        confirmLabel="Clear All"
        loading={clearing}
        onConfirm={handleClear}
      />
    </div>
  );
};

export default Bucket;
