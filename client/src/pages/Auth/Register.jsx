import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GitBranch } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { registerUser } from '../../services/authService';
import { setCredentials } from '../../store/slices/authSlice';

const roles = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'university', label: 'University' },
  { value: 'industry', label: 'Industry' },
  { value: 'government', label: 'Government' },
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    phone: '',
    organizationName: '',
    organizationType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showOrgFields = form.role !== 'citizen';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        organization: showOrgFields
          ? { name: form.organizationName, type: form.organizationType }
          : undefined,
      };

      const { data } = await registerUser(payload);
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <GitBranch size={20} className="text-signal" />
          <span className="font-display font-semibold text-lg text-ink50">
            SocioSolve
          </span>
        </Link>

        <div className="bg-panel border border-panelLight rounded-lg p-8">
          <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
            Create an account
          </h1>
          <p className="text-sm text-inkMuted mb-8">
            Report challenges, or register as an institution.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Select label="I am a" name="role" value={form.role} onChange={handleChange}>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>

            <Input
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jordan Smith"
              required
            />
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
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
            />

            {showOrgFields && (
              <>
                <Input
                  label="Organization name"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. State University of Technology"
                  required
                />
                <Input
                  label="Organization type"
                  name="organizationType"
                  value={form.organizationType}
                  onChange={handleChange}
                  placeholder="e.g. Public university, Manufacturing"
                />
              </>
            )}

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button type="submit" variant="primary" className="w-full justify-center mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-inkMuted text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-pulse hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}