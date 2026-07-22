import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Ghost text "back to X" nav link/button, used above forms and detail pages.
// Pass `to` for a route Link, or `onClick` to run custom navigation logic.
export default function BackLink({ to, onClick, children, className = "" }) {
  const classes = `inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        <ArrowLeft size={16} /> {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <ArrowLeft size={16} /> {children}
    </button>
  );
}
