import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import shopifyClient from '../lib/shopify';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [progress, setProgress] = useState(0);
  const { addToCart, isLoading } = useCart();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await shopifyClient.product.fetchAll();
        // Find subscription product (assuming it has "subscription" in the title)
        const subscription = products.find(p => 
          p.title.toLowerCase().includes('subscription') || 
          p.productType.toLowerCase().includes('subscription')
        );
        setSubscriptionPlan(subscription);
        // Filter out subscription from regular products
        const regularProducts = products.filter(p => p !== subscription);
        setProducts(regularProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const progressSection = document.getElementById('progress-section');
    if (!progressSection) return;

    let startScroll = 0;
    let sectionHeight = 0;
    let isSectionInView = false;
    let lastProgress = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isSectionInView = true;
            startScroll = window.scrollY;
            sectionHeight = progressSection.offsetHeight;
            setProgress(0);
            lastProgress = 0;
          } else {
            isSectionInView = false;
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(progressSection);

    const handleScroll = () => {
      if (!isSectionInView) return;
      
      const currentScroll = window.scrollY;
      const rawProgress = ((currentScroll - startScroll) / sectionHeight) * 100;
      
      // Smooth out the progress calculation
      const targetProgress = Math.max(0, Math.min(100, rawProgress));
      const smoothProgress = lastProgress + (targetProgress - lastProgress) * 0.1;
      
      lastProgress = smoothProgress;
      setProgress(smoothProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen text-text">
      {/* Banner Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          {/* Fixed Banner Shape */}
          <div className="absolute inset-0 overflow-hidden" 
               style={{
                 clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 90%)'
               }}>
            {/* Flowing Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-secondary-orange bg-[length:400%_400%] animate-gradient-flow">
              {/* Floating Bubbles */}
              <motion.div
                className="absolute w-48 h-48 rounded-full animate-gradient-bubble"
                style={{
                  background: 'linear-gradient(-45deg, rgba(255, 51, 102, 0.3), rgba(255, 107, 77, 0.3), rgba(255, 180, 67, 0.3))',
                  backgroundSize: '200% 200%',
                  left: '10%',
                  top: '20%',
                  opacity: '0.06',
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.06, 0.02, 0.06],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-56 h-56 rounded-full animate-gradient-bubble"
                style={{
                  background: 'linear-gradient(-45deg, rgba(255, 180, 67, 0.3), rgba(255, 245, 61, 0.3), rgba(61, 255, 255, 0.3))',
                  backgroundSize: '200% 200%',
                  right: '15%',
                  top: '30%',
                  opacity: '0.05',
                }}
                animate={{
                  x: [-100, 0, -100],
                  y: [50, 0, 50],
                  scale: [1, 1.1, 1],
                  opacity: [0.05, 0.02, 0.05],
                }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-40 h-40 rounded-full animate-gradient-bubble"
                style={{
                  background: 'linear-gradient(-45deg, rgba(61, 255, 255, 0.3), rgba(255, 51, 102, 0.3), rgba(255, 107, 77, 0.3))',
                  backgroundSize: '200% 200%',
                  left: '30%',
                  bottom: '20%',
                  opacity: '0.055',
                }}
                animate={{
                  x: [50, -50, 50],
                  y: [-30, 30, -30],
                  scale: [1, 1.15, 1],
                  opacity: [0.055, 0.02, 0.055],
                }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
          
          {/* White Bottom Section */}
          <div className="absolute inset-0 bg-white" 
               style={{
                 clipPath: 'polygon(0 80%, 100% 60%, 100% 100%, 0 100%)'
               }}>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <h1 
                onClick={scrollToTop}
                className="text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent leading-tight cursor-pointer hover:opacity-90 transition-opacity"
              >
                Effortless storytelling exponential impact
              </h1>
              <p className="text-xl text-black/80 mb-12 max-w-2xl">
                Transform your brand with our professional UGC content creation services. 
                We bring your products to life with creativity and precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="px-10 py-3 bg-secondary-orange text-white rounded-lg hover:bg-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base font-medium"
                >
                  Products
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="px-10 py-3 bg-white text-black rounded-lg border-2 border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base font-medium"
                >
                  Contact Us
                </button>
              </div>
            </div>
            {/* Right Content - Phone UI Card */}
            <div 
              onClick={scrollToTop}
              className="hidden lg:block lg:col-span-1 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="relative w-[260px] h-[520px] mx-auto lg:ml-auto lg:mr-0">
                {/* Phone Case */}
                <div className="absolute inset-0 bg-white rounded-[2.8rem] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.45)] border-[14px] border-gray-900">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[22px] bg-gray-900 rounded-b-3xl"></div>
                  {/* Screen */}
                  <div className="absolute inset-[14px] bg-white rounded-[2.3rem]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <div className="relative h-32 -mt-16 mb-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-4">
            {/* Company Logos */}
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <h3 className="text-base text-gray-500 mb-8 font-medium relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[1px] after:bg-gray-300">Trusted by partners</h3>
              <div className="flex justify-between w-[800px]">
                {/* Logo 1 */}
                <div className="w-32 h-16 flex items-center justify-center">
                  <img 
                    src="/assets/images/clients/company1-logo.svg" 
                    alt="Company 1"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Logo 2 */}
                <div className="w-32 h-16 flex items-center justify-center">
                  <img 
                    src="/assets/images/clients/company2-logo.png" 
                    alt="Company 2"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Logo 3 */}
                <div className="w-32 h-16 flex items-center justify-center">
                  <img 
                    src="/assets/images/clients/company3-logo.webp" 
                    alt="Company 3"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Logo 4 */}
                <div className="w-32 h-16 flex items-center justify-center">
                  <img 
                    src="/assets/images/clients/company4-logo.webp" 
                    alt="Company 4"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Logo 5 */}
                <div className="w-40 h-20 flex items-center justify-center">
                  <img 
                    src="/assets/images/clients/company5-logo.png" 
                    alt="Company 5"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative UGC Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Creative Collage */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-3 max-w-[500px] mx-auto">
                {/* Main Large Image */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="col-span-2 row-span-2 aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-peach/20 group-hover:opacity-0 transition-opacity"></div>
                </motion.div>

                {/* Smaller Images */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-orange/20 to-primary/20 group-hover:opacity-0 transition-opacity"></div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-orange/20 group-hover:opacity-0 transition-opacity"></div>
                </motion.div>

                {/* Bottom Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-peach/20 to-primary/20 group-hover:opacity-0 transition-opacity"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-pink/20 group-hover:opacity-0 transition-opacity"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-orange/20 to-secondary-peach/20 group-hover:opacity-0 transition-opacity"></div>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold mb-6 text-gray-900">Crafting Digital Stories</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We transform ordinary products into extraordinary narratives. Through the lens of creativity, 
                  we capture moments that resonate with your audience, turning viewers into customers and 
                  customers into advocates.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">300+</div>
                    <div className="text-sm text-gray-600">Videos Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">98%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">50M+</div>
                    <div className="text-sm text-gray-600">Views Generated</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our range of professional content creation services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: "Social Media Management",
                description: "Complete social media management including content creation, scheduling, and engagement.",
                image: "/images/social-media.jpg"
              },
              {
                id: 2,
                title: "Content Creation",
                description: "Professional content creation for all your social media platforms and marketing needs.",
                image: "/images/content-creation.jpg"
              },
              {
                id: 3,
                title: "Brand Strategy",
                description: "Comprehensive brand strategy development to help your business grow and succeed.",
                image: "/images/brand-strategy.jpg"
              }
            ].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => window.location.href = '/products'}
              >
                {/* Product Image */}
                <motion.div 
                  className="aspect-[4/3] relative bg-gray-100 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 relative inline-block group-hover:after:content-[''] group-hover:after:absolute group-hover:after:left-0 group-hover:after:bottom-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-primary group-hover:after:transition-all group-hover:after:duration-300">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Bar Section */}
      <section id="progress-section" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              We are always 100% on budget, <span className="text-secondary-orange">don't worry</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                style={{ width: `${progress}%` }}
                className="absolute inset-y-0 left-0 bg-secondary-orange rounded-full"
                transition={{ 
                  duration: 0.3,
                  ease: "linear"
                }}
              />
            </div>
            <div className="text-center mt-8">
              <div className="text-6xl font-bold text-gray-900">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 relative">
        {/* Background with diagonal cut */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gray-50" 
               style={{
                 clipPath: 'polygon(0 15%, 100% 0%, 100% 100%, 0% 100%)'
               }}>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Creative Socially, where passion meets innovation in brand storytelling. Based in vibrant Copenhagen, we're a dynamic duo dedicated to transforming how brands connect with their audience.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our home studio is more than just a space—it's a creative laboratory where we craft compelling narratives through professional ad campaigns, engaging product videos, and striking photography.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Studio</h3>
                  <p className="text-gray-600">A creative haven where ideas come to life through state-of-the-art equipment and innovative techniques.</p>
                </div>
                <div className="border-l-4 border-secondary-orange pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Network</h3>
                  <p className="text-gray-600">A diverse roster of talent speaking multiple languages, including our beloved animal models.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="aspect-[4/5] bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="w-full h-full bg-gray-100 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="aspect-[4/5] bg-white rounded-2xl shadow-lg overflow-hidden translate-y-8"
                >
                  <div className="w-full h-full bg-gray-100 relative group">
                    <div className="absolute inset-0 bg-gradient-to-bl from-secondary-orange/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                  </div>
                </motion.div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-orange/10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600">
                Ready to transform your brand's story? We'd love to hear from you.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
              action={`mailto:info@creativesocially.com`}
              method="POST"
              encType="text/plain"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-gray-900 placeholder-gray-400" 
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-gray-900 placeholder-gray-400" 
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone number (optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-gray-900 placeholder-gray-400" 
                  placeholder="+45 XX XX XX XX"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-gray-900 placeholder-gray-400" 
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-500">
                  We'll get back to you within 24 hours
                </p>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary-orange transition-colors duration-300 flex items-center gap-2"
                >
                  Send Message
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.form>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <a href="mailto:info@creativesocially.com" className="text-primary hover:text-secondary-orange transition-colors">
                  info@creativesocially.com
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Copenhagen, Denmark</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 