
import React from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CurrencyProps {
  amount: number;
  className?: string;
}

export const Currency: React.FC<CurrencyProps> = ({ amount, className }) => {
  const { format } = useCurrency();
  return <span className={className}>{format(amount)}</span>;
};
