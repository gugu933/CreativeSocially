import { GraphQLClient } from 'graphql-request';

const endpoint = `https://jz95up-tv.myshopify.com/api/2024-01/graphql.json`;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': '160f91c77fcb03465888e7d77b8b5202',
  },
});

const client = {
  product: {
    fetchAll: async () => {
      const query = `
        query {
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price {
                        amount
                      }
                      image {
                        url
                      }
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      `;
      try {
        console.log('Fetching products...');
        const data = await graphQLClient.request(query);
        console.log('Products fetched:', data);
        if (!data.products?.edges) {
          throw new Error('No products data received from Shopify');
        }
        return data.products.edges.map(edge => edge.node);
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    fetch: async (id) => {
      const query = `
        query getProduct($id: ID!) {
          node(id: $id) {
            ... on Product {
              id
              title
              descriptionHtml
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                    }
                    image {
                      url
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      `;
      try {
        console.log('Fetching product with ID:', id);
        // Ensure the ID is properly formatted
        const formattedId = id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
        console.log('Formatted ID:', formattedId);
        
        const data = await graphQLClient.request(query, { id: formattedId });
        console.log('Product fetched:', JSON.stringify(data, null, 2));
        
        if (!data.node) {
          throw new Error('Product not found');
        }
        
        return data.node;
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response) {
          console.error('Error response:', error.response);
        }
        throw error;
      }
    }
  },
  cart: {
    create: async () => {
      const mutation = `
        mutation cartCreate {
          cartCreate {
            cart {
              id
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price {
                          amount
                        }
                        image {
                          url
                        }
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
              cost {
                subtotalAmount {
                  amount
                }
                totalTaxAmount {
                  amount
                }
                totalAmount {
                  amount
                }
              }
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      try {
        console.log('Creating new cart...');
        const data = await graphQLClient.request(mutation);
        console.log('Cart created:', data);
        if (data.cartCreate.userErrors.length > 0) {
          throw new Error(data.cartCreate.userErrors[0].message);
        }
        return data.cartCreate.cart;
      } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
      }
    },
    fetch: async (cartId) => {
      const query = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                      }
                      image {
                        url
                      }
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
            cost {
              subtotalAmount {
                amount
              }
              totalTaxAmount {
                amount
              }
              totalAmount {
                amount
              }
            }
            checkoutUrl
          }
        }
      `;
      try {
        console.log('Fetching cart:', cartId);
        const data = await graphQLClient.request(query, { cartId });
        console.log('Cart fetched:', data);
        return data.cart;
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
    },
    addLines: async (cartId, lineItems) => {
      const mutation = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price {
                          amount
                        }
                        image {
                          url
                        }
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
              cost {
                subtotalAmount {
                  amount
                }
                totalTaxAmount {
                  amount
                }
                totalAmount {
                  amount
                }
              }
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      try {
        console.log('Adding lines to cart:', { cartId, lineItems });
        const data = await graphQLClient.request(mutation, {
          cartId,
          lines: lineItems.map(item => ({
            merchandiseId: item.merchandiseId,
            quantity: item.quantity
          }))
        });
        console.log('Lines added to cart:', data);
        if (data.cartLinesAdd.userErrors.length > 0) {
          throw new Error(data.cartLinesAdd.userErrors[0].message);
        }
        return data.cartLinesAdd.cart;
      } catch (error) {
        console.error('Error adding lines to cart:', error);
        throw error;
      }
    },
    removeLines: async (cartId, lineItemIds) => {
      const mutation = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price {
                          amount
                        }
                        image {
                          url
                        }
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
              cost {
                subtotalAmount {
                  amount
                }
                totalTaxAmount {
                  amount
                }
                totalAmount {
                  amount
                }
              }
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      try {
        console.log('Removing lines from cart:', { cartId, lineItemIds });
        const data = await graphQLClient.request(mutation, {
          cartId,
          lineIds: lineItemIds
        });
        console.log('Lines removed from cart:', data);
        if (data.cartLinesRemove.userErrors.length > 0) {
          throw new Error(data.cartLinesRemove.userErrors[0].message);
        }
        return data.cartLinesRemove.cart;
      } catch (error) {
        console.error('Error removing lines from cart:', error);
        throw error;
      }
    },
    updateLines: async (cartId, lineItems) => {
      const mutation = `
        mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price {
                          amount
                        }
                        image {
                          url
                        }
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
              cost {
                subtotalAmount {
                  amount
                }
                totalTaxAmount {
                  amount
                }
                totalAmount {
                  amount
                }
              }
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      try {
        console.log('Updating lines in cart:', { cartId, lineItems });
        const data = await graphQLClient.request(mutation, {
          cartId,
          lines: lineItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        });
        console.log('Lines updated in cart:', data);
        if (data.cartLinesUpdate.userErrors.length > 0) {
          throw new Error(data.cartLinesUpdate.userErrors[0].message);
        }
        return data.cartLinesUpdate.cart;
      } catch (error) {
        console.error('Error updating lines in cart:', error);
        throw error;
      }
    }
  }
};

export default client; 