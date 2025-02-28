import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartIcon: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <Link to="/cart" className="relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
};

export default CartIcon;