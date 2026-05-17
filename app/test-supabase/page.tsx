'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing connection...');
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();

        // Test: Try to fetch restaurants
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .limit(3);

        if (error) throw error;

        setRestaurants(data || []);
        setStatus('success');
        setMessage(`✅ Connected! Found ${data?.length || 0} restaurants in database.`);
      } catch (err: any) {
        setStatus('error');
        setMessage(`❌ Connection failed: ${err.message}`);
        console.error('Supabase connection error:', err);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '3rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🔌 Supabase Connection Test
      </h1>

      <div style={{
        padding: '1.5rem',
        borderRadius: '8px',
        backgroundColor: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#fff3cd',
        border: `2px solid ${status === 'success' ? '#28a745' : status === 'error' ? '#dc3545' : '#ffc107'}`,
        marginBottom: '2rem'
      }}>
        <p style={{ 
          fontSize: '1.2rem', 
          margin: 0,
          color: status === 'success' ? '#155724' : status === 'error' ? '#721c24' : '#856404'
        }}>
          {message}
        </p>
      </div>

      {status === 'success' && restaurants.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Sample Restaurants from Database:
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  {restaurant.name}
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                  {restaurant.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                  <span>📍 {restaurant.city}</span>
                  <span>⭐ {restaurant.rating}</span>
                  <span>{restaurant.is_open ? '🟢 Open' : '🔴 Closed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
            🔧 Troubleshooting Steps:
          </h2>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Check if <code>.env.local</code> file exists in project root</li>
            <li>Verify <code>NEXT_PUBLIC_SUPABASE_URL</code> is set correctly</li>
            <li>Verify <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> is set correctly</li>
            <li>Make sure you ran the schema in Supabase SQL Editor</li>
            <li>Restart dev server: Stop and run <code>pnpm dev</code> again</li>
          </ol>
          <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '4px' }}>
            📖 See full guide: <code>docs/CONNECT_SUPABASE.md</code>
          </p>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          💡 <strong>Next:</strong> Once connected, check <code>docs/API.md</code> for how to use the database
        </p>
      </div>
    </div>
  );
}
