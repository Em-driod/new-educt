
import React from 'react';
import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiZap } from 'react-icons/fi'; // Menu, Close, and Zap (for AI logo) icons

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Effect to handle scroll color change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Define dynamic colors based on scroll state
  const navbarBg = scrolled ? 'rgba(0,0,0,0.8)' : 'rgba(0,255,0,0.8)'; // Black or Lime Green with transparency
  const textColor = scrolled ? 'hsl(80, 100%, 70%)' : 'hsl(0, 0%, 100%)'; // Lime green text on black, White text on lime green
  const buttonBg = scrolled ? 'rgba(0,255,0,0.9)' : 'rgba(0,0,0,0.9)'; // Lime green button on black, Black button on lime green
  const buttonTextColor = scrolled ? 'black' : 'hsl(80, 100%, 70%)'; // Black text on lime green, Lime text on black
  const borderColor = scrolled ? 'rgba(0,255,0,0.3)' : 'rgba(0,0,0,0.3)'; // Subtle border color change

  // Framer Motion variants for animations
  const navVariants = {
    initial: { backgroundColor: 'black', backdropFilter: 'blur(5px)' },
    scrolled: { backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' },
  };

  const linkHoverVariants = {
    hover: { scale: 1.05, color: scrolled ? 'white' : 'black', textShadow: scrolled ? '0 0 8px rgba(0,255,0,0.6)' : '0 0 8px rgba(0,0,0,0.4)' },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } },
  };

  // Navigation links data
  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      className="fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out"
      variants={navVariants}
      initial={false} // Prevent initial animation on load
      animate={scrolled ? 'scrolled' : 'initial'}
      style={{
        backgroundColor: navbarBg,
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: scrolled ? '0 4px 20px rgba(0,255,0,0.1)' : '0 4px 15px rgba(0,0,0,0.1)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(5px)', // Dynamic blur
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Logo/Brand Name */}
        <motion.a
          href="/"
          className="flex items-center text-2xl font-bold transition-colors duration-300"
          style={{ color: textColor }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiZap className="mr-2 text-3xl" style={{ color: textColor }} /> AetherMind
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-lg font-medium transition-colors duration-300"
              style={{ color: textColor }}
              variants={linkHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.button
            className="px-6 py-2 rounded-full font-semibold text-lg transition-all duration-300 shadow-md"
            style={{ backgroundColor: buttonBg, color: buttonTextColor, border: `1px solid ${buttonTextColor}` }}
            variants={linkHoverVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => console.log('Try Now Clicked')}
          >
            Try Now
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-3xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
            style={{ color: textColor }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-0 left-0 w-full h-full bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white text-4xl p-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </motion.button>

            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-4xl font-bold text-white hover:text-lime-400 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.button
              className="mt-8 px-10 py-4 rounded-full font-bold text-3xl bg-lime-500 text-black shadow-lg hover:bg-lime-600 transition-all duration-300"
              onClick={() => {
                console.log('Try Now Clicked (Mobile)');
                setMobileMenuOpen(false);
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;