import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAppDispatch, useAppSelector, logout } from '@/redux';
import { useTranslation } from 'react-i18next';

const TopBar: React.FC = () => {
  const { mode, toggleDarkMode } = useLanguage();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // בדיקה אם אנו נמצאים בדפי Authentication
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  console.log(user?.gender);

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* שמירת הכותרת בצד שמאל */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* אם המשתמש מחובר, מציגים "Welcome, שם מלא" */}
          {user && (
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              {t(user.gender === 'זכר' ? 'dashboard.welcomeMen' : 'dashboard.welcomeWoman')},&nbsp;
              {user.name} אל אתר "{t('dashboard.title')}"
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!user && (
            <>
              {/* בדף login - מציג רק כפתור הרשמה */}
              {isLoginPage && (
                <Button color="inherit" component={Link} to="/register">
                  {t('register.title')}
                </Button>
              )}

              {/* בדף register - מציג רק כפתור התחברות */}
              {isRegisterPage && (
                <Button color="inherit" component={Link} to="/login">
                  {t('login.title')}
                </Button>
              )}

              {/* בדפים אחרים לא של התחברות/הרשמה - מציג גם התחברות וגם הרשמה */}
              {!isLoginPage && !isRegisterPage && (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    {t('login.title')}
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    {t('register.title')}
                  </Button>
                </>
              )}
            </>
          )}

          {user && (
            <>
              {/* אם המשתמש הוא Admin */}
              {user.roles.includes('Admin') &&
                (location.pathname === '/admin/users' ? (
                  // אם אנחנו בניהול משתמשים, להציג כפתור ל־dashboard במקום
                  <Button color="inherit" component={Link} to="/dashboard">
                    {t('dashboard.title')}
                  </Button>
                ) : (
                  // אחרת, להציג כפתור לניהול משתמשים
                  <Button color="inherit" component={Link} to="/admin/users">
                    {t('admin.title')}
                  </Button>
                ))}

              <Tooltip title={t('logout') || 'Logout'}>
                <IconButton color="inherit" onClick={handleLogout} size="large">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <LanguageSwitcher />
          <IconButton color="inherit" onClick={toggleDarkMode} size="large">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
