import React, { createContext, useReducer, useEffect } from "react";

// Create a context to hold cart data and actions
export const CartContext = createContext({
  cartItems: [],
  addToCart: (item) => {},
  removeFromCart: (id) => {},
});

const CART_LOCAL_STORAGE_KEY = "cartItems";

// Define a reducer function to manage cart state
export const cartReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_CART":
      // Initialize the cart state with items from local storage
      return {
        cartItems: action.payload,
      };

    case "ADD_TO_CART":
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item: { id: any; }) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        const updatedCartItems = state.cartItems.map((item: { quantity: number; }, index: any) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          } else {
            return item;
          }
        });

        // Update local storage with the updated cart
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

        return {
          cartItems: updatedCartItems,
        };
      } else {
        // If the item doesn't exist, add it to the cart with a quantity of 1
        const updatedCartItems = [
          ...state.cartItems,
          { ...newItem, quantity: 1 },
        ];

        // Update local storage with the updated cart
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

        return {
          cartItems: updatedCartItems,
        };
      }

    case "REMOVE_FROM_CART":
      // Remove an item from the cart based on its ID
      const updatedCartItemsAfterRemoval = state.cartItems.filter(
        (item: { id: any; }) => item.id !== action.payload
      );

      // Update local storage with the updated cart
      localStorage.setItem(
        CART_LOCAL_STORAGE_KEY,
        JSON.stringify(updatedCartItemsAfterRemoval)
      );

      return {
        cartItems: updatedCartItemsAfterRemoval,
      };

    case "CLEAR_CART":
      // Clear the entire cart and remove it from local storage
      localStorage.removeItem(CART_LOCAL_STORAGE_KEY);
      return {
        cartItems: [],
      };

    default:
      return state;
  }
};

// Create a CartContextProvider component to manage cart state and actions
export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [],
  });

  // Initialize the cart state with items from local storage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
    if (storedCartItems) {
      dispatch({ type: "INITIALIZE_CART", payload: JSON.parse(storedCartItems) });
    }
  }, []);

  // Define functions to add and remove items from the cart
  const addToCart = (item: any) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (id: any) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  // Provide the cart state and actions to children components through context
  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        cartItems: state.cartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
