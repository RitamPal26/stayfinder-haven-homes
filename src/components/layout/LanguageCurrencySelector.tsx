
import React from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "hi", label: "HI" }
];

const currencies = [
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
  { code: "INR", label: "INR" }
];

export const LanguageCurrencySelector = () => {
  const { i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  // Language selector
  const setLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Language Dropdown */}
      <select
        className="border rounded p-1 text-sm bg-white"
        value={i18n.language}
        onChange={e => setLang(e.target.value)}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      {/* Currency Dropdown */}
      <select
        className="border rounded p-1 text-sm bg-white"
        value={currency}
        onChange={e => setCurrency(e.target.value as any)}
      >
        {currencies.map(cur => (
          <option key={cur.code} value={cur.code}>
            {cur.label}
          </option>
        ))}
      </select>
    </div>
  );
};
