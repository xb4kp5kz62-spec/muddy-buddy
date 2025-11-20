import { LayoutGrid, Package, ShoppingCart, Flame, Camera, Wrench, FileText, Settings, Plus, Image } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardTileProps {
  title: string;
  icon: React.ReactNode;
  stat: string;
  color: string;
  onClick: () => void;
}

function DashboardTile({ title, icon, stat, color, onClick }: DashboardTileProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} relative overflow-hidden rounded-xl aspect-square group shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-3 flex flex-col items-center justify-center text-center`}
    >
      {/* Icon - Much Larger */}
      <div className="text-white w-16 h-16 mb-2">
        {icon}
      </div>
      
      {/* Title & Stat */}
      <div>
        <h3 className="text-white mb-0.5 text-sm leading-tight">{title}</h3>
        <p className="text-white/90 text-xs">{stat}</p>
      </div>
    </button>
  );
}

interface DashboardProps {
  onNavigate: (view: string) => void;
  onOpenAddPhoto: () => void;
  onOpenCarousel: () => void;
  stats: {
    equipmentCount: number;
    shoppingCount: number;
    firingCount: number;
    photoCount: number;
    maintenanceCount: number;
    lastSaved: string;
  };
}

export function Dashboard({ onNavigate, onOpenAddPhoto, onOpenCarousel, stats }: DashboardProps) {
  const defaultTiles = [
    {
      id: 'floorplan',
      title: 'Studio Planner',
      icon: <LayoutGrid className="w-full h-full" />,
      getStat: () => `Saved ${stats.lastSaved}`,
      color: 'bg-terracotta-500 hover:bg-terracotta-600',
    },
    {
      id: 'shopping',
      title: 'Shopping List',
      icon: <ShoppingCart className="w-full h-full" />,
      getStat: () => `${stats.shoppingCount} supplies`,
      color: 'bg-celadon-600 hover:bg-celadon-700',
    },
    {
      id: 'firing',
      title: 'Firing Log',
      icon: <Flame className="w-full h-full" />,
      getStat: () => `${stats.firingCount} firings`,
      color: 'bg-celadon-500 hover:bg-celadon-600',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-full h-full" />,
      getStat: () => 'Manage app',
      color: 'bg-ochre-600 hover:bg-ochre-600/90',
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      icon: <Wrench className="w-full h-full" />,
      getStat: () => `${stats.maintenanceCount} tasks`,
      color: 'bg-ochre-500 hover:bg-ochre-600',
    },
    {
      id: 'photos',
      title: 'Photo Gallery',
      icon: <Image className="w-full h-full" />,
      getStat: () => `${stats.photoCount} photos`,
      color: 'bg-slate-600 hover:bg-slate-700',
    },
  ];

  const [tileOrder, setTileOrder] = useState<string[]>([]);

  // Load tile order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboardTileOrder');
    if (savedOrder) {
      setTileOrder(JSON.parse(savedOrder));
    } else {
      setTileOrder(defaultTiles.map(t => t.id));
    }
  }, []);

  // Save tile order to localStorage whenever it changes
  useEffect(() => {
    if (tileOrder.length > 0) {
      localStorage.setItem('dashboardTileOrder', JSON.stringify(tileOrder));
    }
  }, [tileOrder]);

  // Create ordered tiles array based on saved order
  const tiles = tileOrder.length > 0
    ? tileOrder.map(id => {
        const tile = defaultTiles.find(t => t.id === id);
        return tile ? { ...tile, stat: tile.getStat() } : null;
      }).filter(Boolean)
    : defaultTiles.map(t => ({ ...t, stat: t.getStat() }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-terracotta-600 border-b-4 border-ochre-300 shadow-md relative overflow-hidden">
        {/* Textured Background Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.5) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(0,0,0,0.2) 0%, transparent 50%),
              radial-gradient(circle at 60% 60%, rgba(255,255,255,0.3) 0%, transparent 50%),
              repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px),
              repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 15px 15px, 15px 15px'
          }}
        />
        
        <div className="px-4 py-6 relative">
          <h1 
            className="text-center text-white drop-shadow-lg"
            style={{
              fontFamily: "'Lilita One', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
              textShadow: '3px 3px 6px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.3), 1px 1px 0 rgba(0,0,0,0.2)'
            }}
          >
            Muddy Buddy
            <br />
            <span style={{ fontSize: '1.75rem' }}>Pottery Planner</span>
          </h1>
        </div>
        {/* Photo Action Buttons */}
        <div className="px-4 pb-4 flex gap-3 justify-center relative">
          <button
            onClick={onOpenAddPhoto}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-ochre-50 text-terracotta-600 rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Photo</span>
          </button>
          <button
            onClick={onOpenCarousel}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-ochre-50 text-terracotta-600 rounded-lg transition-all shadow-sm"
          >
            <Image className="w-4 h-4" />
            <span className="text-sm">View Carousel</span>
          </button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {tiles.map((tile) => (
            <DashboardTile
              key={tile.id}
              title={tile.title}
              icon={tile.icon}
              stat={tile.stat}
              color={tile.color}
              onClick={() => onNavigate(tile.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
