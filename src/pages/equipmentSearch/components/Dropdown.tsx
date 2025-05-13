import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function Dropdown({ options, selected, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium bg-muted text-foreground rounded-md border border-input hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option}>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    option === selected
                      ? 'bg-accent text-accent-foreground'
                      : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
