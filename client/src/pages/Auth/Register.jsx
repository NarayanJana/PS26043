import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GitBranch } from 'lucide-react';

import Input from '../../components/common/Input';
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
    department: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isGovernment = form.role === 'government';

  const isInstitution =
    form.role === 'university' ||
    form.role === 'industry';

  // Normal input change
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Remove old error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Change registration type
  const handleRoleChange = (role) => {
    // Clear ALL role-specific and sensitive fields
    // so data from one role never appears in another role.
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role,
      phone: '',
      organizationName: '',
      organizationType: '',
      department: '',
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Government needs email + department
    if (isGovernment) {
      if (!form.email || !form.department || !form.password) {
        setError(
          'Official email, department, and password are required.'
        );
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        // Backend currently requires name.
        // Government users do not enter a name,
        // so we provide a safe internal value.
        name: isGovernment ? 'Government' : form.name,

        email: form.email,
        password: form.password,
        role: form.role,

        // Only send phone for non-government users
        phone: isGovernment ? undefined : form.phone,

        // University / Industry
        organization: isInstitution
          ? {
              name: form.organizationName,
              type: form.organizationType,
            }
          : undefined,

        // Government
        department: isGovernment
          ? form.department
          : undefined,
      };

      const { data } = await registerUser(payload);

      dispatch(setCredentials(data));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">

        
        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-8"
        >
          <GitBranch
            size={20}
            className="text-signal"
          />

          <span className="font-display font-semibold text-lg text-ink50">
            SocioSolve
          </span>
        </Link>

        
        <div className="bg-panel border border-panelLight rounded-xl p-8 shadow-xl">

          {/* Heading */}
          <div className="mb-7">
            <h1 className="font-display text-2xl font-semibold text-ink50 mb-2">
              Create an account
            </h1>

            <p className="text-sm text-inkMuted">
              Join SocioSolve and contribute to solving
              real-world challenges.
            </p>
          </div>

         
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-panelLight rounded-lg overflow-hidden mb-7 bg-ink">

            {roles.map((role) => {
              const selected =
                form.role === role.value;

              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() =>
                    handleRoleChange(role.value)
                  }
                  className={`
                    py-3 px-2
                    text-sm font-medium
                    transition-all duration-200
                    border-b sm:border-b-0
                    sm:border-r last:border-r-0
                    border-panelLight
                    ${
                      selected
                        ? 'bg-signal text-ink'
                        : 'text-inkMuted hover:text-ink50 hover:bg-panelLight'
                    }
                  `}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          
          <div className="mb-6">
            <p className="text-xs font-mono text-pulse uppercase tracking-wider">
              {form.role === 'citizen' &&
                'Citizen Account'}

              {form.role === 'university' &&
                'University Account'}

              {form.role === 'industry' &&
                'Industry Account'}

              {form.role === 'government' &&
                'Government Account'}
            </p>
          </div>

         
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            
            {form.role === 'citizen' && (
              <>
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
              </>
            )}

            
            {form.role === 'university' && (
              <>
                <Input
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                />

                <Input
                  label="University name"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. State University of Technology"
                  required
                />

                <Input
                  label="University type"
                  name="organizationType"
                  value={form.organizationType}
                  onChange={handleChange}
                  placeholder="e.g. Public / Private"
                />
              </>
            )}

          
            

            {form.role === 'industry' && (
              <>
                <Input
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                />

                <Input
                  label="Organization name"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. ABC Technologies"
                  required
                />

                <Input
                  label="Industry type"
                  name="organizationType"
                  value={form.organizationType}
                  onChange={handleChange}
                  placeholder="e.g. IT, Manufacturing, Healthcare"
                />
              </>
            )}


            {form.role === 'government' && (
              <>
                <Input
                  label="Official email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="official@gov.in"
                  required
                />

                <Input
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Department of Agriculture"
                  required
                />
              </>
            )}


            <div className="pt-2 border-t border-panelLight">
              <div className="pt-5 flex flex-col gap-5">

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
                  placeholder="Re-enter your password"
                  required
                />

              </div>
            </div>

            
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center mt-2"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create account'}
            </Button>

          </form>

          
          <p className="text-sm text-inkMuted text-center mt-8">
            Already have an account?{' '}

            <Link
              to="/login"
              className="text-pulse hover:underline"
            >
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}