import { NavLink } from "react-router-dom";

const tabBase =
  "h-12 flex items-center justify-center rounded-xl border border-white/10 " +
  "bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold";

function Tab({
  to,
  children,
  disabled,
}: { to?: string; children: React.ReactNode; disabled?: boolean }) {
  if (disabled || !to) {
    return (
      <span
        className={`${tabBase} opacity-50 pointer-events-none select-none`}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${tabBase} ${isActive ? "bg-white/15 border-white/20" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="text-black font-bold tracking-wide"></div>
        </div>

        {/* Tabs */}
        <nav className="pb-4">
          <ul className="grid grid-cols-4 gap-3 text-white">
            <li><Tab to="/soccer">Soccer</Tab></li>
            <li><Tab to="/nba">NBA</Tab></li>
            <li><Tab disabled>NFL</Tab></li>
            <li><Tab disabled>MLB</Tab></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
