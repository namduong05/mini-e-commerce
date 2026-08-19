import { Minus, Plus, Trash2 } from "lucide-react";
import type { Product } from "../../products/types";

type ParamsCartItem = {
  product: Product;
  quantity: number;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
};

const CartItem = ({
  product,
  quantity,
  updateQuantity,
  removeFromCart,
}: ParamsCartItem) => {
  return (
    <div className="flex gap-4 border-b border-gray-100 dark:border-gray-400 pb-4 last:border-0">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-20 w-20 rounded-lg bg-gray-50 object-cover border border-gray-200"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
              {product.title}
            </h4>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-blue-500 font-bold mt-0.5">
            ${product.price}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1 text-gray-500 dark:text-gray-200 hover:bg-gray-10 dark:hover:bg-gray-700 rounded-l-lg"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-3 text-xs font-semibold text-gray-700 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-1 text-gray-500 dark:text-gray-200 hover:bg-gray-10 dark:hover:bg-gray-700 rounded-r-lg"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
