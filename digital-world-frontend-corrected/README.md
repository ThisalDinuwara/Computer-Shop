# Digital World - Modern E-Commerce Frontend

A modern, fully-featured React frontend for the Digital World e-commerce application, designed to connect seamlessly with the Spring Boot backend.

## 🚀 Features

- **Modern UI/UX**: Built with React 19 and Tailwind CSS for a beautiful, responsive design
- **OTP Authentication**: Secure login/signup using OTP verification
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add, update, and remove items with real-time updates
- **Checkout Flow**: Complete checkout with shipping address and payment integration (Razorpay/Stripe)
- **Order Management**: View order history and cancel orders
- **User Profile**: Manage user information and saved addresses
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 📋 Prerequisites

Before running this frontend, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** (v8 or higher)
3. **Spring Boot Backend** running on `http://localhost:5454`

## 🛠️ Installation

1. **Navigate to the project directory:**
   ```bash
   cd digital-world-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. The application will open at `http://localhost:3000`

## 🔧 Configuration

### Backend Connection

The frontend is configured to connect to the backend at `http://localhost:5454`. If your backend runs on a different port, update the API base URL in:

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:5454';
```

### CORS Configuration

Ensure your Spring Boot backend allows CORS from `http://localhost:3000`. Your current backend configuration should handle this, but if you encounter CORS issues, update your `AppConfig.java`:

```java
cfg.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
// Note: Don't use "*" with setAllowCredentials(true)
```

## 📁 Project Structure

```
digital-world-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.js        # Navigation bar
│   │   ├── Footer.js        # Footer component
│   │   ├── ProductCard.js   # Product display card
│   │   ├── Loading.js       # Loading spinner
│   │   └── ProtectedRoute.js # Auth guard
│   ├── pages/               # Page components
│   │   ├── HomePage.js      # Landing page
│   │   ├── LoginPage.js     # Authentication
│   │   ├── ProductsPage.js  # Product listing
│   │   ├── ProductDetailPage.js # Single product view
│   │   ├── CartPage.js      # Shopping cart
│   │   ├── CheckoutPage.js  # Checkout flow
│   │   ├── OrdersPage.js    # Order history
│   │   └── ProfilePage.js   # User profile
│   ├── context/             # React context providers
│   │   ├── AuthContext.js   # Authentication state
│   │   └── CartContext.js   # Cart state management
│   ├── services/            # API services
│   │   └── api.js           # Axios configuration & API calls
│   ├── App.js               # Main application component
│   ├── index.js             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔑 Authentication Flow

1. **Send OTP**: User enters email, OTP is sent via backend email service
2. **Verify OTP**: User enters the 6-digit OTP received
3. **JWT Token**: Backend returns JWT token stored in localStorage
4. **Auto-login**: Token is automatically included in all authenticated requests

## 🌐 API Endpoints Connected

### Authentication
- `POST /auth/sent/login-signup-otp` - Send OTP
- `POST /auth/signup` - Create new account
- `POST /auth/signing` - Login with OTP
- `GET /users/profile` - Get user profile

### Products
- `GET /products` - List all products (with filtering)
- `GET /products/{id}` - Get product details
- `GET /products/search?query=` - Search products

### Cart
- `GET /cart` - Get user's cart
- `PUT /cart/add` - Add item to cart
- `PUT /cart/item/{id}` - Update cart item quantity
- `DELETE /cart/item/{id}` - Remove item from cart

### Orders
- `POST /orders?paymentMethod=` - Create order
- `GET /orders/user` - Get order history
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/cancel` - Cancel order

## 🎨 Styling

The application uses **Tailwind CSS** for styling with custom utility classes:

- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.input-field` - Form input fields
- `.card` - Product and content cards

## 🔒 Protected Routes

The following routes require authentication:
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/profile` - User profile

Unauthenticated users are redirected to `/login`.

## 💳 Payment Integration

The checkout flow integrates with:
- **Razorpay** - For Indian payments
- **Stripe** - For international payments

After order creation, users are redirected to the payment gateway.

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Single column layouts, collapsible menus
- **Tablet**: Two-column grids, optimized spacing
- **Desktop**: Full-width layouts with sidebars

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for `http://localhost:3000`
   - Don't use `*` with credentials enabled

2. **OTP Not Received**
   - Check backend email configuration
   - Verify SMTP settings in `application.properties`

3. **Products Not Loading**
   - Ensure backend is running on port 5454
   - Check browser console for API errors

4. **Authentication Issues**
   - Clear localStorage and try again
   - Check JWT token expiration

## 📝 Environment Variables

For production deployment, you may want to use environment variables:

```bash
REACT_APP_API_URL=http://your-backend-url
REACT_APP_ENV=production
```

## 🤝 Integration with Backend

This frontend is designed specifically for the Digital World Spring Boot backend. Key integration points:

1. **JWT Authentication**: Tokens are stored in localStorage and sent via Authorization header
2. **OTP Flow**: Uses the backend's email service for OTP delivery
3. **Payment Gateway**: Redirects to Razorpay/Stripe payment links from backend
4. **Real-time Cart**: Cart state syncs with backend on every update

## 📄 License

This project is part of the Digital World e-commerce application.

---

**Happy Shopping! 🛍️**
