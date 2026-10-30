const PRICE_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const SIZE_CLASSES = {
  md: { current: 'text-xl', regular: 'text-sm' },
  lg: { current: 'text-3xl', regular: 'text-base' },
};

// Regla del contrato: con `salePrice` distinto de null, ese es el precio vigente y `regularPrice` va tachado.
function ProductPrice({ regularPrice, salePrice, size = 'md' }) {
  const classes = SIZE_CLASSES[size];
  const onSale = salePrice !== null && salePrice !== undefined;

  if (!onSale) {
    return (
      <p className={`font-bold text-ink ${classes.current}`}>
        {PRICE_FORMAT.format(regularPrice)}
      </p>
    );
  }

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-bold text-ink ${classes.current}`}>
        <span className="sr-only">Precio de oferta: </span>
        {PRICE_FORMAT.format(salePrice)}
      </span>
      <del className={`text-muted ${classes.regular}`}>
        <span className="sr-only">Precio anterior: </span>
        {PRICE_FORMAT.format(regularPrice)}
      </del>
    </p>
  );
}

export default ProductPrice;
