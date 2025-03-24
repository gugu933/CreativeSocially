import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { isOpen, closeCart, cart, removeFromCart, updateQuantity, isLoading } = useCart();

  // Calculate prices
  const subtotal = cart?.cost?.subtotalAmount?.amount 
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0;
  const totalTax = cart?.cost?.totalTaxAmount?.amount 
    ? parseFloat(cart.cost.totalTaxAmount.amount)
    : 0;
  const total = cart?.cost?.totalAmount?.amount 
    ? parseFloat(cart.cost.totalAmount.amount)
    : 0;

  // Handle quantity change
  const handleQuantityChange = (lineId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(lineId, newQuantity);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart?.lines?.edges?.length > 0 ? (
                <div className="space-y-4">
                  {cart.lines.edges.map(({ node: line }) => (
                    <div key={line.id} className="flex items-center gap-4 border-b pb-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={line.merchandise.image?.url || '/placeholder.png'}
                          alt={line.merchandise.product?.title || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {line.merchandise.product?.title || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {line.merchandise.title}
                        </p>
                        <p className="text-lg font-medium text-primary mt-1">
                          {new Intl.NumberFormat('da-DK', {
                            style: 'currency',
                            currency: 'DKK'
                          }).format(parseFloat(line.merchandise.price.amount))}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 text-gray-700"
                          disabled={isLoading}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-gray-700">{line.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 text-gray-700"
                          disabled={isLoading}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(line.id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          disabled={isLoading}
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat('da-DK', {
                      style: 'currency',
                      currency: 'DKK'
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>VAT (25%)</span>
                  <span>
                    {new Intl.NumberFormat('da-DK', {
                      style: 'currency',
                      currency: 'DKK'
                    }).format(totalTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('da-DK', {
                      style: 'currency',
                      currency: 'DKK'
                    }).format(total)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => window.location.href = cart?.checkoutUrl}
                disabled={!cart?.lines?.edges?.length || isLoading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-secondary-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart; 