import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLang } = useLang();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{t.topbarTitle}</h1>
      </div>
      <div className="topbar-right">
        <button className="btn-lang" onClick={toggleLang}>{t.language}</button>
        <div className="topbar-user">
          <div className="topbar-user-role">
            {user.role === 'admin' ? t.administrator : t.districtOfficer}
          </div>
          <div className="topbar-user-name">
            {user.role === 'admin' ? t.admin : user.districtName}
          </div>
        </div>
        <button className="btn btn-logout" onClick={handleLogout}>{t.logout}</button>
      </div>
    </header>
  );
}
