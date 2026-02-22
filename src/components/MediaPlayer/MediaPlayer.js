import { useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { X, ExternalLink } from "lucide-react";

const MediaPlayer = ({ videoId, title, link, onClose }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Player container */}
      <div className="relative z-10 w-full max-w-5xl px-4 animate-slide-down">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="truncate text-lg font-semibold text-white">
              {title}
            </h2>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> YouTube
              </a>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
            aria-label="Close player"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 16:9 responsive iframe */}
        <div className="relative overflow-hidden rounded-xl bg-black shadow-2xl"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <p className="mt-2 text-center text-xs text-white/40">
          Press <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-white/60">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default MediaPlayer;
