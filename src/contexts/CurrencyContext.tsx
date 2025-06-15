
import React, { createContext, useContext, useState, useEffect } from "react";
import currency from "currency.js";

type Currency = "USD" | "EUR" | "INR";

const rates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  INR: 83,
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  format: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  format: (value) => `$${value}`,
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const getDefault = (): Currency => {
    return (
      (localStorage.getItem("currency") as Currency) ||
      (navigator.language.startsWith('hi') ? 'INR' : navigator.language.startsWith('es') ? 'EUR' : 'USD')
    );
  };

  const [cur, setCur] = useState<Currency>(getDefault);

  useEffect(() => {
    localStorage.setItem("currency", cur);
  }, [cur]);

  const format = (amount: number) => {
    const rate = rates[cur] || 1;
    const formatted = currency(amount * rate, {
      symbol: cur === "USD" ? "$" : cur === "EUR" ? "€" : "₹",
      separator: ",",
      decimal: ".",
      precision: 2,
    }).format();
    return formatted;
  };

  return (
    <CurrencyContext.Provider value={{ currency: cur, setCurrency: setCur, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};
