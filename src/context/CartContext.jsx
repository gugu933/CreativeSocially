import { createContext, useContext, useState, useEffect } from 'react';
import shopifyClient from '../lib/shopify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart
  useEffect(() => {
    const createNewCart = async () => {
      try {
        setIsLoading(true);
        console.log('Creating new cart...');
        const newCart = await shopifyClient.cart.create();
        console.log('New cart created:', newCart);
        setCart(newCart);
        // Save cart ID to localStorage
        localStorage.setItem('cartId', newCart.id);
        setIsInitialized(true);
        console.log('Cart initialized:', newCart.id);
      } catch (error) {
        console.error('Error creating cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const cartId = localStorage.getItem('cartId');
    console.log('Existing cart ID:', cartId);
    if (cartId) {
      // Fetch existing cart
      shopifyClient.cart.fetch(cartId)
        .then((existingCart) => {
          console.log('Fetched existing cart:', existingCart);
          if (existingCart) {
            setCart(existingCart);
            setIsInitialized(true);
            console.log('Using existing cart:', existingCart.id);
          } else {
            createNewCart();
          }
        })
        .catch((error) => {
          console.error('Error fetching cart:', error);
          createNewCart();
        });
    } else {
      createNewCart();
    }
  }, []);

  // Add to cart
  const addToCart = async (variantId, quantity = 1) => {
    console.log('Adding to cart:', { variantId, quantity, isInitialized, cart });
    if (!isInitialized) {
      console.error('Cart not initialized');
      return;
    }

    if (!cart) {
      console.error('No cart available');
      return;
    }

    setIsLoading(true);
    try {
      const lineItemsToAdd = [{ merchandiseId: variantId, quantity }];
      console.log('Adding line items:', lineItemsToAdd);
      const updatedCart = await shopifyClient.cart.addLines(cart.id, lineItemsToAdd);
      console.log('Cart updated:', updatedCart);
      setCart(updatedCart);
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (lineItemId) => {
    if (!isInitialized) {
      console.error('Cart not initialized');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = await shopifyClient.cart.removeLines(cart.id, [lineItemId]);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (lineItemId, quantity) => {
    if (!isInitialized) {
      console.error('Cart not initialized');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = await shopifyClient.cart.updateLines(cart.id, [
        { id: lineItemId, quantity },
      ]);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  const cartSize = cart?.lines?.edges?.reduce((total, edge) => total + edge.node.quantity, 0) || 0;
  const cartTotal = cart?.cost?.totalAmount?.amount || '0.00';

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        proceedToCheckout,
        cartSize,
        cartTotal,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 