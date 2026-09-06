import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Pencil, Check, X as XIcon } from 'lucide-react';
import { updateProfile, changePassword } from '../../../services/userService';
import { updateUser } from '../../../store/slices/authSlice';
import { showToast } from '../../../utils/toastBus';

const ROLE_LABELS = {
  citizen: 'Citizen',
  university: 'University',
  industry: 'Industry',
  government: 'Government',
  admin: 'Admin',
};

const getPasswordStrength = (password) => {
  if (!password) return { label: '', width: '0%', color: '' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', width: '25%', color: 'bg-red-400' };
  if (score <= 3) return { label: 'Fair', width: '60%', color: 'bg-signal' };
  return { label: 'Strong', width: '100%', color: 'bg-pulse' };
};

export default function AccountSettings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const startEditing = () => {
    setProfileDraft({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    setProfileError('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setProfileError('');
  };

  const handleProfileChange = (e) => {
    setProfileDraft({ ...profileDraft, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setProfileError('');
    setProfileSaving(true);
    try {
      const { data } = await updateProfile(profileDraft);
      dispatch(updateUser(data.user));
      setEditing(false);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordSuccess('');
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(passwordForm);
      setPasswordSuccess('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Could not update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const strength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold text-ink50">Profile</h2>
          {!editing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 text-xs text-signal hover:underline"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-panelLight border border-panelLight flex items-center justify-center shrink-0">
            <span className="font-display text-lg text-signal">{initials}</span>
          </div>
          <div>
            <p className="text-sm text-ink50 font-medium">{user?.name}</p>
            <p className="font-mono text-xs text-inkMuted uppercase mt-0.5">
              {ROLE_LABELS[user?.role] || user?.role}
            </p>
          </div>
        </div>

        {profileError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-4">
            {profileError}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-1 md:gap-4 items-center">
            <span className="text-xs text-inkMuted font-mono uppercase">Name</span>
            {editing ? (
              <input
                name="name"
                value={profileDraft.name}
                onChange={handleProfileChange}
                className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
              />
            ) : (
              <span className="text-sm text-ink50">{user?.name}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-1 md:gap-4 items-center">
            <span className="text-xs text-inkMuted font-mono uppercase">Email</span>
            {editing ? (
              <input
                name="email"
                type="email"
                value={profileDraft.email}
                onChange={handleProfileChange}
                className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
              />
            ) : (
              <span className="text-sm text-ink50">{user?.email}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-1 md:gap-4 items-center">
            <span className="text-xs text-inkMuted font-mono uppercase">Phone</span>
            {editing ? (
              <input
                name="phone"
                value={profileDraft.phone}
                onChange={handleProfileChange}
                placeholder="Not set"
                className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
              />
            ) : (
              <span className="text-sm text-ink50">{user?.phone || '—'}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-1 md:gap-4 items-center">
            <span className="text-xs text-inkMuted font-mono uppercase">Role</span>
            <span className="text-sm text-inkMuted">{ROLE_LABELS[user?.role] || user?.role} (read-only)</span>
          </div>

          {user?.organization?.name && (
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-1 md:gap-4 items-center">
              <span className="text-xs text-inkMuted font-mono uppercase">Organization</span>
              <span className="text-sm text-inkMuted">{user.organization.name} (read-only)</span>
            </div>
          )}
        </div>

        {editing && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-panelLight">
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="flex items-center gap-1.5 bg-signal text-ink text-sm font-medium rounded-md px-4 py-2 hover:bg-amber-400 disabled:opacity-50"
            >
              <Check size={14} /> {profileSaving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              onClick={cancelEditing}
              disabled={profileSaving}
              className="flex items-center gap-1.5 text-sm text-inkMuted hover:text-ink50"
            >
              <XIcon size={14} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="bg-panel border border-panelLight rounded-lg p-6">
        <h2 className="font-display text-lg font-semibold text-ink50 mb-6">Change password</h2>

        {passwordError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-4">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="bg-pulse/10 border border-pulse/30 text-pulse text-sm rounded-md px-4 py-3 mb-4">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleSubmitPassword} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block text-sm text-inkMuted mb-2">Current password</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2.5 text-sm text-ink50 focus:outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">New password</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              minLength={6}
              required
              className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2.5 text-sm text-ink50 focus:outline-none focus:border-signal"
            />
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="h-1.5 bg-panelLight rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs text-inkMuted mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">Confirm new password</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              required
              className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2.5 text-sm text-ink50 focus:outline-none focus:border-signal"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-1.5 text-xs text-inkMuted hover:text-ink50 w-fit"
          >
            {showPasswords ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPasswords ? 'Hide passwords' : 'Show passwords'}
          </button>

          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-signal text-ink text-sm font-medium rounded-md py-2.5 hover:bg-amber-400 disabled:opacity-50 mt-2"
          >
            {passwordSaving ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}