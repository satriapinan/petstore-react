import { useAuth } from '@/core/services/hooks/useAuth';
import MenuItem from '@/shared/components/menu/menu-item/menu-item.component';
import Menu from '@/shared/components/menu/menu.component';
import './navbar.component.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getInitial = (username: string): string => {
    return username?.charAt(0).toUpperCase() || '';
  };

  return (
    <header className="navbar">
      <img src="/logo.png" alt="logo" className="logo" />

      {user && (
        <div className="navbar-right">
          <Menu
            trigger={
              <div className="profile">
                <div className="avatar">{getInitial(user.username)}</div>
                <span className="username">{user.username}</span>
              </div>
            }
          >
            <MenuItem label="Logout" icon="mdi:logout" danger onClick={logout} />
          </Menu>
        </div>
      )}
    </header>
  );
};

export default Navbar;
