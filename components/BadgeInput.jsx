'use client';
import { useState } from 'react';

export default function BadgeInput({ 
  label='Badges', 
  value=[], 
  onChange, 
  placeholder='쉼표로 분리 (예: Perfect Timing, Massive Market)',
  className,
  ...props 
}) {
  const [text, setText] = useState(value.join(', '));

  const toArray = (str) =>
    str.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10);

  return (
    <div className={`space-y-2 ${className || ''}`} {...props}>
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full rounded-md border px-3 py-2"
        placeholder={placeholder}
        value={text}
        onChange={(e)=>{
          setText(e.target.value);
          onChange?.(toArray(e.target.value));
        }}
      />
      <div className="flex flex-wrap gap-2">
        {toArray(text).map((b,i)=>(
          <span key={i} className="text-xs bg-gray-100 border rounded-full px-2 py-1">{b}</span>
        ))}
      </div>
    </div>
  );
}
