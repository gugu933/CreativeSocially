import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import shopifyClient from '../lib/shopify';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState(new Array(6).fill(false));
  const { addToCart, isLoading } = useCart();
  
  // Add form state
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
    company: '',
    description: ''
  });

  // Add form handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:info@creativesocially.com?subject=New Contact Request from ${formData.firstName}&body=Name: ${formData.firstName}%0D%0APhone: ${formData.phone}%0D%0AEmail: ${formData.email}%0D%0ACompany: ${formData.company}%0D%0A%0D%0ADescription:%0D%0A${formData.description}`;
    window.location.href = mailtoLink;
    setIsPopupOpen(false);
    setFormData({
      firstName: '',
      phone: '',
      email: '',
      company: '',
      description: ''
    });
  };

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
    let hasReached100 = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasReached100) {
            isSectionInView = true;
            startScroll = window.scrollY;
            sectionHeight = progressSection.offsetHeight;
            setProgress(0);
            lastProgress = 0;
          } else if (!entry.isIntersecting && hasReached100) {
            isSectionInView = false;
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(progressSection);

    const handleScroll = () => {
      if (!isSectionInView || hasReached100) return;
      
      const currentScroll = window.scrollY;
      const rawProgress = ((currentScroll - startScroll) / sectionHeight) * 100;
      
      // Smooth out the progress calculation
      const targetProgress = Math.max(0, Math.min(100, rawProgress));
      const smoothProgress = lastProgress + (targetProgress - lastProgress) * 0.1;
      
      lastProgress = smoothProgress;
      
      if (smoothProgress >= 100) {
        hasReached100 = true;
        setProgress(100);
      } else {
        setProgress(smoothProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Add these styles to the existing styles in your CSS or tailwind.config.js
  const styles = `
    @keyframes border-rotate {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 200% 50%;
      }
    }

    .animate-border-rotate {
      animation: border-rotate 3s linear infinite;
    }

    @keyframes border-line {
      0% {
        width: 0;
        height: 2px;
        top: 0;
        left: 0;
      }
      20% {
        width: 100%;
        height: 2px;
        top: 0;
        left: 0;
      }
      20.1% {
        width: 2px;
        height: 0;
        top: 0;
        right: 0;
        left: auto;
      }
      40% {
        width: 2px;
        height: 100%;
        top: 0;
        right: 0;
        left: auto;
      }
      40.1% {
        width: 0;
        height: 2px;
        bottom: 0;
        right: 0;
        top: auto;
        left: auto;
      }
      60% {
        width: 100%;
        height: 2px;
        bottom: 0;
        right: auto;
        top: auto;
        left: 0;
      }
      60.1% {
        width: 2px;
        height: 0;
        bottom: auto;
        right: auto;
        top: 100%;
        left: 0;
      }
      80% {
        width: 2px;
        height: 100%;
        top: 0;
        right: auto;
        bottom: auto;
        left: 0;
      }
      80.1% {
        width: 0;
        height: 2px;
        top: 0;
        left: 0;
      }
      100% {
        width: 0;
        height: 2px;
        top: 0;
        left: 0;
      }
    }

    .animate-border-line::before {
      content: '';
      position: absolute;
      background-color: var(--primary-color);
      animation: border-line 1.5s linear infinite;
    }
  `;

  return (
    <>
      <style>{styles}</style>
    <div className="min-h-screen text-text">
      {/* Banner Section */}
      <section className="relative h-[95vh] flex items-start overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {/* Fixed Banner Shape */}
          <div className="absolute inset-0 overflow-hidden" 
               style={{
                   clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)'
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
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white" 
               style={{
                 clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 40%)'
               }}>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 lg:px-16 relative" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-2 lg:mt-24 lg:ml-[120px] relative">
              <h1 
                onClick={scrollToTop}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-10 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent leading-[1.1] cursor-pointer hover:opacity-90 transition-opacity max-w-[600px]"
              >
                Effortless storytelling exponential impact
              </h1>
              <p className="text-lg sm:text-xl text-black/80 mb-8 max-w-md">
                Transform your brand with our professional UGC content creation services. 
                We bring your products to life with creativity and precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="relative px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 text-base font-medium shadow-md hover:shadow-lg"
                >
                  Products
                </button>
                <button 
                  onClick={() => setIsPopupOpen(true)}
                  className="px-6 py-2 bg-white/90 text-black rounded-lg border border-black/20 hover:bg-gray-50/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm font-medium"
                >
                  Not sure? Contact Us
                </button>
              </div>
            </div>

            {/* Right Content - Phone UI Card */}
            <div 
              onClick={scrollToTop}
              className="hidden lg:block lg:col-span-1 cursor-pointer hover:opacity-90 transition-opacity relative"
              style={{ zIndex: 1 }}
            >
              {/* White Card Background with Steps */}
              <div className="absolute top-20 left-[20px] w-[600px] h-auto min-h-[500px] bg-white/90 rounded-[32px] shadow-lg transform rotate-[-0deg] p-6 sm:p-8 lg:p-10" style={{ zIndex: 1 }}>
                <div className="relative h-full pl-[110px] lg:pl-[160px]">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">How it works</h3>
                  <div className="space-y-6 lg:space-y-8">
                    {/* Step 1 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">Choose your <span className="text-primary border-b-2 border-primary">content</span></h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Select your perfect content package</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">Share your <span className="text-primary border-b-2 border-primary">vision</span></h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Tell us your brand story and goals</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900"><span className="text-primary border-b-2 border-primary">We</span> create & strategize</h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Professional content with latest trends</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">4</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900"><span className="text-primary border-b-2 border-primary">Voila!</span> Ready to post</h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Your optimized content delivered</p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">5</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">Cash in your <span className="text-primary border-b-2 border-primary">profits</span></h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Watch your revenue soar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone UI */}
              <div className="relative w-[260px] h-[520px] mx-auto lg:ml-[-70px] lg:mr-auto lg:mt-32" style={{ zIndex: 1 }}>
                {/* Phone Case */}
                <div className="absolute inset-0 bg-black rounded-[40px] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.45)]">
                  {/* Screen */}
                  <div className="absolute inset-[3px] bg-white rounded-[32px] overflow-hidden">
                    {/* TikTok Video */}
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      src="/assets/videos/tiktok-demo.MP4"
                    />
                  </div>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[20px] bg-black rounded-b-[15px]"></div>
                  {/* Home Indicator */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-black/20 rounded-full mb-2"></div>
                  {/* Volume Buttons */}
                  <div className="absolute left-[-3px] top-[85px] w-[3px] h-[50px] bg-black rounded-l-sm"></div>
                  <div className="absolute left-[-3px] top-[155px] w-[3px] h-[50px] bg-black rounded-l-sm"></div>
                  {/* Power Button */}
                  <div className="absolute right-[-3px] top-[120px] w-[3px] h-[70px] bg-black rounded-r-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <div className="relative py-16 mt-16 bg-white">
        <div className="container mx-auto px-4 lg:px-16">
          {/* Company Logos */}
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-12 text-center relative">
              Our Dedicated Clients
              <div className="w-24 h-0.5 bg-primary mx-auto mt-4 rounded-full"></div>
            </h3>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 w-full max-w-[1000px]">
              {/* Logo 1 */}
              <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center">
                <img 
                  src="/assets/images/clients/company1-logo.svg" 
                  alt="Company 1"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Logo 2 */}
              <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center">
                <img 
                  src="/assets/images/clients/company2-logo.png" 
                  alt="Company 2"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Logo 3 */}
              <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center">
                <img 
                  src="/assets/images/clients/company3-logo.webp" 
                  alt="Company 3"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Logo 4 */}
              <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center">
                <img 
                  src="/assets/images/clients/company4-logo.webp" 
                  alt="Company 4"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Logo 5 */}
              <div className="w-32 sm:w-40 h-16 sm:h-20 flex items-center justify-center">
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

    {/* Creative UGC Section */}
    <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Creative Collage */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-3 max-w-[500px] mx-auto">
              {/* Main Large Image */}
                <div className="col-span-2 row-span-2 aspect-square rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-peach/20 opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img 
                    src="/assets/images/collage/main-image.webp"
                    alt="Main creative content"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

              {/* Smaller Images */}
                <div className="aspect-square rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-orange/20 to-primary/20 opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img 
                    src="/assets/images/collage/small-image-1.jpg"
                    alt="Creative content 1"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
                
                <div className="aspect-square rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-orange/20 opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img 
                    src="/assets/images/collage/small-image-2.jpg"
                    alt="Creative content 2"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

              {/* Bottom Row */}
                <div className="aspect-square rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-peach/20 to-primary/20 opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img 
                    src="/assets/images/collage/small-image-3.jpg"
                    alt="Creative content 3"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

                <div className="aspect-square rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-pink/20 opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img 
                    src="/assets/images/collage/small-image-4.jpg"
                    alt="Creative content 4"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

                <div className="aspect-square rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-orange/20 to-secondary-peach/20 opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img 
                    src="/assets/images/collage/small-image-5.jpeg"
                    alt="Creative content 5"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
              </div>
          </div>

          {/* Right Side - Text Content */}
          <div>
              <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Crafting Digital Stories</h2>
              <p className="text-lg text-gray-600 mb-8">
                We transform ordinary products into extraordinary narratives. Through the lens of creativity, 
                we capture moments that resonate with your audience, turning viewers into customers and 
                customers into advocates.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">20+</div>
                  <div className="text-sm text-gray-600">Videos Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">1M+</div>
                  <div className="text-sm text-gray-600">Views Generated</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>

    {/* Featured Collection */}
    <section className="py-16">
        <div className="container mx-auto px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => window.location.href = '/products'}
            >
              {/* Product Image */}
                <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
                </div>

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
        <div className="container mx-auto px-4 lg:px-16">
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
        <div className="container mx-auto px-4 lg:px-16 relative z-10">
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
                  className="aspect-[4/5] bg-white rounded-2xl shadow-lg overflow-hidden relative"
                >
                  <img 
                    src="/assets/images/team/team-1.jpg"
                    alt="Gustav Emil Aller"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-10">
                    <h3 className="text-white font-medium text-lg">Gustav Emil Aller</h3>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                  className="aspect-[4/5] bg-white rounded-2xl shadow-lg overflow-hidden translate-y-8 relative"
                >
                  <img 
                    src="/assets/images/team/team-2.jpg"
                    alt="Hannah Kjølby Lysager"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-secondary-orange/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-10">
                    <h3 className="text-white font-medium text-lg">Hannah Kjølby Lysager</h3>
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
        <div className="container mx-auto px-4 lg:px-16">
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
              onSubmit={handleSubmit}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe your situation</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-gray-900 placeholder-gray-400 min-h-[100px] resize-y"
                  placeholder="Tell us about your needs and what you're looking for..."
                required
                />
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

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600">
                Find answers to common questions about our services and process.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  question: "What type of content do you create?",
                  answer: "We specialize in creating engaging UGC (User Generated Content), product videos, social media content, and brand storytelling that resonates with your target audience."
                },
                {
                  question: "How long does a typical project take?",
                  answer: "Project timelines vary depending on scope and requirements. Typically, a standard content package can be delivered within 1-2 weeks, while larger campaigns might take 2-4 weeks."
                },
                {
                  question: "Do you offer ongoing content creation services?",
                  answer: "Yes! We offer flexible subscription packages for regular content creation, ensuring your brand maintains a consistent and engaging social media presence."
                },
                {
                  question: "What industries do you work with?",
                  answer: "We work with a diverse range of industries including e-commerce, fashion, beauty, tech, food & beverage, and lifestyle brands. Our adaptable approach allows us to create compelling content for any industry."
                },
                {
                  question: "What's included in your content packages?",
                  answer: "Our packages typically include concept development, professional filming/photography, editing, music licensing, and delivery in multiple formats optimized for different social media platforms."
                },
                {
                  question: "Can you help with content strategy?",
                  answer: "Absolutely! We offer strategic consulting to help you plan your content calendar, identify key messaging opportunities, and maximize the impact of your social media presence."
                }
              ].map((item, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0">
                  <button
                    onClick={() => {
                      const newState = [...openFaqs];
                      newState[index] = !newState[index];
                      setOpenFaqs(newState);
                    }}
                    className="w-full py-4 flex justify-between items-center text-left hover:text-primary transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 group-hover:text-primary">{item.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${openFaqs[index] ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqs[index] && (
                    <div className="pb-4">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsPopupOpen(false)}
          ></div>
          
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send it and we will reply!😎</h3>
            
            <form 
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe your situation</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-black min-h-[100px] resize-y"
                  placeholder="Tell us about your needs and what you're looking for..."
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
  </div>
  </>
);
};

export default Home; 