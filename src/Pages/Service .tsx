import { Link } from "react-router-dom";
const Service = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#000', padding: '4rem 1.5rem', width: '100vw' }}>
      <h1 style={{ textAlign: 'center', color: '#dc2626', fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem' }}>
        ZVA Entertainment Plans
      </h1>

      <div style={{
        display: 'grid',
        gap: '2.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        marginBottom: '5rem'
      }}>
        {/* ₦500 Plan */}
        <div style={{
          border: '1px solid #ccc',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>₦500 Plan</h2>
          <p><strong>Access:</strong> 1 user for 1 month</p>
          <p style={{ marginTop: '1rem' }}>
            Get full access to all films, videos, and exclusive content provided by ZVA Entertainment.
          </p>
        </div>

        {/* ₦1300 Plan */}
        <div style={{
          border: '1px solid #ccc',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>₦1300 Plan</h2>
          <p><strong>Access:</strong> Up to 3 users for 3 months</p>
          <p style={{ marginTop: '1rem' }}>
            Enjoy 3-month access to all ZVA films, videos, and premium content for a small group.
          </p>
        </div>

        {/* ₦4500 Plan */}
        <div style={{
          border: '1px solid #ccc',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>₦4500 Plan</h2>
          <p><strong>Access:</strong> Up to 7 users for 9 months</p>
          <p style={{ marginTop: '1rem' }}>
            Full premium access to all ZVA content for your crew or large family over 9 months.
          </p>
        

        </div>
        <Link to="/tog">View Our Services</Link>
      </div>

      {/* Join Section */}
      <div style={{
        textAlign: 'center',
        backgroundColor: '#f3f4f6',
        padding: '3rem 1rem',
        borderRadius: '1rem',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Want to join ZVA as a Model, Actor, Dancer, Musician, Media Specialist, or other creative role?
        </h3>
        <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1rem' }}>
          We’re always looking for new talent and partners!
        </p>
        <p style={{ fontSize: '1rem', color: '#111827' }}>
          📧 Email: <a href="mailto:zvaentertainment@gmail.com" style={{ color: '#dc2626', textDecoration: 'underline' }}>zvaentertainment@gmail.com</a><br />
          📞 Phone: <a href="tel:+2347016969298" style={{ color: '#dc2626', textDecoration: 'underline' }}>+234 701 696 9298</a>
        </p>
      </div>
    </div>
  );
};

export default Service;
