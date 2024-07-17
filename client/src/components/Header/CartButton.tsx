import React, { useEffect, useRef, useState } from 'react';
import {  useNavigate } from 'react-router-dom';

import { FaCartArrowDown } from 'react-icons/fa6';
import { UseCartContext } from '../../hooks/UseCartContext';

const CartButton = () => {
  const { cartItems } = UseCartContext(); // Corrected from `useCart`
  const [notifying, setNotifying] = useState(false);
  const navigate = useNavigate();

  const trigger = useRef(null);

  useEffect(() => {
    setNotifying(cartItems.length > 0);
  }, [cartItems]);

  const handleCartClick = () => {
    navigate('/dashboard/checkout');
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <li className="relative">
      <button
        ref={trigger}
        onClick={handleCartClick}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span
          className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${
            notifying ? 'inline' : 'hidden'
          }`}
        >
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>
        <FaCartArrowDown />
      </button>
    </li>
  );
};

export default CartButton;
