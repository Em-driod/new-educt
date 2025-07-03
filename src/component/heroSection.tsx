import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiZap, FiEdit, FiSearch, FiMic, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const AIHeroSection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.3, ease: 'easeOut' } },
    hover: { scale: 1.05, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: isMobile ? 0 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <section
      className=" w-screen mt-6 relative min-h-[90vh] md:min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center overflow-hidden px-4 py-16 md:px-12"
    >
      {/* Dynamic Blobs for a modern look */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-yellow-400 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
        initial={{ x: -100, y: -100 }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-green-300 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
        initial={{ x: 100, y: 100 }}
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text Content */}
        <div className="text-center md:text-left px-4">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            variants={textVariants}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #D4ED16, #AABF3D)', // Lemon green gradient
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Illuminate Your
            </span>{' '}
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #D4ED16, #AABF3D)', // Same for consistency
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Creative World
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto md:mx-0"
            variants={textVariants}
          >
            Unlock innovative insights and streamline your workflow with cutting-edge AI tools crafted for creators and visionaries.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start" variants={textVariants}>
            <motion.button
              className="bg-gradient-to-tr from-yellow-400 to-green-300 hover:from-yellow-500 hover:to-green-400 text-black px-8 py-3 rounded-full text-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => console.log('Get Started')}
            >
              <FiPlayCircle className="text-xl" /> Get Started
            </motion.button>
            <motion.button
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full text-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 border border-gray-700"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => console.log('Learn More')}
            >
              <FiSearch className="text-xl" /> Learn More
            </motion.button>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="mt-10 flex flex-wrap gap-x-6 gap-y-4 justify-center md:justify-start text-gray-400 text-sm"
            variants={textVariants}
          >
            <Link to="/content-generator"> <span className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <FiEdit className="text-yellow-300" /> Generate Content
            </span>
            </span> 
            </Link>
            <Link to="/file-uploader">  <span className="flex items-center gap-2">
              <FiBookOpen className="text-green-400" /> Read & Explain
            </span></Link>
          
            <span className="flex items-center gap-2">
              <FiMic className="text-green-400" /> Audio/Video Analysis
            </span>
            <span className="flex items-center gap-2">
              <FiZap className="text-yellow-300" /> Write Assignments
            </span>
          </motion.div>
        </div>

        {/* Right Side: Mockup Image/Video */}
        <motion.div
          className="relative w-full h-80 md:h-[550px] bg-gray-900 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden"
          variants={imageVariants}
        >
          {/* Replace with your actual mockup image or video */}
       <video
  src="/vad.mp4"
  className="absolute inset-0 w-full h-full object-cover rounded-3xl"
  autoPlay
  loop
  muted
  playsInline
></video>
          {/* Optional: Video demo */}
          {/* <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover rounded-3xl">
            <source src="/hero-ai-demo.mp4" type="video/mp4" />
          </video> */}

          {/* Overlay for subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20 rounded-3xl" />

          {/* Animated border glow for elite feel */}
          <motion.div
            className="absolute inset-0 border-4 border-gradient rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.5 }}
            style={{
              boxShadow: '0 0 40px rgba(164, 213, 47, 0.7)', // Lemon green glow
              borderImage: 'conic-gradient(from 180deg, #D4ED16, #AABF3D, #D4ED16)',
            }}
          />
        </motion.div>

      </div>
      
  
    </section>
  );
};

export default AIHeroSection;