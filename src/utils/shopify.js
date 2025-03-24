import Client from 'shopify-buy';

// Initialize the client with your Shopify store's credentials
const client = Client.buildClient({
  domain: process.env.REACT_APP_SHOPIFY_STORE_URL,
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN
});

// Fetch all products
export const fetchProducts = async () => {
  try {
    const products = await client.product.fetchAll();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
  try {
    const product = await client.product.fetch(id);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Create checkout
export const createCheckout = async (variantId, quantity) => {
  try {
    const checkout = await client.checkout.create();
    await client.checkout.addLineItems(checkout.id, [{
      variantId,
      quantity
    }]);
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
};

export default client; 