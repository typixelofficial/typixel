export interface ContactConfig {
  email: string;
  whatsappNumber: string; // international format without spaces, e.g. 919072891142
}

const CONTACT_STORAGE_KEY = 'typixel_portfolio_contact_config_v2';

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  email: 'typixelofficial@gmail.com',
  whatsappNumber: '919072891142'
};

export const getStoredContactConfig = (): ContactConfig => {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email && !parsed.email.includes('kawsar') && !parsed.email.includes('hashimtypixel')) {
        return {
          email: parsed.email.trim(),
          whatsappNumber: (parsed.whatsappNumber || DEFAULT_CONTACT_CONFIG.whatsappNumber).replace(/[^0-9]/g, '')
        };
      }
    }
  } catch (err) {
    console.error('Failed to read contact config:', err);
  }
  return DEFAULT_CONTACT_CONFIG;
};

export const saveContactConfigToStorage = (email: string, whatsappNumber: string) => {
  try {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const config: ContactConfig = {
      email: email.trim(),
      whatsappNumber: cleanNumber || DEFAULT_CONTACT_CONFIG.whatsappNumber
    };
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save contact config:', err);
  }
};
