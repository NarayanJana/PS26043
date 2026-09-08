import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, GitBranch, Sun, Moon } from 'lucide-react';
import Button from './Button';
import { setThemeMode } from '../../store/slices/themeSlice';

export default function Navbar({ showTheme = false }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const darkMode = mode === 'dark';

  const links = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Domains', href: '#domains' },
    { label: 'Challenges', href: '#challenges' },
    { label: 'Stakeholders', href: '#stakeholders' },
  ];

  const toggleTheme = () => {
    dispatch(setThemeMode(darkMode ? 'light' : 'dark'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-md border-b border-panelLight">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <GitBranch
            size={20}
            className="text-signal"
          />

          <span className="font-display font-semibold text-lg text-ink50">
            SocioSolve
          </span>

          <span className="font-mono text-[10px] text-inkMuted border border-inkMuted/40 rounded px-1.5 py-0.5 ml-1">
            PS26043
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-inkMuted hover:text-ink50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">

          {showTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-inkMuted hover:text-ink50 hover:bg-panelLight transition-colors"
              aria-label="Toggle theme"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>
          )}

          <Link to="/login">
            <Button variant="ghost">
              Log in
            </Button>
          </Link>

          <Link to="/register">
            <Button variant="primary">
              Report a challenge
            </Button>
          </Link>

        </div>

        <button
          type="button"
          className="md:hidden text-ink50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={19} />}
        </button>

      </div>

      {open && (
        <div className="md:hidden bg-panel border-t border-panelLight px-6 py-5">
          <div className="flex flex-col gap-4">

            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-inkMuted hover:text-ink50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}

            {showTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-3 text-sm text-inkMuted hover:text-ink50 py-2"
              >
                {darkMode ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}

                {darkMode
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'}
              </button>
            )}

            <div className="flex flex-col gap-3 pt-2">

              <Link to="/login">
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Log in
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                >
                  Report a challenge
                </Button>
              </Link>

            </div>

          </div>
        </div>
      )}
    </header>
  );
}