import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Get the first variant's price
  const price = product.variants[0]?.price?.amount || '';
  const formattedPrice = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(price);

  // Get the first image URL
  const imageUrl = product.images[0]?.src || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden group">
          {/* Placeholder if image fails to load */}
          <div className="absolute inset-0 bg-gray-100" />
          
          {/* Product Image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.description}</p>
          <p className="text-primary font-medium">{formattedPrice}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 