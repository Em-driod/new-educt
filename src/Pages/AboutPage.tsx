import React, { useEffect, useRef } from 'react';
//import './AboutPage.module.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Define or import the TeamMember component
const TeamMember = ({ name, role, bio, quote, imgPlaceholder }: { name: string; role: string; bio: string; quote: string; imgPlaceholder: React.ReactNode }) => {
  return (
    <motion.div
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: '2px solid black',
        width: '100%',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <div style={{
          width: '128px',
          height: '128px',
          borderRadius: '9999px',
          backgroundColor: '#fef2f2',
          overflow: 'hidden',
          margin: '0 auto',
          border: '2px solid #f87171'
        }}>
          {imgPlaceholder}
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'black' }}>Team Member Name</h3>
        <p style={{ color: '#f87171', fontWeight: '500', marginBottom: '12px' }}>{role}</p>
        <p style={{ color: '#374151', marginBottom: '12px' }}>{bio}</p>
        <p style={{ fontStyle: 'italic', color: '#4b5563' }}>"{quote}"</p>
      </div>
    </motion.div>
  );
return (
    <motion.div
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: '2px solid black',
        width: '100vw',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <div style={{
          width: '128px',
          height: '128px',
          borderRadius: '9999px',
          backgroundColor: '#fef2f2',
          overflow: 'hidden',
          margin: '0 auto',
          border: '2px solid #f87171'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280'
          }}>
            <span style={{ fontSize: '16px', color: '#6b7280' }}>Image Placeholder</span>
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'black' }}>{name}</h3>
        <p style={{ color: '#f87171', fontWeight: '500', marginBottom: '12px' }}>{role}</p>
        <p style={{ color: '#374151', marginBottom: '12px' }}>{bio}</p>
        <p style={{ fontStyle: 'italic', color: '#4b5563' }}>"{quote}"</p>
      </div>
    </motion.div>
  );
};

const AboutPage = ({ quote }: { quote: string }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black', width: '100vw' }}>
      {/* Hero Section with Diagonal Split */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: '0',
          backgroundColor: 'black',
          zIndex: 0,
          transform: 'skewY(-3deg)',
          transformOrigin: 'top left'
        }}></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'relative',
            zIndex: 10,
            paddingTop: '128px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            // Removed invalid media query from inline styles
            // Use a CSS class for responsive styles
          }}
        >
          <motion.h1
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '40px',
              fontWeight: '700',
              marginBottom: '24px',
              color: 'white'
            }}
          >
            <span style={{ color: '#f87171' }}>ZVA</span> <span style={{ color: 'black' }}>ENTERTAINMENT</span>
          </motion.h1>
          <motion.p
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '20px',
              fontWeight: '400',
              maxWidth: '40rem',
              color: '#d1d5db',
              marginTop: '24px'
            }}
          >
            Redefining African entertainment through <span style={{ fontWeight: '700', color: 'white' }}>innovation</span> and <span style={{ fontWeight: '700', color: 'white' }}>authenticity</span>.
          </motion.p>
        </motion.div>
      </div>

      {/* Mission Statement */}
      <motion.div
        ref={ref}
        style={{ maxWidth: '100%', padding: '24px' }}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '24px',
              color: 'black',
              borderLeft: '4px solid #f87171',
              paddingLeft: '16px'
            }}>
              OUR <span style={{ color: '#f87171' }}>MISSION</span>
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.75',
              marginBottom: '24px',
              color: '#374151'
            }}>
              ZVA Entertainment reshapes African entertainment through talent discovery, creative expression, and cultural innovation.
            </p>
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '16px',
              border: '1px solid #f87171',
              borderRadius: '8px'
            }}>
              <p style={{
                color: '#f87171',
                fontWeight: '500'
              }}>
                "We don't just create entertainment - we create cultural movements."
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {['Film Production', 'Music', 'Dance', 'Events'].map((service, index) => (
              <div key={index} style={{
                backgroundColor: index % 2 === 0 ? 'black' : '#f87171',
                color: 'white',
                padding: '24px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{ textAlign: 'center', fontWeight: '700' }}>{service}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ width: '100vw', padding: '4rem 1rem', background: '#fff' }}>
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    style={{ maxWidth: '1200px', margin: '0 auto' }}
  >
    <motion.h2
      style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '2rem',
      }}
    >
      Meet <span style={{ color: '#ef4444' }}>The Dream Team</span>
    </motion.h2>

    {/* Team Member 1 */}
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        marginBottom: '3rem',
        background: '#fef2f2',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '9999px',
        background: 'linear-gradient(to bottom right, #fecaca, #f87171)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <span style={{ fontWeight: 600, color: '#991b1b' }}>CEO Photo</span>
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tofi Tofi</h3>
      <p style={{ fontSize: '1rem', fontWeight: 500, color: '#6b7280' }}>Founder & CEO</p>
      <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#374151', textAlign: 'center', maxWidth: '600px' }}>
        Visionary leader with 10+ years experience transforming African entertainment landscape. Passionate about authentic storytelling.
      </p>
      <blockquote style={{
        fontStyle: 'italic',
        marginTop: '1rem',
        color: '#ef4444',
        fontWeight: 500,
        textAlign: 'center',
      }}>
        "Our stories will change how the world sees Africa."
      </blockquote>
    </motion.div>

    {/* Team Member 2 */}
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        background: '#f1f5f9',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '9999px',
        background: '#d1d5db',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Music Photo</span>
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fiiinin</h3>
      <p style={{ fontSize: '1rem', fontWeight: 500, color: '#6b7280' }}>Head of Music</p>
      <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#374151', textAlign: 'center', maxWidth: '600px' }}>
        Award-winning producer revolutionizing African sound. Discovered multiple platinum-selling artists.
      </p>
      <blockquote style={{
        fontStyle: 'italic',
        marginTop: '1rem',
        color: '#1d4ed8',
        fontWeight: 500,
        textAlign: 'center',
      }}>
        "The world isn't ready for the African sound revolution."
      </blockquote>
    </motion.div>

    {/* Decorative Bar */}
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      viewport={{ once: true }}
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#f87171',
        marginTop: '4rem',
        transformOrigin: 'left center'
      }}
    />
  </motion.div>
</div>

      {/* Scrolling Services */}
      <motion.div
        initial={{ x: -100 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '16px',
          whiteSpace: 'nowrap',
          animation: 'marquee 20s linear infinite',
          width: '100vw',
          overflow: 'hidden',
        }}>
          {['Film Production', 'Music Distribution', 'Artist Management', 'Event Planning', 'Talent Scouting', 'Cultural Exchange'].map((service, i) => (
            <div key={i} style={{
              padding: '16px',
              backgroundColor: '#f87171',
              color: 'white',
              borderRadius: '9999px',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {service}
            </div>
          ))}
          {['Film Production', 'Music Distribution', 'Artist Management', 'Event Planning', 'Talent Scouting', 'Cultural Exchange'].map((service, i) => (
            <div key={`copy-${i}`} style={{
              padding: '16px',
              backgroundColor: '#f87171',
              color: 'white',
              borderRadius: '9999px',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {service}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;

// Example usage of AboutPage component
// <AboutPage quote="Your inspirational quote here" />
