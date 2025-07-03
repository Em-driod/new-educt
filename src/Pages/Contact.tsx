import { useEffect, useState } from 'react';
import { FaWhatsapp, FaInstagram, FaTimes } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle responsiveness on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendToWhatsApp = (e: any) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const text = `Hello, my name is ${name} (${email}) and my message is: ${message}`;
    const whatsappUrl = `https://wa.me/2347016969298?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* Left - Socials */}
      <div
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '2rem',
          width: isMobile ? '100%' : '40%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'flex-start' : 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '2rem',
            color: '#fff',
            textAlign: isMobile ? 'left' : 'center',
          }}
        >
          Get in Touch
        </h2>

        {/* Social Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaWhatsapp size={28} color="#25D366" />
            <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>07016969298</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaInstagram size={28} color="#E1306C" />
            <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>@zvaentertainment_instagram</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaSquareXTwitter size={28} color="#1DA1F2" />
            <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>@your_twitter</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          width: isMobile ? '100%' : '60%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            alignSelf: 'flex-end',
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => alert('Close icon clicked!')}
        >
          <FaTimes size={24} color="black" />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000' }}>
          Contact Us
        </h1>

        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#000' }}>
          Fill out the form below or reach out on our socials.
        </p>

        <form
          onSubmit={sendToWhatsApp}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              width: '100%',
            }}
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              width: '100%',
            }}
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              width: '100%',
              resize: 'vertical',
            }}
          ></textarea>

          <button
            type="submit"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'red',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              marginTop: '1rem',
              width: 'fit-content',
              alignSelf: 'flex-start',
            }}
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
