# **Creative Socially App Folder Structure**

```
creative-socially/
│
├── public/                      # Static files
│   ├── favicon.ico
│   ├── logo.svg
│   ├── robots.txt
│   └── assets/
│       ├── images/              # Static images
│       │   ├── models/          # Model photos
│       │   ├── products/        # Product images
│       │   ├── team/            # Team photos
│       │   └── bg/              # Background images
│       └── fonts/               # Custom fonts if needed
│
├── src/
│   ├── components/              # Reusable components
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Global header
│   │   │   ├── Footer.jsx       # Global footer
│   │   │   └── Layout.jsx       # Main layout wrapper
│   │   ├── ui/                  # UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Form.jsx
│   │   │   └── Modal.jsx
│   │   ├── home/                # Home page specific components
│   │   │   ├── Banner.jsx       # Gradient banner component
│   │   │   ├── PhoneCard.jsx    # Phone UI card component
│   │   │   ├── FeaturedProducts.jsx
│   │   │   └── WhoWeAre.jsx
│   │   ├── products/            # Product related components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ProductProcess.jsx
│   │   ├── models/              # Model catalogue components
│   │   │   ├── ModelCard.jsx
│   │   │   ├── ModelGrid.jsx
│   │   │   └── ModelForm.jsx
│   │   ├── contact/             # Contact form components
│   │   │   ├── ContactForm.jsx
│   │   │   └── ContactInfo.jsx
│   │   └── shopify/             # Shopify integration components
│   │       ├── ShopifyProduct.jsx
│   │       ├── Cart.jsx
│   │       └── BuyButton.jsx
│   │
│   ├── pages/                   # Page components
│   │   ├── Home.jsx             # Home page
│   │   ├── Products.jsx         # Products listing page
│   │   ├── ProductDetail.jsx    # Individual product page
│   │   ├── ModelCatalogue.jsx   # Model catalogue page
│   │   ├── BecomeModel.jsx      # Become a model page
│   │   ├── About.jsx            # About us page
│   │   ├── Contact.jsx          # Contact page
│   │   └── Signin.jsx           # Sign in page
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useShopify.js        # Hook for Shopify API
│   │   └── useForm.js           # Form handling hook
│   │
│   ├── lib/                     # Libraries and utilities
│   │   ├── shopify.js           # Shopify API setup
│   │   └── utils.js             # Utility functions
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # Global CSS and Tailwind imports
│   │   └── animations.css       # Custom animations
│   │
│   ├── context/                 # React Context API
│   │   ├── ShopContext.jsx      # Shopping cart context
│   │   └── AuthContext.jsx      # Authentication context
│   │
│   ├── data/                    # Static data files
│   │   ├── products.js          # Product data
│   │   └── models.js            # Model data
│   │
│   ├── App.jsx                  # Main App component
│   ├── index.jsx                # Entry point
│   └── routes.jsx               # Route definitions
│
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── package.json                 # Project dependencies and scripts
├── README.md                    # Project documentation
└── .gitignore                   # Git ignore file
```

## Key Structure Decisions

### Component Organization
- **Layout components**: Reusable structural elements used across all pages
- **UI components**: Generic UI elements like buttons, cards, forms
- **Feature-specific components**: Organized by feature area (home, products, models)
- **Page components**: Composed of multiple components to create full pages

### Shopify Integration
- Dedicated `shopify` component directory and `lib/shopify.js` for API integration
- `useShopify` custom hook to abstract Shopify functionality
- `ShopContext` for managing cart state across the application

### Styling Approach
- Tailwind CSS configuration in project root
- Global styles in `styles/` directory
- Component-specific styles using Tailwind classes directly in components

### Data Management
- Static data in `data/` directory
- Context API in `context/` for global state management
- API integrations in `lib/` directory

### Asset Organization
- Public assets separated by type (images, fonts)
- Further categorized by purpose (models, products, team, backgrounds)