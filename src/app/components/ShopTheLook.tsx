import { useState } from 'react';
import { useNavigate } from 'react-router';

// Defines the hotspot coordinates and the product it links to.
const HOTSPOTS = [
  {
    id: 1,
    productId: '1',
    name: 'Classic White Linen',
    price: '₹3,499',
    image: 'http://localhost:8000/media/products/shop_look_white.png',
    position: { top: '70%', left: '20%' }, // Left person chest
  },
  {
    id: 2,
    productId: '3',
    name: 'Navy Blue Linen',
    price: '₹3,599',
    image: 'http://localhost:8000/media/products/shop_look_navy.png',
    position: { top: '65%', left: '48%' }, // Center person chest
  },
  {
    id: 3,
    productId: '5',
    name: 'Olive Green Linen',
    price: '₹3,799',
    image: 'http://localhost:8000/media/products/shop_look_olive.png',
    position: { top: '70%', left: '78%' }, // Right person chest
  }
];

export default function ShopTheLook() {
  const navigate = useNavigate();
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null);

  const handleSpotClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Shop The Look</h2>
          <p className="text-muted-foreground text-lg">Click the red dots to shop exactly what they are wearing.</p>
        </div>

        {/* Image Container with Relative positioning for hotspots */}
        <div className="relative max-w-6xl mx-auto rounded-lg overflow-visible group">
          <img 
            src="/images/shop_the_look.png" 
            alt="Three stylish men wearing linen shirts"
            className="w-full h-auto object-cover rounded-lg shadow-xl"
            style={{ minHeight: '400px', maxHeight: '700px' }}
          />

          {/* Hotspots Mapping */}
          {HOTSPOTS.map((spot) => (
            <div 
              key={spot.id}
              className="absolute inline-block -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ top: spot.position.top, left: spot.position.left }}
              onMouseEnter={() => setHoveredSpot(spot.id)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={() => handleSpotClick(spot.productId)}
            >
              {/* Pulsing Red Dot */}
              <div className="relative flex h-5 w-5 md:h-6 md:w-6 cursor-pointer">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 md:h-6 md:w-6 bg-red-600 border-2 border-white shadow-lg"></span>
              </div>

              {/* Tooltip Popup */}
              <div 
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white/95 backdrop-blur-sm shadow-2xl rounded-md p-3 w-56 transition-all duration-300 pointer-events-none border border-border/50
                  ${hoveredSpot === spot.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
              >
                {/* Carrot/Triangle pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-white/95"></div>
                
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-16 flex-shrink-0 bg-muted rounded-sm overflow-hidden border border-border">
                    <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground mb-1 leading-tight line-clamp-2">{spot.name}</p>
                    <p className="text-sm text-muted-foreground">{spot.price}</p>
                    <p className="text-xs text-primary font-medium mt-1">Shop →</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
