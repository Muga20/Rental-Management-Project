import React from 'react';

interface ToggleSwitchProps {
  id: string;
  initialState?: boolean;
  onChange?: (isChecked: boolean) => void;
  bgColor1?: string; // Background color prop
  bgColor2?:string
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  initialState = false,
  onChange,
  bgColor1,
  bgColor2, 
}) => {
  const [isChecked, setIsChecked] = React.useState(initialState);

  const handleChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onChange && onChange(newState);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={isChecked}
            onChange={handleChange}
          />
          <div
            className={`block h-8 w-14 rounded-full ${bgColor1} dark:bg-[#5A616B] ${
              isChecked ? `!right-1 !translate-x-full ${bgColor2} dark:!bg-white` : ''
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
