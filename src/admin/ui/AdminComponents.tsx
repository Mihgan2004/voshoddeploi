
import React from 'react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[#C6902E]/50";
  const variants = {
    primary: "bg-[#F5F5F5] text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-transparent",
    ghost: "bg-transparent text-[#9FA3B0] border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs uppercase tracking-wider",
    md: "h-10 px-6 text-sm"
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs text-[#9FA3B0] uppercase tracking-wider font-semibold">{label}</label>}
    <input 
      className={`h-10 px-3 bg-[#0B0D10] border border-white/10 text-[#F5F5F5] placeholder-[#9FA3B0]/30 focus:border-[#C6902E] focus:outline-none transition-colors ${className}`}
      {...props}
    />
  </div>
);

// --- SELECT ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}
export const Select: React.FC<SelectProps> = ({ label, className = '', children, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs text-[#9FA3B0] uppercase tracking-wider font-semibold">{label}</label>}
    <select 
      className={`h-10 px-3 bg-[#0B0D10] border border-white/10 text-[#F5F5F5] focus:border-[#C6902E] focus:outline-none transition-colors appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

// --- STATUS BADGE ---
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    published: "bg-green-500/10 text-green-400 border-green-500/20",
    draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-none border text-[10px] uppercase tracking-wider font-medium ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
};

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141821] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h3>
          <button onClick={onClose} className="text-[#9FA3B0] hover:text-white">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-[#0B0D10]/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
