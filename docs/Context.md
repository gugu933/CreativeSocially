

# Creative Socially - Website Feature Breakdown
## **Overview**
Creative Socially is a minimalistic yet daring and playful UGC Content Creation Company. The website is meant for the user to have a glance at what we do, and why they should hire. It is not a normal website, the users can buy our "products" which consists of 1h/2h ad videos for their products. With our creativity and familiarity of videos going viral on social media, we are the best in the field.

---

## **Global Settings**

### **Color Palette**
- **Primary Color:** Light orange (#FFBF69)
- **Secondary Colors:** 
  - Bright orange (#FF9F1C)
  - Muted pink (#CB997E)
  - Pale peach (#FFE8D6)
- **Text Color:** White (#FFFFFF)

### **Typography**
- **Font:** Lora (found in Google Fonts)
```css
/* Usage guide */
/* : Use a value from 400 to 700 */
/* : Use a unique and descriptive class name */
.lora- {
  font-family: "Lora", serif; 
  font-optical-sizing: auto; 
  font-weight: ; 
  font-style: normal;
}
```

### **Tech Stack**
- React Framework and Tailwind CSS
- Shopify integration using Shopify Buy Button SDK in React
- Shopify Buy Button Component for product purchasing

---

## **Page Structure**

### **Home Page** (the base page the user is navigated to when entering the URL)

#### **Header** (global header, used throughout all pages)
- **Tabs/Navigation:** (Home, Products, Model Catalogue, About Us, and Contact)
- **Style:** Should be same styling and visible for every page
- **Design:** No background, white font, left side: logo/company name, middle: navigation bar, right side: profile and cart icons

#### **Banner**
- A full-width animated gradient background shaped like a diagonally sliced rectangle, with a slanted edge from top-left to bottom-right
- The gradient shifts between warm and cool tones, creating a glowing, dynamic effect
- The shape looks like a modern, sliced banner across the top of the page, adding visual energy and contrast behind bold hero text
- **Left Content:**
  - Header: "Effortless storytelling exponential impact"
  - Text: A full-width animated gradient background shaped like a diagonally sliced rectangle, with a slanted edge from top-left to bottom-right. The gradient shifts between warm and cool tones, creating a glowing, dynamic effect. The shape looks like a modern, sliced banner across the top of the page, adding visual energy and contrast behind bold hero text.
- **Right Content:**
  - A vertical, phone-shaped UI card floating on the right side of the screen
  - Has smooth, rounded corners and a light background, mimicking a smartphone
  - Inside the card is a product image, title, price, Apple Pay button, and a clean credit card form
  - The design is minimalist and modern, with soft shadows and a layout similar to a mobile checkout screen

#### **Featured Collection**
- 4 products on cards distributed horizontally on the page with images inside
- **Product 1:**
  - Name: Styled product images
  - Price: 499 DKK
- **Product 2:**
  - Name: Product video
  - Price: 999 DKK
- **Product 3:**
  - Name: Simple UGC
  - Price: 999 DKK
- **Product 4:**
  - Name: Enhanced UGC
  - Price: 1499 DKK

#### **Who We Are Section**
- **Left Content:**
  - Header: "Who we are"
  - Text: "Welcome to Creative Socially a new venture founded by a passionate duo committed to redefining brand storytelling. Based in Copenhagen, producing high-quality content ranging from professional ad campaigns to engaging product videos and striking photography. Our very own home studio is our creative haven, where we shoot videos, craft dynamic campaigns, and push the boundaries of creativity. Here, we work with a diverse roster of talent, including models who speak almost every language in the world, as well as a delightful array of animal models from dogs and cats to bunnies, birds, and more. This unique blend of talent allows us to create content that resonates with a truly global audience."
- **Right Content:**
  - Two photos of our employees making photo shoots

#### **Contact Us Section**
- Form fields:
  - Name
  - Email
  - Phone number
  - Message

#### **Footer** (global footer, used throughout all pages)
- Useful links
- Instagram, Facebook and TikTok logos links
- © 2025 Creative Socially

---

### **Products Page**
- A simple products page, where 4 products are shown as in the frontpage
- **Product 1:**
  - Name: Styled product images
  - Price: 499 DKK
- **Product 2:**
  - Name: Product video
  - Price: 999 DKK
- **Product 3:**
  - Name: Simple UGC
  - Price: 999 DKK
- **Product 4:**
  - Name: Enhanced UGC
  - Price: 1499 DKK
- Each product when pressed takes the user to the individual product page (via Shopify integration)

#### **Individual Product Pages**
- Detailed text description for the product
- Quantity selector with discount offer (get 30% discount over 5 pieces)
- Multiple product images
- Content creation process section showing workflow after purchase

---

### **Model Catalogue Page**
- Similar layout to products page but with pictures of our models
- Hover functionality where users can see model details:
  - Height
  - Weight
  - Eye color
  - Personal information in nicely formatted text box

#### **Become a Model Section**
- Text explaining what we offer at Creative Socially
- "Start" button leading to TypeForm for model applications
- Visually appealing design

---

### **About Us Page**
- Typical about us page
- Designed to look cool and match the overall styling of the website

---

### **Contact Us Page**
- Typical contact us page
- Designed to look cool in the overall styling of the website

---

## **E-commerce and User Features**

### **Sign-in Page**
- Connected to Shopify
- Accessible by clicking the profile logo in the header

### **Shopping Cart**
- Popup window on the left side
- Shows what the user has added to the cart
- Updates in real-time as items are added or removed

### **Shopify Integration**
- Product pages with real-time inventory
- Secure checkout process with multiple payment options
- Order tracking and management

---

## **Responsive Design**
- Mobile-friendly layouts that adapt to different screen sizes
- Consistent styling and branding across all device types
- Touch-optimized elements for mobile users

__________________________________________

# Creative Socially App Folder Structure

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