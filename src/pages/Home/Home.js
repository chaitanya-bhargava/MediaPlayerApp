import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createBucket } from "../../services/firestore";
import { fetchBuckets } from "../../state/slices/bucketsSlice";
import { NavLink } from "react-router-dom";
import BucketList from "../../components/BucketList/BucketList";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { LogIn, Search, Play, X, Clock, FolderPlus } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const { items: buckets, loading } = useSelector((state) => state.buckets);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  async function handleCreateBucket(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const id = String(Date.now());
      await createBucket(user.uid, { id, name: trimmed });
      dispatch(fetchBuckets(user.uid));
      setNewName("");
      setCreateOpen(false);
      toast.success(`"${trimmed}" created!`);
    } catch {
      toast.error("Failed to create collection.");
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
        <img src="/play.png" alt="MediaPlayer" className="mb-6 h-24 w-24 drop-shadow-lg" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to{" "}
          <span className="gradient-text">MediaPlayer</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Organize your favorite YouTube videos into collections, play them
          in-app, and keep track of your watch history.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <NavLink to="/auth">
              <LogIn className="mr-2 h-5 w-5" /> Get Started
            </NavLink>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Play In-App</p>
          </div>
          <div>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Search & Filter</p>
          </div>
          <div>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Watch History</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">My Collections</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <FolderPlus className="mr-1 h-4 w-4" /> New
          </Button>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
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
      </div>
      <BucketList list={buckets} search={search} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBucket} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-bucket">Collection Name</Label>
              <Input
                id="new-bucket"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Music Videos"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
