import { ButtonHTMLAttributes, ReactNode } from 'react';
import './styles.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner"></span>
      ) : (
        children
      )}
    </button>
  );
};
