import { Link } from 'react-router';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="space-y-3">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
          <img
            src={product.image_file || product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-sm group-hover:text-muted-foreground transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.color}</p>
          <p className="text-sm">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </Link>
  );
}
