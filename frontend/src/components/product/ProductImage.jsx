import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getImageUrl } from '../../services/imageUrl';

// Bloque neutro si no hay imagen o si no carga. Quien cambia `src` en el lugar le pasa `key={src}`.
function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  const url = getImageUrl(src);

  if (!url || failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt}: imagen no disponible` : undefined}
        aria-hidden={alt ? undefined : true}
        className={`flex items-center justify-center bg-soft text-muted ${className}`}
      >
        <ImageOff aria-hidden="true" className="h-10 w-10" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-white object-contain ${className}`}
    />
  );
}

export default ProductImage;
