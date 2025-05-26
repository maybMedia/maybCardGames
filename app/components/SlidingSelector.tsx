import React, { useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

type SlidingSelectorProps = {
  options: Option[];
  onChange?: (value: string) => void;
  value?: string; // <-- Add this
  defaultValue?: string;
};

const SlidingSelector: React.FC<SlidingSelectorProps> = ({
  options,
  onChange,
  value,
  defaultValue,
}) => {
  const getDefaultIdx = () => {
    if (value) {
      const idx = options.findIndex((opt) => opt.value === value);
      return idx !== -1 ? idx : 0;
    }
    if (defaultValue) {
      const idx = options.findIndex((opt) => opt.value === defaultValue);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  };

  const selectedIdx = getDefaultIdx();

  useEffect(() => {
    // Optionally notify parent of default selection
    if (onChange && options[selectedIdx]) {
      onChange(options[selectedIdx].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, options]);

  const handleSelect = (idx: number) => {
    onChange?.(options[idx].value);
  };

  return (
    <div className="w-full flex justify-center py-2">
      <div
        className="flex gap-4 transition-transform duration-300 items-center"
        style={{
          transform: `translateX(calc(50% - ${(selectedIdx + 0.5) * 8.9}rem))`,
          height: "3.5rem",
        }}
      >
        {options.map((option, idx) => (
          <button
            key={option.value + idx}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center
              ${idx === selectedIdx
                ? "bg-white text-blue-700 shadow-lg scale-110 opacity-100 z-10"
                : "bg-blue-400 text-white opacity-50 hover:opacity-80 scale-100"
              }`}
            style={{
              minWidth: "8rem",
              height: "3rem",
              outline: idx === selectedIdx ? "2px solid #2563eb" : "none",
              outlineOffset: "2px",
            }}
            onClick={() => handleSelect(idx)}
            tabIndex={0}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlidingSelector;