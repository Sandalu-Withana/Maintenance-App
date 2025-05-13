interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex items-center h-5 mt-1">
        <input
          id={id}
          type="checkbox"
          className="w-4 h-4 border border-input rounded bg-background focus:ring-primary"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
    </div>
  );
}
