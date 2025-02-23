"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the cart item type
export interface CartItem {
  betNumber: number;
  usdValue: number;
}

// Define the context type
interface CartContextType {
  cart: CartItem[];
  orderedPlaced: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (betNumber: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  placeOrder: () => void;
  setOrderedPlaced: (items: CartItem[]) => void;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for CartProvider
interface CartProviderProps {
  children: ReactNode;
  initialCart?: CartItem[]; // Optional initial cart
}

// CartProvider component
export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  initialCart = [], // Default to an empty array if not provided
}) => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [orderedPlaced, setOrderedPlaced] = useState<CartItem[]>([]); // State for placed bets

  // Function to add an item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.betNumber === item.betNumber
      );

      if (existingItemIndex !== -1) {
        // If the item exists, create a new cart array with the updated item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          usdValue: item.usdValue,
        };
        return updatedCart;
      }

      // If the item does not exist, add it to the cart
      return [...prevCart, item];
    });
  };

  // Function to remove an item from the cart by betNumber
  const removeFromCart = (betNumber: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.betNumber !== betNumber)
    );
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Function to place the order and move items to the orderedPlaced list
  const placeOrder = () => {
    setOrderedPlaced((prevOrdered) => [...prevOrdered, ...cart]);
    clearCart(); // Clear the cart after placing the order
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orderedPlaced,
        addToCart,
        removeFromCart,
        clearCart,
        setCart,
        placeOrder,
        setOrderedPlaced,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
