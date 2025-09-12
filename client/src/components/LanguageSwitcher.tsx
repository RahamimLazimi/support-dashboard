import { IconButton, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'he' : 'en';
    setLanguage(nextLang);
  };

  return (
    <Tooltip title={t('toggleLanguage') || 'Switch language'}>
      <IconButton onClick={toggleLanguage} color="inherit">
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSwitcher;
