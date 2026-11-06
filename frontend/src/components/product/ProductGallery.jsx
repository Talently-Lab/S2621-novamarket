import { useState } from 'react';
import ProductImage from './ProductImage';

const MAX_IMAGES = 5;

function ProductGallery({ images, alt }) {
  const [selected, setSelected] = useState(0);
  const list = (images ?? []).slice(0, MAX_IMAGES);
  const current = list[selected] ?? list[0];

  return (
    <div className="flex flex-col gap-3">
      <ProductImage
        key={current}
        src={current}
        alt={alt}
        className="aspect-square w-full rounded-card border border-border"
      />
      {list.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {list.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Ver imagen ${index + 1} de ${list.length}`}
                aria-pressed={index === selected}
                onClick={() => setSelected(index)}
                className={`focus-ring block w-full overflow-hidden rounded-control border-2 ${index === selected ? 'border-primary' : 'border-border hover:border-control-border'}`}
              >
                <ProductImage
                  src={image}
                  alt=""
                  className="aspect-square w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductGallery;
