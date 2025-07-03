import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DashboardPage = () => {
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Sales',
        data: [1200, 1900, 3000, 2500, 4200, 3100, 3800],
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.1)',
        tension: 0.4,
        fill: true,
        pointBorderColor: '#fff',
        pointBackgroundColor: 'red',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#000',
          font: {
            size: 12,
            weight: 700,
          },
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#000',
          font: { size: 10 }
        },
        grid: { color: '#ddd' }
      },
      y: {
        ticks: {
          color: '#000',
          font: { size: 12 }
        },
        grid: { color: '#ddd' }
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'white',
      padding: '2px',
      color: '#000',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'red', fontSize: '24px', fontWeight: 'bold' }}>E-Commerce</h1>
        <span style={{ color: '#555' }}>/ Dashboard / E-Commerce</span>
      </div>

      {/* Top Cards */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
        {/* Sales Chart */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '16px',
          borderRadius: '8px',
          flex: 2,
          width: '100%',
        }}>
          <h2 style={{ color: '#000', marginBottom: '12px' }}>Sales Chart</h2>
          <div style={{ height: '400px' }}>
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>

        {/* Special Offer */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '16px',
          borderRadius: '8px',
          flex: 1,
          minWidth: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ color: '#000' }}>Today's Special Offer</h2>
          <p style={{ color: '#222', fontSize: '14px', margin: '12px 0' }}>
            You can flat get <span style={{ color: 'red' }}>20% off</span> on next pro version if your sale beats your last record.
          </p>
          <div style={{
            backgroundColor: 'red',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            Offer Banner
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '24px' }}>
        {[
          { title: 'Total Sales', value: '₹98,459' },
          { title: 'Total Visitors', value: '54,156' },
          { title: 'Total Orders', value: '5,125' },
          { title: 'Revenue Growth', value: '₹97,250.89' },
        ].map((stat, index) => (
          <div key={index} style={{
            backgroundColor: '#f0f0f0',
            padding: '16px',
            borderRadius: '6px',
            flex: '1 1 200px',
            minWidth: '200px'
          }}>
            <h3 style={{ color: '#000', fontSize: '14px' }}>{stat.title}</h3>
            <p style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sale History + Orders */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '24px' }}>
        {/* Sale History */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '16px',
          borderRadius: '6px',
          flex: 1,
          minWidth: '280px'
        }}>
          <h3 style={{ color: 'red', marginBottom: '12px' }}>Sale History</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#000', fontSize: '14px' }}>
            <li>Oxford shirt - ₹1500.14 (50 min ago)</li>
            <li>Jordan’s t-shirt - ₹1800.87 (40 min ago)</li>
            <li>Graphic tee - ₹2000.84 (35 min ago)</li>
          </ul>
        </div>

        {/* Latest Orders */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '16px',
          borderRadius: '6px',
          flex: 2,
          minWidth: '300px',
          overflow: 'hidden'
        }}>
          <h3 style={{ color: 'red', marginBottom: '12px' }}>Latest Orders</h3>
          <div style={{ overflowX: 'hidden' }}>
            <table style={{ width: '100%', color: '#000', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid red' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Order ID</th>
                  <th>Billing Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '8px' }}>Winter Jacket</td>
                  <td>Amit Shah</td>
                  <td>₹1500.45</td>
                  <td style={{ color: 'green' }}>Delivered</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Casual Trouser</td>
                  <td>Arlene McCoy</td>
                  <td>₹785.62</td>
                  <td style={{ color: 'orange' }}>Shipped</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
