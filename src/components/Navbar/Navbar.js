import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useTheme } from "../ThemeProvider";
import { Button } from "../ui/button";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Clock,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn } from "../../lib/utils";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  async function handleLogout() {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground/70 hover:text-foreground hover:bg-accent"
    );

  return (
    <nav className="sticky top-0 z-40 border-b border-b-primary/20 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <NavLink to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <img src="/play.png" alt="MediaPlayer" className="h-9 w-9" />
            <span className="hidden font-semibold text-lg sm:inline-block">
              MediaPlayer
            </span>
          </NavLink>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {user && (
            <>
              <NavLink to="/" className={linkClass} end>
                <Home className="h-4 w-4" /> Home
              </NavLink>
              <NavLink to="/history" className={linkClass}>
                <Clock className="h-4 w-4" /> History
              </NavLink>
            </>
          )}
          {!user && (
            <NavLink to="/auth" className={linkClass}>
              <LogIn className="h-4 w-4" /> Sign In
            </NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:inline-flex"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden animate-slide-down">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)} end>
                  <Home className="h-4 w-4" /> Home
                </NavLink>
                <NavLink to="/history" className={linkClass} onClick={() => setMenuOpen(false)}>
                  <Clock className="h-4 w-4" /> History
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </>
            ) : (
              <NavLink to="/auth" className={linkClass} onClick={() => setMenuOpen(false)}>
                <LogIn className="h-4 w-4" /> Sign In
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
