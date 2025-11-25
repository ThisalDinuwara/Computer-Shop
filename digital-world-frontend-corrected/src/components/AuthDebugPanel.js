import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * AuthDebugPanel - A debug component to help troubleshoot authentication issues
 * 
 * Usage:
 * 1. Import this component in your App.js or any page
 * 2. Add <AuthDebugPanel /> at the bottom of your JSX
 * 3. Remove or comment out when done debugging
 * 
 * Example:
 * import AuthDebugPanel from './components/AuthDebugPanel';
 * 
 * function App() {
 *   return (
 *     <div>
 *       {/* Your app content *\/}
 *       <AuthDebugPanel />
 *     </div>
 *   );
 * }
 */
const AuthDebugPanel = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const jwt = localStorage.getItem('jwt');
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Parse JWT to get info
  const getJWTInfo = () => {
    if (!jwt) return null;
    
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return { error: 'Invalid JWT format' };
      
      const payload = JSON.parse(atob(parts[1]));
      return {
        subject: payload.sub,
        expiry: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A',
        isExpired: payload.exp ? Date.now() > payload.exp * 1000 : false,
        roles: payload.authorities || payload.roles || 'N/A'
      };
    } catch (error) {
      return { error: 'Failed to parse JWT' };
    }
  };

  const jwtInfo = getJWTInfo();

  const testAPI = async () => {
    console.log('🧪 Testing Cart API...');
    try {
      const response = await fetch('http://localhost:5454/cart', {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      alert(`API Test ${response.ok ? 'Success' : 'Failed'}: ${response.status}`);
    } catch (error) {
      console.error('API test error:', error);
      alert('API Test Error: ' + error.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      maxWidth: '400px',
      background: '#1a202c',
      color: '#fff',
      borderTopLeftRadius: '8px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '8px 12px',
          background: '#2d3748',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '8px'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>
          🔐 Auth Debug {isAuthenticated ? '✅' : '❌'}
        </span>
        <span>{isExpanded ? '▼' : '▲'}</span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '12px', maxHeight: '400px', overflowY: 'auto' }}>
          {/* Auth Status */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#a0aec0', marginBottom: '4px' }}>Auth Status:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '4px', 
                background: isAuthenticated ? '#22543d' : '#742a2a',
                fontSize: '11px'
              }}>
                {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
              </span>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '4px', 
                background: loading ? '#975a16' : '#2d3748',
                fontSize: '11px'
              }}>
                {loading ? '⏳ Loading' : '✓ Ready'}
              </span>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#a0aec0', marginBottom: '4px' }}>User:</div>
              <div style={{ background: '#2d3748', padding: '6px', borderRadius: '4px' }}>
                <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                <div><strong>Name:</strong> {user.fullName || 'N/A'}</div>
                <div><strong>Role:</strong> {user.role || 'N/A'}</div>
              </div>
            </div>
          )}

          {/* JWT Status */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#a0aec0', marginBottom: '4px' }}>JWT Token:</div>
            {jwt ? (
              <div style={{ background: '#2d3748', padding: '6px', borderRadius: '4px' }}>
                <div><strong>Present:</strong> ✅ Yes</div>
                <div><strong>Length:</strong> {jwt.length} chars</div>
                {jwtInfo && !jwtInfo.error && (
                  <>
                    <div><strong>Subject:</strong> {jwtInfo.subject}</div>
                    <div><strong>Expires:</strong> {jwtInfo.expiry}</div>
                    <div style={{
                      color: jwtInfo.isExpired ? '#fc8181' : '#68d391'
                    }}>
                      <strong>Status:</strong> {jwtInfo.isExpired ? '❌ EXPIRED' : '✅ Valid'}
                    </div>
                  </>
                )}
                {jwtInfo?.error && (
                  <div style={{ color: '#fc8181' }}>Error: {jwtInfo.error}</div>
                )}
                <div style={{ 
                  marginTop: '4px', 
                  wordBreak: 'break-all', 
                  fontSize: '10px',
                  color: '#718096'
                }}>
                  {jwt.substring(0, 50)}...
                </div>
              </div>
            ) : (
              <div style={{ 
                background: '#742a2a', 
                padding: '6px', 
                borderRadius: '4px',
                color: '#fc8181'
              }}>
                ❌ No JWT Token Found
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ color: '#a0aec0', marginBottom: '4px' }}>Quick Actions:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  console.log('=== AUTH DEBUG INFO ===');
                  console.log('isAuthenticated:', isAuthenticated);
                  console.log('user:', user);
                  console.log('jwt:', jwt);
                  console.log('jwt info:', jwtInfo);
                  alert('Check console for debug info');
                }}
                style={{
                  padding: '4px 8px',
                  background: '#4299e1',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                📋 Log to Console
              </button>
              
              {jwt && (
                <button
                  onClick={testAPI}
                  style={{
                    padding: '4px 8px',
                    background: '#48bb78',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  🧪 Test API
                </button>
              )}
              
              <button
                onClick={() => {
                  if (window.confirm('Clear all auth data and reload?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{
                  padding: '4px 8px',
                  background: '#f56565',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🗑️ Clear & Reload
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ 
            background: '#2d3748', 
            padding: '8px', 
            borderRadius: '4px',
            fontSize: '11px',
            lineHeight: '1.5'
          }}>
            <div style={{ color: '#a0aec0', marginBottom: '4px' }}>💡 Tips:</div>
            {!jwt && (
              <div>• Go to <a href="/login" style={{ color: '#4299e1' }}>/login</a> to authenticate</div>
            )}
            {jwt && !isAuthenticated && (
              <div style={{ color: '#fc8181' }}>• JWT present but not authenticated - check backend</div>
            )}
            {jwtInfo?.isExpired && (
              <div style={{ color: '#fc8181' }}>• Token expired - log in again</div>
            )}
            {isAuthenticated && (
              <div style={{ color: '#68d391' }}>• All good! Ready to use app</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugPanel;
