import React, { useEffect, useRef, useState } from 'react';

type OtpInputProps = {
  length?: number;
  onChange?: (otp: string) => void;
  onComplete: (otp: string) => void;
};

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange, onComplete }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(''));

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    onChange?.(updated.join(''));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (updated.every(val => val !== '')) {
      onComplete(updated.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text').slice(0, length).split('');
    const updated = [...otpValues];

    pasted.forEach((char, i) => {
      if (i < length && /^\d$/.test(char)) {
        updated[i] = char;
        if (inputsRef.current[i]) {
          inputsRef.current[i]!.value = char;
        }
      }
    });

    setOtpValues(updated);
    onChange?.(updated.join(''));
    if (updated.every(val => val !== '')) {
      onComplete(updated.join(''));
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-7 mb-7">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={el => {
            inputsRef.current[i] = el;
          }}          
          onChange={e => handleChange(e.target.value, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
