import { useCallback, useEffect, useMemo, useState } from 'react';
import CartContext from './CartContext';

const CART_STORAGE_KEY = 'cart';

function clampQuantity(quantity, stock) {
  return Math.min(Math.max(Math.trunc(quantity) || 1, 1), stock);
}

// Lee el carrito guardado y descarta lo que no tenga la forma esperada (por ejemplo, datos de otra versión).
function loadItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));

    if (!Array.isArray(stored)) {
      return [];
    }

    return stored
      .filter(
        (item) =>
          typeof item?.productId === 'string' &&
          typeof item.name === 'string' &&
          Number.isFinite(item.price) &&
          Number.isFinite(item.stock) &&
          item.stock > 0 &&
          Number.isFinite(item.quantity),
      )
      .map((item) => ({
        productId: item.productId,
        name: item.name,
        image: typeof item.image === 'string' ? item.image : null,
        price: item.price,
        stock: item.stock,
        quantity: clampQuantity(item.quantity, item.stock),
      }));
  } catch {
    return [];
  }
}

// Precio vigente que se mostró al agregar el producto: `salePrice` si hay oferta; si no, `regularPrice`.
function getDisplayedPrice(product) {
  return product.salePrice ?? product.regularPrice;
}

// El carrito vive solo en el front. Los precios son orientativos: el Back es la fuente de verdad de precios, stock y totales.
function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Devuelve cuántas unidades se agregaron: 0 si no hay stock o si el carrito ya tiene todo el disponible.
  const addItem = useCallback(
    (product, quantity = 1) => {
      if (!product || product.stock <= 0) {
        return 0;
      }

      const current = items.find((item) => item.productId === product.id);
      const currentQuantity = current?.quantity ?? 0;
      const nextQuantity = Math.min(
        currentQuantity + Math.max(Math.trunc(quantity) || 1, 1),
        product.stock,
      );
      const added = nextQuantity - currentQuantity;

      if (added <= 0) {
        return 0;
      }

      // Se actualizan nombre, imagen, precio y stock con los datos más recientes del producto.
      const nextItem = {
        productId: product.id,
        name: product.name,
        image: product.images?.[0] ?? null,
        price: getDisplayedPrice(product),
        stock: product.stock,
        quantity: nextQuantity,
      };

      setItems(
        current
          ? items.map((item) =>
              item.productId === product.id ? nextItem : item,
            )
          : [...items, nextItem],
      );

      return added;
    },
    [items],
  );

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: clampQuantity(quantity, item.stock) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalAmount = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      totalItems,
      totalAmount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
