import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GitBranch } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser } from '../../services/authService';
import { setCredentials } from '../../store/slices/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await loginUser(form);
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <GitBranch size={20} className="text-signal" />
          <span className="font-display font-semibold text-lg text-ink50">
            SocioSolve
          </span>
        </Link>

        <div className="bg-panel border border-panelLight rounded-lg p-8">
          <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-inkMuted mb-8">
            Log in to track your challenges and projects.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <Button type="submit" variant="primary" className="w-full justify-center mt-2">
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="text-sm text-inkMuted text-center mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-pulse hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}