import { useState, useEffect } from 'react';
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

  // Separate subscription product from regular products
  const subscriptionProduct = products.find(p => 
    (p?.title?.toLowerCase() || '').includes('subscription') || 
    (p?.productType?.toLowerCase() || '').includes('subscription')
  );
  const regularProducts = products.filter(p => p !== subscriptionProduct);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white-100">
      {/* Banner Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-peach/30 to-secondary-orange/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6 text-gray-900">Transform Your Brand's Story</h1>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          {/* Subscription Plan */}
          {subscriptionProduct && (
            <div className="mb-16 -mt-12">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-[2rem] p-6 lg:p-8 shadow-2xl border-4 border-primary"
                >
                  {/* Popular Badge */}
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular Choice
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Column */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">Creative Socially Plus</h3>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">7.500</span>
                          <span className="text-xl font-semibold text-gray-900">DKK</span>
                          <span className="text-gray-500">/ month</span>
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">Unlock premium content creation and strategy</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <p className="text-gray-700 text-sm font-medium">Save over 30% compared to individual services</p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <p className="text-gray-700 text-sm font-medium">Cancel anytime - no long-term commitment</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleAddToCart(subscriptionProduct.variants?.edges?.[0]?.node?.id)}
                        disabled={isLoading || !isInitialized || !subscriptionProduct.variants?.edges?.[0]?.node?.availableForSale}
                        className="w-full bg-primary text-white py-3 px-6 rounded-xl text-base font-semibold hover:bg-primary/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? 'Adding...' : 'Get Started Now'}
                      </button>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">Everything you need to succeed:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <div>
                            <span className="text-gray-900 text-sm font-medium">Professional Content Creation</span>
                            <p className="text-gray-600 text-xs mt-0.5">4 videos & 10 photos monthly in our studio</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <div>
                            <span className="text-gray-900 text-sm font-medium">Multi-Platform Management</span>
                            <p className="text-gray-600 text-xs mt-0.5">TikTok, Instagram, LinkedIn coverage</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <div>
                            <span className="text-gray-900 text-sm font-medium">Strategic Consultation</span>
                            <p className="text-gray-600 text-xs mt-0.5">Monthly strategy sessions & optimization</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <div>
                            <span className="text-gray-900 text-sm font-medium">Creative Freedom</span>
                            <p className="text-gray-600 text-xs mt-0.5">Choose your creators & style preferences</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <div>
                            <span className="text-gray-900 text-sm font-medium">Quality Assurance</span>
                            <p className="text-gray-600 text-xs mt-0.5">Content review cycles & premium support</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.length > 0 && (
            <div className="relative">
              {/* Scroll Indicator */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
              
              <div className="text-center mb-16">
                {/* Scroll Indicator Arrow */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center text-gray-400 mb-12"
                >
                  <span className="text-sm mb-2">Explore more options</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </motion.div>

                <h2 className="text-5xl font-bold text-gray-900 mb-4">On-Demand Services</h2>
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 mb-24">
                {regularProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-white rounded-[2rem] p-6 shadow-xl border-2 border-gray-100 hover:border-gray-200 transition-all"
                  >
                    {/* Product Image */}
                    <div className="aspect-[4/3] relative bg-gray-100 rounded-xl overflow-hidden mb-6">
                      {product.images?.edges?.[0]?.node?.url && (
                        <img
                          src={product.images.edges[0].node.url}
                          alt={product.title}
                          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Product Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('da-DK', {
                              style: 'currency',
                              currency: 'DKK'
                            }).format(parseFloat(product.variants?.edges?.[0]?.node?.price?.amount || 0))}
                          </span>
                          <span className="text-gray-500 text-xs">/ item</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {product.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => window.location.href = `/products/${encodeURIComponent(product.id)}`}
                          className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                        >
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleAddToCart(product.variants?.edges?.[0]?.node?.id)}
                          disabled={isLoading || !isInitialized || !product.variants?.edges?.[0]?.node?.availableForSale}
                          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg ${
                            product.variants?.edges?.[0]?.node?.availableForSale
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isLoading ? 'Adding...' : product.variants?.edges?.[0]?.node?.availableForSale ? 'Add to Cart' : 'Sold Out'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products; 