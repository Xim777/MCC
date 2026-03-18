import { useState } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';

export default function RemarkModal({ entry, onClose, onSaved }) {
  const { t } = useLang();
  const [remark, setRemark] = useState(entry.remark || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.put(`/entries/${entry.id}/remark`, { remark });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save remark.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{t.editRemark}</h3>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>

        <div className="modal-entry-info">
          <p><strong>{t.sno}:</strong> {entry.sno}</p>
          <p><strong>{t.gistOfContent}:</strong> {entry.gist}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>{t.remark}</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)}
              rows="4" placeholder={t.remarkPlaceholder} />
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
