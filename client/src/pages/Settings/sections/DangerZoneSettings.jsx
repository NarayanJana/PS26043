import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { deleteMyAccount } from '../../../services/userService';
import { logout } from '../../../store/slices/authSlice';
import { showToast } from '../../../utils/toastBus';

export default function DangerZoneSettings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const canConfirm = confirmText === 'DELETE' && password.length > 0 && !deleting;

  const closeModal = () => {
    setModalOpen(false);
    setConfirmText('');
    setPassword('');
    setError('');
  };

  const handleDelete = async () => {
    setError('');
    setDeleting(true);
    try {
      await deleteMyAccount(password, confirmText);
      showToast(t('danger.success'), 'success');
      dispatch(logout());
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
      <h2 className="font-display text-lg font-semibold text-red-400 mb-2">
        {t('danger.title')}
      </h2>
      <p className="text-sm text-inkMuted mb-6 max-w-lg">{t('danger.deleteWarning')}</p>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-red-500/10 text-red-400 border border-red-500/40 text-sm font-medium rounded-md px-4 py-2.5 hover:bg-red-500/20"
      >
        {t('danger.deleteAccount')}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative bg-panel border border-red-500/30 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-red-400" />
              <h3 className="font-display text-lg font-semibold text-ink50">
                {t('danger.deleteAccount')}?
              </h3>
            </div>
            <p className="text-sm text-inkMuted mb-5">{t('danger.deleteWarning')}</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-xs text-inkMuted mb-1.5">
                  {t('danger.currentPassword')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs text-inkMuted mb-1.5">
                  {t('danger.typeToConfirm')}
                </label>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-red-400 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={!canConfirm}
                className="flex-1 bg-red-500 text-white text-sm font-medium rounded-md py-2.5 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? t('danger.deleting') : t('danger.confirmDelete')}
              </button>
              <button
                onClick={closeModal}
                disabled={deleting}
                className="text-sm text-inkMuted hover:text-ink50"
              >
                {t('danger.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}