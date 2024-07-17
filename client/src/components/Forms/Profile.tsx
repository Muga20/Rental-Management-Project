import React from 'react';

interface ProfileProps {
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  bio?: string;
}

const ProfileProp: React.FC<ProfileProps> = ({
  type,
  name,
  id,
  placeholder,
  defaultValue,
  rows,
  bio,
}) => {
  return (
    <div>
      <input
        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />

      <textarea
        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
        name={name}
        id={id}
        rows={rows}
        placeholder={placeholder}
        defaultValue={bio}
      ></textarea>
    </div>
  );
};

export default ProfileProp;
