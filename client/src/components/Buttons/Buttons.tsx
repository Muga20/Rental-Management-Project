import React from 'react';

interface ButtonProps {
  className: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.FormEvent) => void; // Allow React.FormEvent parameter
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  type = 'button',
  onClick,
}) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

interface ButtonsProps {
  buttons: { className: string; label: string; onClick?: (e: React.FormEvent) => void }[]; // Allow React.FormEvent parameter
}

const Buttons: React.FC<ButtonsProps> = ({ buttons }) => {
  return (
    <div>
      {buttons.map((button, index) => (
        <Button
          key={index}
          className={button.className}
          type="button"
          onClick={button.onClick}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default Buttons;
