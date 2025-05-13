import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

export function FormField({ id, label, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
