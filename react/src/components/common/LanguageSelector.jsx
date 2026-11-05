import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSelector.css';

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="language-selector-wrapper" title={t('common.language', 'Language')}>
      <Globe size={15} className="language-icon" aria-hidden="true" />
      <select
        value={i18n.language?.substring(0, 2) || 'fr'}
        onChange={handleLanguageChange}
        className="language-select"
        aria-label={t('common.language', 'Language')}
      >
        <option value="en">English (EN)</option>
        <option value="fr">Français (FR)</option>
        <option value="ar">العربية (AR)</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
