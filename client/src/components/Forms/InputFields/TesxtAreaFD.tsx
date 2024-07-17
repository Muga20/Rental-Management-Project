import React, { ChangeEventHandler } from 'react';

interface TextFDProps {
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  bio?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  readOnly?: boolean;
}

const TextFDProp: React.FC<TextFDProps> = ({
  name,
  id,
  placeholder,
  rows,
  defaultValue,
  className,
  value,
  onChange,
  readOnly,
}) => {
  return (
    <div>
      <textarea
        className={className}
        name={name}
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        defaultValue={defaultValue}
      ></textarea>
    </div>
  );
};

export default TextFDProp;
