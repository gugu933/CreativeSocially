import { useState, useEffect } from 'react';
import client from '../lib/shopify';

export function useShopifyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await client.product.fetchAll();
        console.log('Fetched products:', products);
        setProducts(products);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useShopifyProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const product = await client.product.fetch(id);
        setProduct(product);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export const useShopify = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const products = await client.product.fetchAll();
      setProducts(products);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchProduct = async (handle) => {
    try {
      const product = await client.product.fetchByHandle(handle);
      setLoading(false);
      return product;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  const createCheckout = async (lineItems) => {
    try {
      const checkout = await client.checkout.create({
        lineItems: lineItems
      });
      return checkout;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProduct,
    createCheckout
  };
}; 