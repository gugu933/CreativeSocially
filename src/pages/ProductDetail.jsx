import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import shopifyClient from '../lib/shopify';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isLoading, isInitialized } = useCart();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('Loading product with ID:', id);
        // Decode the URL-encoded ID
        const decodedId = decodeURIComponent(id);
        console.log('Decoded ID:', decodedId);
        
        const productData = await shopifyClient.product.fetch(decodedId);
        console.log('Product data received:', productData);
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        if (error.response) {
          console.error('Error response:', error.response);
        }
        setError(error.message || 'Failed to load product');
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = (variantId) => {
    console.log('Add to cart clicked:', { variantId, isInitialized });
    if (!isInitialized) {
      console.error('Cart not initialized');
      return;
    }
    console.log('Calling addToCart with variantId:', variantId);
    addToCart(variantId);
  };

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const variant = product.variants?.edges?.[0]?.node;

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-5xl font-bold mb-6 text-gray-900">{product.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-4 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="aspect-[4/3] relative bg-gray-100 rounded-xl overflow-hidden"
              >
                {product.images?.edges?.[0]?.node?.url && (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </motion.div>

              {/* Features and Delivery Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Product Features */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-secondary-peach/10 p-4 rounded-xl border border-secondary-peach/20"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Script Development</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Professional Model</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Location Scouting</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Two Formats</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Delivery Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-secondary-peach/10 p-4 rounded-xl border border-secondary-peach/20"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Info</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 text-sm">5-7 business days</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 text-sm">Quality guaranteed</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span className="text-gray-700 text-sm">Cloud storage</span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Add to Cart Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  onClick={() => handleAddToCart(variant?.id)}
                  disabled={isLoading || !isInitialized || !variant?.availableForSale}
                  className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 cursor-pointer ${
                    variant?.availableForSale
                      ? 'bg-primary text-white hover:bg-secondary-orange hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Adding...' : variant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
                </button>
              </motion.div>
            </div>

            {/* Right Column: Description and Price */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-6 rounded-xl h-fit"
            >
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {new Intl.NumberFormat('da-DK', {
                      style: 'currency',
                      currency: 'DKK'
                    }).format(parseFloat(variant?.price?.amount || 0))}
                  </span>
                  <span className="text-xl font-semibold text-gray-900">DKK</span>
                  <span className="text-gray-500">/ item</span>
                </div>
                {!variant?.availableForSale && (
                  <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium mt-4">Sold Out</span>
                )}
              </div>
              <div 
                className="[&>h1]:text-3xl [&>h2]:text-2xl [&>h3]:text-xl [&>h4]:text-lg [&>h1]:font-bold [&>h2]:font-bold [&>h3]:font-semibold [&>h4]:font-semibold [&>h1]:mb-4 [&>h2]:mb-3 [&>h3]:mb-2 [&>h4]:mb-2 [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2 [&>strong]:font-bold [&>em]:italic [&>a]:text-primary [&>a]:underline hover:[&>a]:text-secondary-orange [&>img]:rounded-lg [&>img]:my-4 text-gray-700" 
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail; 