import { useState, useEffect } from 'react';
import api from '../services/api';

const DISTRICT_NAMES = {
  ariyalur: 'Ariyalur',
  chengalpattu: 'Chengalpattu',
  chennai: 'Chennai',
  coimbatore: 'Coimbatore',
  cuddalore: 'Cuddalore',
  dharmapuri: 'Dharmapuri',
  dindigul: 'Dindigul',
  erode: 'Erode',
  kallakurichi: 'Kallakurichi',
  kanchipuram: 'Kanchipuram',
  kanyakumari: 'Kanyakumari',
  karur: 'Karur',
  krishnagiri: 'Krishnagiri',
  madurai: 'Madurai',
  mayiladuthurai: 'Mayiladuthurai',
  nagapattinam: 'Nagapattinam',
  namakkal: 'Namakkal',
  nilgiris: 'Nilgiris',
  perambalur: 'Perambalur',
  pudukkottai: 'Pudukkottai',
  ramanathapuram: 'Ramanathapuram',
  ranipet: 'Ranipet',
  salem: 'Salem',
  sivagangai: 'Sivagangai',
  tenkasi: 'Tenkasi',
  thanjavur: 'Thanjavur',
  theni: 'Theni',
  thoothukudi: 'Thoothukudi (Tuticorin)',
  tiruchirappalli: 'Tiruchirappalli',
  tirunelveli: 'Tirunelveli',
  tirupathur: 'Tirupathur',
  tiruppur: 'Tiruppur',
  tiruvallur: 'Tiruvallur',
  tiruvannamalai: 'Tiruvannamalai',
  tiruvarur: 'Tiruvarur',
  vellore: 'Vellore',
  viluppuram: 'Viluppuram',
  virudhunagar: 'Virudhunagar'
};

export default function StatsPanel({ isAdmin }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/entries/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="stats-loading">Loading analytics...</div>;
  if (!stats) return null;

  const { overall, districtStats } = stats;

  return (
    <div className="stats-panel">
      <div className="stats-cards">
        <div className="stat-card stat-total">
          <div className="stat-number">{overall.total}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{overall.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-replied">
          <div className="stat-number">{overall.replied}</div>
          <div className="stat-label">Replied</div>
        </div>
        <div className="stat-card stat-closed">
          <div className="stat-number">{overall.closed}</div>
          <div className="stat-label">Closed</div>
        </div>
        <div className="stat-card stat-overdue">
          <div className="stat-number">{overall.overdue}</div>
          <div className="stat-label">Overdue (3+ days)</div>
        </div>
      </div>

      {isAdmin && districtStats && Object.keys(districtStats).length > 0 && (
        <div className="district-stats">
          <h3>District-wise Summary</h3>
          <div className="district-table-wrap">
            <table className="district-stats-table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>Total</th>
                  <th>Pending</th>
                  <th>Replied</th>
                  <th>Closed</th>
                  <th>Overdue</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(districtStats)
                  .sort((a, b) => (DISTRICT_NAMES[a[0]] || a[0]).localeCompare(DISTRICT_NAMES[b[0]] || b[0]))
                  .map(([distId, ds]) => {
                    const pct = ds.total > 0 ? Math.round((ds.closed / ds.total) * 100) : 0;
                    return (
                      <tr key={distId}>
                        <td className="district-name">{DISTRICT_NAMES[distId] || distId}</td>
                        <td>{ds.total}</td>
                        <td>{ds.pending > 0 ? <span className="text-warning">{ds.pending}</span> : 0}</td>
                        <td>{ds.replied > 0 ? <span className="text-info">{ds.replied}</span> : 0}</td>
                        <td>{ds.closed > 0 ? <span className="text-success">{ds.closed}</span> : 0}</td>
                        <td>{ds.overdue > 0 ? <span className="text-danger">{ds.overdue}</span> : 0}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${pct}%` }}></div>
                            <span className="progress-text">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
