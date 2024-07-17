import React, { ChangeEventHandler } from 'react';

interface InputFDProps {
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  readOnly?: boolean;
  
}

const InputFDProp: React.FC<InputFDProps> = ({
  type,
  name,
  id,
  placeholder,
  defaultValue,
  className,
  value,
  onChange,
  readOnly,
}) => {
  return (
    <div>
      <input
        className={className}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default InputFDProp;
