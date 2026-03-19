import { useState } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';

export default function ConstituencyModal({ entry, onClose, onSaved }) {
  const { t } = useLang();
  const [constituency, setConstituency] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!constituency) {
      setError(t.selectDistrictError);
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/entries/${entry.id}/constituency`, { constituency });
      onSaved();
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(typeof msg === 'string' ? msg : 'Failed to update.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{t.fillConstituency}</h3>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>
        <div className="modal-entry-info">
          <p><strong>{t.complaintId}:</strong> {entry.complaintId || `SM-${String(entry.sno).padStart(3, '0')}`}</p>
          <p><strong>{t.gistOfContent}:</strong> {entry.gist}</p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label>{t.constituencyLabel} *</label>
            <input type="text" value={constituency} onChange={e => setConstituency(e.target.value)}
              placeholder={t.constituencyLabel} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t.saving : t.saveRemark}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
