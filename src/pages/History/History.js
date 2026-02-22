import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearAllHistory } from "../../services/firestore";
import { fetchHistory } from "../../state/slices/historySlice";
import HistoryCard from "../../components/Card/HistoryCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import { Clock, Inbox, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";

const History = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items: history, loading } = useSelector((state) => state.history);
  const [search, setSearch] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const filtered = search
    ? history.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase())
      )
    : history;

  async function handleClearAll() {
    if (!user) return;
    setClearing(true);
    try {
      await clearAllHistory(user.uid);
      dispatch(fetchHistory(user.uid));
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history.");
    } finally {
      setClearing(false);
      setClearOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Watch History</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => setClearOpen(true)}
            >
              <Trash2 className="mr-1 h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-16 w-16 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">
            {search ? "No matching history" : "No history yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different search term."
              : "Videos you watch will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <HistoryCard key={item.id} {...item} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear all history?"
        description="This will permanently remove all items from your watch history. This cannot be undone."
        confirmLabel="Clear All"
        loading={clearing}
        onConfirm={handleClearAll}
        variant="destructive"
      />
    </div>
  );
};

export default History;
