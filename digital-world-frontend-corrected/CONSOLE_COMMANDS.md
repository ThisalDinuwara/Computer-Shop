# Console Debug Commands - Quick Reference Card

## 📋 Copy & Paste These Commands

### Check Authentication Status
```javascript
console.log('Auth Status Check:', {
  hasJWT: !!localStorage.getItem('jwt'),
  hasUser: !!localStorage.getItem('user'),
  jwtLength: localStorage.getItem('jwt')?.length || 0
});
```

### View JWT Token Details
```javascript
const jwt = localStorage.getItem('jwt');
if (jwt) {
  const parts = jwt.split('.');
  const payload = JSON.parse(atob(parts[1]));
  console.log('JWT Info:', {
    subject: payload.sub,
    roles: payload.authorities || payload.roles,
    issued: new Date(payload.iat * 1000).toLocaleString(),
    expires: new Date(payload.exp * 1000).toLocaleString(),
    isExpired: Date.now() > payload.exp * 1000
  });
} else {
  console.log('❌ No JWT token found');
}
```

### Test Cart API
```javascript
const testCart = async () => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    console.log('❌ No JWT - cannot test');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5454/cart', {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Cart API Test:', {
      status: response.status,
      ok: response.ok,
      data: await response.json()
    });
  } catch (error) {
    console.error('Cart API Error:', error);
  }
};
testCart();
```

### Test Add to Cart API
```javascript
const testAddToCart = async (productId, size = 'Default', quantity = 1) => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    console.log('❌ No JWT - cannot test');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5454/cart/add', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, size, quantity })
    });
    
    console.log('Add to Cart Test:', {
      status: response.status,
      ok: response.ok,
      data: await response.json()
    });
  } catch (error) {
    console.error('Add to Cart Error:', error);
  }
};

// Usage: testAddToCart(1, '128GB', 1);
console.log('Call testAddToCart(productId, size, quantity) to test');
```

### Check Backend Connection
```javascript
fetch('http://localhost:5454/products?page=0&size=1')
  .then(r => {
    console.log('Backend Status:', r.ok ? '✅ Online' : '❌ Error ' + r.status);
    return r.json();
  })
  .then(d => console.log('Sample Product:', d.content?.[0]))
  .catch(e => console.error('Backend Offline:', e.message));
```

### Force Logout
```javascript
localStorage.removeItem('jwt');
localStorage.removeItem('user');
console.log('✅ Logged out');
location.reload();
```

### Complete Auth Reset
```javascript
localStorage.clear();
sessionStorage.clear();
console.log('✅ All data cleared');
location.reload();
```

### Monitor Network Requests
```javascript
// Run this before testing
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Fetch:', args[0], {
    hasAuth: args[1]?.headers?.Authorization ? '✅' : '❌'
  });
  return originalFetch.apply(this, args);
};
console.log('✅ Now monitoring all fetch requests');
```

### Check React Context State
```javascript
// This requires React DevTools
// 1. Install React DevTools browser extension
// 2. Open DevTools > React tab
// 3. Select <AuthProvider> component
// 4. View its state in the right panel
console.log('💡 Use React DevTools to inspect AuthContext state');
```

### Verify localStorage Persistence
```javascript
// Test if localStorage is working
localStorage.setItem('test', 'hello');
const result = localStorage.getItem('test');
localStorage.removeItem('test');
console.log('localStorage working:', result === 'hello' ? '✅' : '❌');
```

### Check for Token Expiry
```javascript
const jwt = localStorage.getItem('jwt');
if (jwt) {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    const expiryDate = new Date(payload.exp * 1000);
    const now = new Date();
    const hoursLeft = (expiryDate - now) / (1000 * 60 * 60);
    
    console.log('Token Expiry Check:', {
      expires: expiryDate.toLocaleString(),
      hoursRemaining: hoursLeft.toFixed(1),
      isExpired: hoursLeft < 0,
      status: hoursLeft < 0 ? '❌ EXPIRED' : hoursLeft < 1 ? '⚠️ EXPIRING SOON' : '✅ Valid'
    });
  } catch (e) {
    console.error('❌ Invalid JWT format');
  }
} else {
  console.log('❌ No JWT token');
}
```

### Debug Mode: Watch Everything
```javascript
// Enable comprehensive logging
window.DEBUG_AUTH = true;

// Override console.log to filter auth messages
const originalLog = console.log;
console.authLog = function(...args) {
  if (window.DEBUG_AUTH) {
    originalLog.apply(console, ['[AUTH DEBUG]', ...args]);
  }
};

console.log('✅ Debug mode enabled. Use console.authLog() for auth messages.');
```

### Quick Health Check (All-in-One)
```javascript
(async () => {
  console.log('='.repeat(60));
  console.log('🏥 DIGITAL WORLD HEALTH CHECK');
  console.log('='.repeat(60));
  
  // 1. localStorage
  const jwt = localStorage.getItem('jwt');
  const user = localStorage.getItem('user');
  console.log('\n📦 LocalStorage:');
  console.log('  JWT:', jwt ? `✅ ${jwt.length} chars` : '❌ Missing');
  console.log('  User:', user ? '✅ Present' : '❌ Missing');
  
  // 2. Token validity
  if (jwt) {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const expired = Date.now() > payload.exp * 1000;
      console.log('  Token:', expired ? '❌ EXPIRED' : '✅ Valid');
    } catch (e) {
      console.log('  Token: ❌ Invalid format');
    }
  }
  
  // 3. Backend
  console.log('\n🌐 Backend:');
  try {
    const res = await fetch('http://localhost:5454/products?page=0&size=1');
    console.log('  Status:', res.ok ? '✅ Online' : `❌ Error ${res.status}`);
  } catch (e) {
    console.log('  Status: ❌ Offline');
  }
  
  // 4. Auth endpoint
  if (jwt) {
    console.log('\n🔐 Authentication:');
    try {
      const res = await fetch('http://localhost:5454/cart', {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('  Cart API:', res.ok ? '✅ Authenticated' : `❌ Failed (${res.status})`);
    } catch (e) {
      console.log('  Cart API: ❌ Error');
    }
  }
  
  // 5. Recommendations
  console.log('\n💡 Recommendations:');
  if (!jwt) {
    console.log('  → Go to /login to authenticate');
  } else {
    console.log('  → Ready to use application');
  }
  
  console.log('\n' + '='.repeat(60));
})();
```

## 🎯 Common Scenarios

### Scenario: "I just logged in but cart still shows error"
```javascript
// 1. Verify login worked
console.log('JWT exists:', !!localStorage.getItem('jwt'));

// 2. Try adding to cart manually
testAddToCart(1, 'Default', 1); // Use actual product ID

// 3. Check if interceptor is working
// Look for "🔐 Sending authenticated request" in console
```

### Scenario: "Token expired"
```javascript
// Clear and force re-login
localStorage.clear();
alert('Token cleared. Please log in again.');
window.location.href = '/login';
```

### Scenario: "Backend returns 401 but token exists"
```javascript
// Token might be invalid - decode and check
const jwt = localStorage.getItem('jwt');
if (jwt) {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Expired?', Date.now() > payload.exp * 1000);
  } catch (e) {
    console.error('Invalid JWT - clear and re-login');
    localStorage.clear();
  }
}
```

## 📱 Mobile/Tablet Debugging

If testing on mobile devices where console is harder to access:

```javascript
// Create visual debug overlay
const showDebug = () => {
  const jwt = localStorage.getItem('jwt');
  const info = jwt ? 'JWT: ' + jwt.substring(0, 20) + '...' : 'No JWT';
  alert('Auth Status:\n\n' + info + '\n\nCheck: ' + (jwt ? 'OK' : 'NOT LOGGED IN'));
};

// Call this function when needed
showDebug();
```

## 🔧 Production: Remove Debug Logs

Before deploying to production, search and remove/comment:
- `console.log` (except critical errors)
- `console.authLog`
- Debug panel component

Or use environment variables:
```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug message');
}
```

---

**💡 Tip**: Bookmark this page or keep it open in a tab while developing!
