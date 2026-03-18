import { useState } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';

export default function ChangePasswordModal({ onClose }) {
  const { t } = useLang();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError(t.passwordMinLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setSuccess(t.passwordChanged);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(typeof msg === 'string' ? msg : 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{t.changePassword}</h3>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <div className="form-group">
            <label>{t.currentPassword}</label>
            <input type="password" value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t.newPassword}</label>
            <input type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t.confirmNewPassword}</label>
            <input type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t.changing : t.changePassword}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
