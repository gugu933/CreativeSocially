import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import shopifyClient from '../lib/shopify';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isLoading, isInitialized } = useCart();

  const handleAddToCart = (variantId) => {
    console.log('Add to cart clicked:', { variantId, isInitialized });
    if (!isInitialized) {
      console.error('Cart not initialized');
      return;
    }
    console.log('Calling addToCart with variantId:', variantId);
    addToCart(variantId);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading products...');
        const products = await shopifyClient.product.fetchAll();
        console.log('Products loaded:', JSON.stringify(products, null, 2));
        // Log the first product's structure
        if (products && products.length > 0) {
          console.log('First product structure:', {
            id: products[0].id,
            title: products[0].title,
            variants: products[0].variants
          });
        }
        if (!products || products.length === 0) {
          throw new Error('No products found in the store');
        }
        setProducts(products);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        // Check if it's a network error
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          setError('Unable to connect to the store. Please check your internet connection and try again.');
        } else {
          setError(error.message || 'Failed to load products. Please try again later.');
        }
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary-orange transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="py-32 bg-secondary-peach/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-secondary-orange/5"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6 text-gray-800">Our Services</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover our range of content creation services designed to elevate your brand
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                {/* Product Image */}
                <div className="aspect-[4/3] relative bg-gray-100">
                  {product.images?.edges?.[0]?.node?.url && (
                    <img
                      src={product.images.edges[0].node.url}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('da-DK', {
                        style: 'currency',
                        currency: 'DKK'
                      }).format(parseFloat(product.variants?.edges?.[0]?.node?.price?.amount || 0))}
                    </span>
                    {!product.variants?.edges?.[0]?.node?.availableForSale && (
                      <span className="text-red-500 text-sm font-medium">Sold Out</span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product.variants?.edges?.[0]?.node?.id)}
                      disabled={isLoading || !isInitialized || !product.variants?.edges?.[0]?.node?.availableForSale}
                      className={`w-full py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${
                        product.variants?.edges?.[0]?.node?.availableForSale
                          ? 'bg-primary text-white hover:bg-secondary-orange'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? 'Adding...' : product.variants?.edges?.[0]?.node?.availableForSale ? 'Add to Cart' : 'Sold Out'}
                    </button>
                    <Link
                      to={`/products/${encodeURIComponent(product.id)}`}
                      onClick={(e) => {
                        console.log('Product ID being passed:', product.id);
                      }}
                      className="block w-full py-3 bg-white text-primary border border-primary rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products; 