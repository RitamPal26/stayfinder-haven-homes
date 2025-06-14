
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

interface UseFormValidationProps {
  rules: Record<string, ValidationRule[]>;
}

export const useFormValidation = ({ rules }: UseFormValidationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateField = (name: string, value: string): boolean => {
    const fieldRules = rules[name] || [];
    
    for (const rule of fieldRules) {
      if (rule.required && !value.trim()) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
      
      if (rule.minLength && value.length < rule.minLength) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
      
      if (rule.custom && !rule.custom(value)) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  };

  const validateAll = (formData: Record<string, string>): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([name, value]) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors and try again.',
        variant: 'destructive',
      });
    }

    return isValid;
  };

  const clearErrors = () => setErrors({});

  return { errors, validateField, validateAll, clearErrors };
};

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required,
  disabled,
  className
}: FormFieldProps) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);
