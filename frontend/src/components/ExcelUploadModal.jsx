import { useState } from 'react';
import { useLang } from '../context/LangContext';
import api from '../services/api';

export default function ExcelUploadModal({ onClose, onUploaded, mediaType }) {
  const { t } = useLang();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (mediaType) formData.append('mediaType', mediaType);
      const res = await api.post('/entries/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(typeof msg === 'string' ? msg : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function handleDone() {
    onUploaded();
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{t.uploadExcelTitle}</h3>
          <button className="btn-close" onClick={result ? handleDone : onClose}>X</button>
        </div>

        <div style={{ padding: '20px' }}>
          {!result && (
            <>
              <p className="excel-hint">{t.excelHint}</p>
              <form onSubmit={handleUpload}>
                {error && <div className="error-msg">{error}</div>}

                <div className="form-group">
                  <label>{t.selectFile}</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={e => setFile(e.target.files[0])}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>{t.cancel}</button>
                  <button type="submit" className="btn btn-primary" disabled={!file || uploading}>
                    {uploading ? t.uploading : t.upload}
                  </button>
                </div>
              </form>
            </>
          )}

          {result && (
            <div className="excel-result">
              <div className="success-msg">
                {result.message}
              </div>

              {result.skipped && result.skipped.length > 0 && (
                <div className="excel-skipped">
                  <ul>
                    {result.skipped.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="excel-errors">
                  <p><strong>{t.excelErrors}</strong></p>
                  <ul>
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleDone}>OK</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
