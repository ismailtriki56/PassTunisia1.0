import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatEnglishDate } from '../utils/dateUtils';

interface EnglishDatePickerProps {
  value: string; // ISO format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  label?: string;
  hasError?: boolean;
  className?: string;
}

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const ENGLISH_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const EnglishDatePicker: React.FC<EnglishDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  hasError,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view year and month based on current value
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const selectedIso = `${viewYear}-${mm}-${dd}`;
    onChange(selectedIso);
    setIsOpen(false);
  };

  const isDayDisabled = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${mm}-${dd}`;
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return value === `${viewYear}-${mm}-${dd}`;
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`} lang="en-US">
      {/* Input Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 bg-[#faf7f2] border rounded-2xl text-sm font-semibold text-[#242220] flex items-center justify-between transition-all cursor-pointer ${
          hasError
            ? 'border-red-500 ring-1 ring-red-500'
            : 'border-[#ddd2c5] hover:border-[#c25934] focus:ring-2 focus:ring-[#c25934]'
        }`}
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#c25934] shrink-0" />
          <span>{value ? formatEnglishDate(value, { formatStyle: 'medium' }) : 'Select Date (en-US)'}</span>
        </span>
        <span className="text-[11px] font-mono font-bold text-[#8c8275] bg-white px-2 py-0.5 rounded border border-[#e5dcd1]">
          {value || 'YYYY-MM-DD'}
        </span>
      </button>

      {/* English Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white rounded-2xl border border-[#ded5c8] shadow-2xl p-4 animate-in fade-in zoom-in-95">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3 border-b border-[#f0e8de] pb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-stone-100 text-[#4a443d] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-xs font-black text-[#1e1c1a] tracking-wide">
              {ENGLISH_MONTHS[viewMonth]} {viewYear}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-stone-100 text-[#4a443d] transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels (en-US) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {ENGLISH_DAYS.map((day) => (
              <div key={day} className="text-[10px] font-bold text-[#94897d] uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDayDisabled(day);
              const selected = isSelected(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 mx-auto rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                    selected
                      ? 'bg-[#c25934] text-white shadow-sm'
                      : disabled
                      ? 'text-stone-300 cursor-not-allowed'
                      : 'hover:bg-[#f5ece0] text-[#332e29] cursor-pointer'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Select for Eclipse 2027 Totality Date */}
          <div className="mt-3 pt-2 border-t border-[#f0e8de] text-center">
            <button
              type="button"
              onClick={() => {
                setViewYear(2027);
                setViewMonth(7); // August (0-indexed)
                onChange('2027-08-02');
                setIsOpen(false);
              }}
              className="text-[11px] font-bold text-[#124e5b] hover:text-[#c25934] transition-colors"
            >
              ☀️ Jump to August 2, 2027 (Eclipse Totality)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
