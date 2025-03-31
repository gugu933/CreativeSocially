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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!products) {
          console.log('No products found');
          return;
        }
        
        // Find subscription product (assuming it has "subscription" in the title)
        const subscription = products.find(p => 
          (p?.title?.toLowerCase() || '').includes('subscription') || 
          (p?.productType?.toLowerCase() || '').includes('subscription')
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
            if (!hasReached100) {
              setProgress(lastProgress);
            }
          } else {
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
      
      // Smooth out the progress calculation and ensure it only goes up
      const targetProgress = Math.max(0, Math.min(100, rawProgress));
      const smoothProgress = Math.max(lastProgress, lastProgress + (targetProgress - lastProgress) * 0.1);
      
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

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .animate-scroll {
      animation: scroll 30s linear infinite;
      display: flex;
      gap: 2rem;
      padding: 0 1rem;
      will-change: transform;
      width: max-content;
    }

    .logo-container {
      display: flex;
      gap: 2rem;
      padding: 0 1rem;
      width: max-content;
    }
  `;

  return (
    <>
      <style>{styles}</style>
    <div className="min-h-screen text-text overflow-x-hidden">
      {/* Banner Section */}
      <section className="relative min-h-[85vh] flex items-start overflow-hidden pb-32">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {/* Fixed Banner Shape */}
          <div className="absolute inset-0 overflow-hidden" 
               style={{
                   clipPath: 'polygon(100% 0, 100% 30%, 0 61%, 0 0)'
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
                 clipPath: 'polygon(0 85%, 100% 70%, 100% 100%, 0 100%)'
               }}>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 lg:px-16 relative" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-center">
            {/* Left Content */}
            <div className="lg:col-span-2 lg:mt-24 lg:ml-[120px] relative pt-24 lg:pt-0">
              <h1 
                onClick={scrollToTop}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-10 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent leading-[1.1] cursor-pointer hover:opacity-90 transition-opacity max-w-[600px]"
              >
                Content creation to grow your revenue
              </h1>
              <p className="text-lg sm:text-xl text-black/80 mb-8 max-w-md">
                Transform your brand with our professional content creation services. 
                We turn your products into powerful stories with inclusive casting and high-converting content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-0">
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
              <div className="absolute top-20 left-[20px] w-[600px] max-w-[90vw] h-auto min-h-[500px] bg-white/90 rounded-[32px] shadow-lg transform rotate-[-0deg] p-6 sm:p-8 lg:p-10" style={{ zIndex: 1 }}>
                <div className="relative h-full pl-[110px] lg:pl-[160px]">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">How it works</h3>
                  <div className="space-y-6 lg:space-y-8">
                    {/* Step 1 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">🎯 Pick a  <span className="text-primary border-b-2 border-primary">package</span></h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">We've got content options for every budget and goal.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">🗣️ Tell us your  <span className="text-primary border-b-2 border-primary">story</span></h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Tell us what you sell</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">
  🧠 <span className="text-primary border-b-2 border-primary">We</span> plan & Create
</h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">We produce professional content with latest trends</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">4</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">
  🚀 <span className="text-primary border-b-2 border-primary">Content</span>, ready to post
</h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">You get finished videos, ready to upload</p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-xl lg:text-2xl font-bold text-primary">5</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">💸 Get more <span className="text-primary border-b-2 border-primary">sales</span></h4>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">Watch likes, views, and orders roll in</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone UI */}
              <div className="relative w-[260px] h-[520px] mx-auto lg:ml-[-70px] lg:mr-auto lg:mt-24 mb-16" style={{ zIndex: 1 }}>
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
      <div className="relative py-16 bg-white mt-[-8rem] overflow-hidden">
        <div className="container mx-auto px-4 lg:px-16">
          {/* Company Logos */}
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-12 text-center relative">
              Our Dedicated Clients
              <div className="w-24 h-0.5 bg-primary mx-auto mt-4 rounded-full"></div>
            </h3>
            
            {/* Animated Logo Container */}
            <div className="relative w-full overflow-hidden">
              {/* First Row of Logos */}
              <div className="animate-scroll">
                {/* First set of logos */}
                <div className="logo-container">
                  {/* Logo 1 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company1-logo.svg" 
                      alt="Company 1"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 2 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company2-logo.png" 
                      alt="Company 2"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 3 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company3-logo.webp" 
                      alt="Company 3"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 4 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company4-logo.webp" 
                      alt="Company 4"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 5 */}
                  <div className="w-32 sm:w-40 h-16 sm:h-20 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company5-logo.png" 
                      alt="Company 5"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 6 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company6-logo.png" 
                      alt="Company 6"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 7 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company7-logo.png" 
                      alt="Company 7"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {/* Second set of logos */}
                <div className="logo-container">
                  {/* Logo 1 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company1-logo.svg" 
                      alt="Company 1"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 2 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company2-logo.png" 
                      alt="Company 2"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 3 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company3-logo.webp" 
                      alt="Company 3"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 4 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company4-logo.webp" 
                      alt="Company 4"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 5 */}
                  <div className="w-32 sm:w-40 h-16 sm:h-20 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company5-logo.png" 
                      alt="Company 5"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 6 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company6-logo.png" 
                      alt="Company 6"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Logo 7 */}
                  <div className="w-24 sm:w-32 h-12 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/assets/images/clients/company7-logo.png" 
                      alt="Company 7"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Inclusive Content Creation Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1600px] relative">
          {/* Title */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="relative inline-block">
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
              <h2 className="relative text-5xl font-bold text-gray-900 mb-6">
                Real People, <span className="text-primary">Real Stories</span>
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Our diverse model network brings authenticity to your content, making your brand relatable to every audience
            </p>
          </div>

          {/* Content Grid */}
          <div className="flex justify-center items-center gap-8">
            {/* Authentic Representation Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Diverse Model Network</h3>
              <p className="text-gray-600">Our network features models of all ages, sizes, ethnicities, and identities — so your brand reflects real life and speaks to real customers</p>
            </div>

            {/* Plus Symbol */}
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">+</span>
            </div>

            {/* Relatable Content Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
              <div className="w-16 h-16 bg-secondary-orange/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-secondary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentic User Experience</h3>
              <p className="text-gray-600">Content that resonates with real customers, featuring genuine people who reflect your target audience's diversity.</p>
            </div>

            {/* Equals Symbol */}
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">=</span>
            </div>

            {/* Trust Building Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Standing Out</h3>
              <p className="text-gray-600">In a sea of generic content, real people give your brand a distinct, memorable voice that cuts through the noise</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <button 
              onClick={() => window.location.href = 'mailto:info@creativesocially.com?subject=Inclusive%20Content%20Creation'}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300"
            >
              Create Authentic Content
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Management Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="aspect-[4/3] relative"
                style={{ filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))' }}
              >
                <div 
                  className="w-full h-full"
                  style={{ clipPath: 'polygon(25% 0%, 100% 0, 75% 100%, 0% 100%)' }}
                >
                  <img 
                    src="/assets/images/services/social-media.png"
                    alt="Social Media Management"
                    className="w-full h-full object-cover rounded-[48px]"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-[48px]"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
                <h2 className="relative text-5xl font-bold text-gray-900">Social Media Management</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                We handle your social media presence with expertise and creativity. From content planning to community management, we ensure your brand stays engaging and relevant across all platforms.
              </p>
              <button 
                onClick={() => window.location.href = 'mailto:info@creativesocially.com?subject=Book%20a%20Meeting%20-%20Social%20Media%20Management'}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book a meeting
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Creation Section */}
      <section className="py-24 bg-white-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
                <h2 className="relative text-5xl font-bold text-gray-900">Content Creation</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our creative team produces high-quality content that resonates with your audience. From stunning visuals to compelling copy, we bring your brand story to life.
              </p>
              <button 
                onClick={() => window.location.href = 'mailto:info@creativesocially.com?subject=Book%20a%20Meeting%20-%20Content%20Creation'}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book a meeting
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-2"
            >
              <div 
                className="aspect-[4/3] relative"
                style={{ filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))' }}
              >
                <div 
                  className="w-full h-full"
                  style={{ clipPath: 'polygon(0 0, 75% 0, 100% 100%, 25% 100%)' }}
                >
                  <img 
                    src="/assets/images/services/content-creation.jpg"
                    alt="Content Creation"
                    className="w-full h-full object-cover rounded-[48px]"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-[48px]"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Strategy Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="aspect-[4/3] relative"
                style={{ filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))' }}
              >
                <div 
                  className="w-full h-full"
                  style={{ clipPath: 'polygon(25% 0%, 100% 0, 75% 100%, 0% 100%)' }}
                >
                  <img 
                    src="/assets/images/services/brand-strategy.jpg"
                    alt="Brand Strategy"
                    className="w-full h-full object-cover rounded-[48px]"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-[48px]"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
                <h2 className="relative text-5xl font-bold text-gray-900">Brand Strategy</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                We develop comprehensive brand strategies that set you apart. From market analysis to positioning, we help you build a strong and memorable brand identity.
              </p>
              <button 
                onClick={() => window.location.href = 'mailto:info@creativesocially.com?subject=Book%20a%20Meeting%20-%20Brand%20Strategy'}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book a meeting
              </button>
            </motion.div>
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
  100% on <span className="text-secondary-orange">time</span>, <span className="text-secondary-orange">budget</span> and <span className="text-secondary-orange">brand</span>
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

      {/* Pricing Section */}
      <section className="py-24 bg-white-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
              <h2 className="relative text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Smart brands dont overpay <br />– neither should you
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Unluck new customers and receive your benefits from day 1 <br />with Creative Socially
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Essential Plan */}
            <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-900">Creative Socially On-Demand</h3>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900"> 1000 - 4000</span>
                  <span className="text-xl text-gray-900">DKK</span>
                  <span className="text-gray-500 text-sm">/ product</span>
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg mb-8 hover:bg-gray-800 transition-colors">
                View our products
              </button>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Hand-pick your own creators (humans or animals)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Pay only for the content you need — no ongoing commitment</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Content quality control and feedback loops</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Content can be created in our own studio or a remote location</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Generate sales quickly</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Choose your own content style</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Administer your own costs easily</span>
                </li>
              </ul>
            </div>

            {/* Done-For-You Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-primary shadow-primary/100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-900">Creative Socially Plus</h3>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">7500</span>
                  <span className="text-xl text-gray-900">DKK</span>
                  <span className="text-gray-500 text-sm">/ month</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white py-3 px-6 rounded-lg mb-8 hover:bg-primary/90 transition-colors">
              Boost my sales
              </button>

            

              <ul className="space-y-4">
              <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">TikTok, Instagram, LinkedIn — we handle them all</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">4 monthly content videos in a professional studio</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">10 monthly pictures in a professional studio</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">1 hour of free consultation and strategy session</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Hand-pick your own creators (humans or animals)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Content quality control and feedback loops</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Ongoing strategy and content optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Monthly strategy session</span>
                </li><li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Prioritized support</span>
                </li>
              </ul>
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
            <div className="relative inline-block">
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
              <h2 className="relative text-4xl font-bold text-gray-900 mb-4">Who We Are</h2>
            </div>
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
              <div className="relative inline-block">
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary-orange/10 to-primary/10 rounded-full blur-2xl"></div>
                <h2 className="relative text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              </div>
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
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSubmitting ? 'Sending...' : 'Submit'}
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