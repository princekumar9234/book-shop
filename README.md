# Online Book Store (Mini E-Commerce)

A clear, responsive, and functional generic Online Book Store built with Node.js, Express, and MongoDB.

## Features
- **User Roles**: Admin (Manage Content) & Customer (Shop).
- **Authentication**: Secure Login/Register with Password Hashing.
- **Product Management**: Search, filter, and view book details.
- **Shopping Cart**: Add, update, and remove items.
- **Order System**: Checkout and Order History.
- **Admin Dashboard**: Manage books and orders with visual stats.

## Tech Stack
- **Frontend**: HTML5, CSS3, EJS Templates
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Setup & Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file in the root (already created):
    ```env
    MONGO_URI=mongodb://localhost:27017/onlinebookstore
    PORT=3000
    SESSION_SECRET=your_secret_key
    ```
3.  **Seed Database** (Optional but recommended):
    ```bash
    npm run seed
    ```
4.  **Run Server**:
    ```bash
    npm start
    # OR for development (requires nodemon installed globally or as dev dependency)
    npm run dev
    ```
5.  **Access App**:
    Open [http://localhost:3000](http://localhost:3000)

## Sample Users
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | password123 |
| **Customer** | john@example.com | password123 |

> [!TIP]
> **To Create a New Admin Account**: Go to the **Register** page and use the Secret Admin Code: `ADMIN123`.

## Folder Structure
- `config/`: DB connection
- `models/`: Mongoose Schemas (User, Book, Cart, Order)
- `routes/`: Express Routes
- `views/`: EJS Templates
- `public/`: Static Assets (CSS, Images)
- `middleware/`: Auth Middleware

## Future Enhancements
- Payment Gateway Integration (Stripe/PayPal)
- User Reviews & Ratings
- Wishlist Functionality
