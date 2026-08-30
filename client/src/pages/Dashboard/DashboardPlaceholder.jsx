import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';

export default function DashboardPlaceholder() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="bg-panel border border-panelLight rounded-lg p-10 max-w-md w-full text-center">
        <p className="font-mono text-xs text-pulse uppercase tracking-widest mb-4">
          Authenticated
        </p>
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Logged in as{' '}
          <span className="text-signal font-mono">{user?.role}</span>. This
          placeholder will be replaced by your real role-specific dashboard in
          a later stage.
        </p>
        <Button variant="secondary" onClick={handleLogout} className="w-full justify-center">
          Log out
        </Button>
      </div>
    </div>
  );
}