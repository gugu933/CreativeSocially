import { useState, useEffect } from 'react';

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      setScrollY(scrollY);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, []);

  return { scrollDirection, scrollY };
};

export default useScrollDirection; 