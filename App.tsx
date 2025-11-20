import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { SupplyList } from './components/SupplyList';
import { FiringLog } from './components/FiringLog';
import { PhotoGallery } from './components/PhotoGallery';
import { PhotoCarousel } from './components/PhotoCarousel';
import { MaintenanceList } from './components/MaintenanceList';
import { Settings } from './components/Settings';
import { AddPhotoModal } from './components/AddPhotoModal';
import { StudioPlanner } from './components/StudioPlanner';
import { ArrowLeft, Plus, Image } from 'lucide-react';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  width: number; // in feet
  depth: number; // in feet
  x: number;
  y: number;
  purchased: boolean;
  priority: 'essential' | 'recommended' | 'optional';
  estimatedCost: string;
  brands: string[];
  notes: string;
  rotation: 0 | 90 | 180 | 270; // rotation in degrees
}

type ViewType = 'dashboard' | 'floorplan' | 'equipment' | 'shopping' | 'firing' | 'photos' | 'maintenance' | 'specs' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showPhotoCarousel, setShowPhotoCarousel] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  const [spaceWidth, setSpaceWidth] = useState(() => {
    const saved = localStorage.getItem('pottery-studio-width');
    return saved ? Number(saved) : 12;
  });
  const [spaceDepth, setSpaceDepth] = useState(() => {
    const saved = localStorage.getItem('pottery-studio-depth');
    return saved ? Number(saved) : 20;
  });
  const [showUtilities, setShowUtilities] = useState(() => {
    const saved = localStorage.getItem('pottery-studio-show-utilities');
    return saved ? JSON.parse(saved) : false;
  });
  const [showKilnClearance, setShowKilnClearance] = useState(() => {
    const saved = localStorage.getItem('pottery-studio-show-kiln-clearance');
    return saved ? JSON.parse(saved) : true;
  });
  const [manDoorPosition, setManDoorPosition] = useState(() => {
    const saved = localStorage.getItem('pottery-studio-door-position');
    return saved ? Number(saved) : 8;
  });

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('pottery-studio-equipment');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'wheel-1',
        name: 'Pottery Wheel',
        category: 'Wheels',
        width: 2,
        depth: 2.5,
        x: 1.5,
        y: 16.5,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$800-$2000',
        brands: ['Shimpo', 'Brent', 'Speedball'],
        notes: 'Shimpo VL-Whisper is quiet and reliable. Brent Model C is industry standard.',
        rotation: 0
      },
      {
        id: 'wheel-2',
        name: 'Pottery Wheel (Optional)',
        category: 'Wheels',
        width: 2,
        depth: 2.5,
        x: 4.5,
        y: 16.5,
        purchased: false,
        priority: 'optional',
        estimatedCost: '$800-$2000',
        brands: ['Shimpo', 'Brent', 'Speedball'],
        notes: 'Second wheel if you plan to teach or work with others.',
        rotation: 0
      },
      {
        id: 'kiln-1',
        name: 'Electric Kiln',
        category: 'Kilns',
        width: 2.5,
        depth: 2.5,
        x: 9,
        y: 1,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$1500-$4000',
        brands: ['L&L', 'Skutt', 'Olympic'],
        notes: 'Skutt KM-1027 (10 cu ft) is great for home studios. Needs 240V outlet. Keep 18" clearance.',
        rotation: 0
      },
      {
        id: 'worktable-1',
        name: 'Wedging/Work Table',
        category: 'Work Surfaces',
        width: 3,
        depth: 2.5,
        x: 5,
        y: 7,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$200-$600',
        brands: ['Custom/DIY', 'Continental Clay', 'Bailey'],
        notes: 'Canvas-covered plaster surface ideal for wedging. Counter height (36").',
        rotation: 0
      },
      {
        id: 'worktable-2',
        name: 'Hand-building Table',
        category: 'Work Surfaces',
        width: 4,
        depth: 3,
        x: 1,
        y: 12.5,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$150-$400',
        brands: ['DIY', 'IKEA (modified)', 'Adjustable workbench'],
        notes: 'Sturdy table for slab building and handwork. 30-36" height.',
        rotation: 0
      },
      {
        id: 'sink-1',
        name: 'Clay Sink w/ Trap',
        category: 'Plumbing',
        width: 2,
        depth: 2,
        x: 10,
        y: 10,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$300-$800',
        brands: ['Plaster trap (DIY)', 'Continental Clay', 'Bluebird'],
        notes: 'MUST have sediment trap to prevent clay clogging plumbing. Never wash clay down regular drain.',
        rotation: 0
      },
      {
        id: 'shelving-1',
        name: 'Greenware Drying Shelf #1',
        category: 'Storage',
        width: 2,
        depth: 1.5,
        x: 1,
        y: 1,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$150-$400',
        brands: ['Continental Clay', 'Bailey', 'Wire shelving (DIY)'],
        notes: 'For drying greenware. Needs good airflow between shelves. 4-6 shelves high.',
        rotation: 0
      },
      {
        id: 'shelving-2',
        name: 'Greenware Drying Shelf #2',
        category: 'Storage',
        width: 2,
        depth: 1.5,
        x: 4,
        y: 1,
        purchased: false,
        priority: 'recommended',
        estimatedCost: '$150-$400',
        brands: ['Continental Clay', 'Bailey', 'Wire shelving (DIY)'],
        notes: 'Additional drying space. You can never have too many drying shelves!',
        rotation: 0
      },
      {
        id: 'shelving-3',
        name: 'Glaze/Tool Storage',
        category: 'Storage',
        width: 2,
        depth: 1.5,
        x: 7,
        y: 1,
        purchased: false,
        priority: 'recommended',
        estimatedCost: '$100-$300',
        brands: ['Wire shelving', 'Gladiator garage system', 'Husky'],
        notes: 'Store glazes, tools, and supplies. Keep organized and labeled.',
        rotation: 0
      },
      {
        id: 'shelving-4',
        name: 'Finished Ware Storage',
        category: 'Storage',
        width: 2,
        depth: 1.5,
        x: 10,
        y: 5,
        purchased: false,
        priority: 'recommended',
        estimatedCost: '$100-$300',
        brands: ['Wire shelving', 'Metro shelving', 'Gladiator'],
        notes: 'For storing bisque-fired and finished pieces. Keep separate from greenware.',
        rotation: 0
      },
      {
        id: 'clay-storage',
        name: 'Clay Storage',
        category: 'Storage',
        width: 2,
        depth: 2,
        x: 10,
        y: 14.5,
        purchased: false,
        priority: 'essential',
        estimatedCost: '$50-$200',
        brands: ['Rubbermaid containers', 'Trash cans with lids'],
        notes: 'Keep clay moist. Airtight containers or lined trash cans work well. Store 100-200 lbs.',
        rotation: 0
      },
      {
        id: 'reclaim-station',
        name: 'Clay Reclaim/Slop Buckets',
        category: 'Clay Prep',
        width: 2,
        depth: 2,
        x: 7.5,
        y: 14.5,
        purchased: false,
        priority: 'recommended',
        estimatedCost: '$30-$100',
        brands: ['5-gallon buckets', 'Rubbermaid', 'Home Depot buckets'],
        notes: 'For clay scraps and throwing slurry. Let settle, pour off water, reclaim clay. Get 4-6 buckets.',
        rotation: 0
      },
      {
        id: 'pugmill',
        name: 'Pug Mill (Optional)',
        category: 'Clay Prep',
        width: 2,
        depth: 3,
        x: 5.5,
        y: 14.5,
        purchased: false,
        priority: 'optional',
        estimatedCost: '$1500-$3500',
        brands: ['Peter Pugger', 'Venco', 'Bluebird'],
        notes: 'For recycling clay. Not essential when starting out. Can wedge by hand.',
        rotation: 0
      },
      {
        id: 'bat-storage',
        name: 'Bat & Board Rack',
        category: 'Storage',
        width: 1.5,
        depth: 1,
        x: 7.5,
        y: 16.5,
        purchased: false,
        priority: 'recommended',
        estimatedCost: '$50-$150',
        brands: ['DIY wall-mounted', 'Continental Clay'],
        notes: 'Wall-mounted or standing rack for wheel bats and drying boards. Essential for throwing.',
        rotation: 0
      },
      {
        id: 'tool-cart',
        name: 'Rolling Tool Cart',
        category: 'Storage',
        width: 1.5,
        depth: 2,
        x: 1,
        y: 4,
        purchased: false,
        priority: 'recommended',
        estimatedCost: '$100-$300',
        brands: ['Husky rolling cart', 'IKEA Raskog', 'Harbor Freight'],
        notes: 'Mobile storage for frequently used tools. Keep by your wheel/work area.',
        rotation: 0
      }
    ];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('pottery-studio-equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('pottery-studio-width', String(spaceWidth));
  }, [spaceWidth]);

  useEffect(() => {
    localStorage.setItem('pottery-studio-depth', String(spaceDepth));
  }, [spaceDepth]);

  useEffect(() => {
    localStorage.setItem('pottery-studio-show-utilities', JSON.stringify(showUtilities));
  }, [showUtilities]);

  useEffect(() => {
    localStorage.setItem('pottery-studio-show-kiln-clearance', JSON.stringify(showKilnClearance));
  }, [showKilnClearance]);

  useEffect(() => {
    localStorage.setItem('pottery-studio-door-position', String(manDoorPosition));
  }, [manDoorPosition]);

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const togglePurchased = (id: string) => {
    setEquipment(prev =>
      prev.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item)
    );
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id' | 'x' | 'y' | 'rotation'>) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: Equipment = {
      ...newEquipment,
      id,
      x: 1, // Start position
      y: 5,
      rotation: 0
    };
    setEquipment(prev => [...prev, newItem]);
  };

  const resetToDefaults = () => {
    if (confirm('Reset all data to defaults? This will clear all your changes.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Calculate stats for dashboard
  const getLastSavedTime = () => {
    const lastSaved = localStorage.getItem('pottery-studio-last-saved');
    if (!lastSaved) return 'just now';
    
    const diff = Date.now() - Number(lastSaved);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getSupplyCount = () => {
    const saved = localStorage.getItem('pottery-studio-supply-items');
    if (!saved) return 23; // Default count
    const items = JSON.parse(saved);
    return items.filter((item: any) => !item.purchased).length;
  };

  const getFiringCount = () => {
    const saved = localStorage.getItem('pottery-studio-firing-log');
    if (!saved) return 0;
    const logs = JSON.parse(saved);
    return logs.length;
  };

  const getPhotoCount = () => {
    const saved = localStorage.getItem('pottery-studio-photos');
    if (!saved) return 0;
    const photos = JSON.parse(saved);
    return photos.length;
  };

  const getMaintenanceCount = () => {
    const saved = localStorage.getItem('pottery-studio-maintenance');
    if (!saved) return 8; // Default count
    const tasks = JSON.parse(saved);
    return tasks.filter((task: any) => !task.completed).length;
  };

  // Update last saved time
  useEffect(() => {
    localStorage.setItem('pottery-studio-last-saved', String(Date.now()));
  }, [equipment, spaceWidth, spaceDepth, showUtilities, showKilnClearance, manDoorPosition]);

  const dashboardStats = {
    equipmentCount: equipment.length,
    shoppingCount: getSupplyCount(),
    firingCount: getFiringCount(),
    photoCount: getPhotoCount(),
    maintenanceCount: getMaintenanceCount(),
    lastSaved: getLastSavedTime()
  };

  // Detail Page Header Component
  const DetailHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <header className="bg-white border-b border-border sticky top-0 z-20 shadow-sm">
      <div className="px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-terracotta-600">{title}</h1>
      </div>
    </header>
  );

  // Render current view
  if (currentView === 'dashboard') {
    return (
      <>
        <Dashboard 
          onNavigate={setCurrentView} 
          onOpenAddPhoto={() => setShowAddPhotoModal(true)}
          onOpenCarousel={() => setShowPhotoCarousel(true)}
          stats={dashboardStats} 
        />
        
        {/* Photo Modals */}
        {showPhotoCarousel && <PhotoCarousel onClose={() => setShowPhotoCarousel(false)} />}
        {showAddPhotoModal && (
          <AddPhotoModal 
            onClose={() => setShowAddPhotoModal(false)}
            onPhotoAdded={() => {
              setShowAddPhotoModal(false);
              window.dispatchEvent(new Event('storage'));
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Studio Planner - Unified View */}
      {currentView === 'floorplan' && (
        <>
          <DetailHeader title="Studio Planner" onBack={() => setCurrentView('dashboard')} />
          <StudioPlanner
            width={spaceWidth}
            depth={spaceDepth}
            equipment={equipment}
            onUpdateEquipment={updateEquipment}
            onDeleteEquipment={deleteEquipment}
            onAddEquipment={addEquipment}
            onTogglePurchased={togglePurchased}
            manDoorPosition={manDoorPosition}
            initialTab="equipment"
          />
        </>
      )}

      {/* Equipment View - Opens Studio Planner with Equipment tab */}
      {currentView === 'equipment' && (
        <>
          <DetailHeader title="Studio Planner" onBack={() => setCurrentView('dashboard')} />
          <StudioPlanner
            width={spaceWidth}
            depth={spaceDepth}
            equipment={equipment}
            onUpdateEquipment={updateEquipment}
            onDeleteEquipment={deleteEquipment}
            onAddEquipment={addEquipment}
            onTogglePurchased={togglePurchased}
            manDoorPosition={manDoorPosition}
            initialTab="current"
          />
        </>
      )}

      {/* Building Specs View - Opens Studio Planner with Specs tab */}
      {currentView === 'specs' && (
        <>
          <DetailHeader title="Studio Planner" onBack={() => setCurrentView('dashboard')} />
          <StudioPlanner
            width={spaceWidth}
            depth={spaceDepth}
            equipment={equipment}
            onUpdateEquipment={updateEquipment}
            onDeleteEquipment={deleteEquipment}
            onAddEquipment={addEquipment}
            onTogglePurchased={togglePurchased}
            manDoorPosition={manDoorPosition}
            initialTab="specs"
          />
        </>
      )}

      {/* Shopping List View */}
      {currentView === 'shopping' && (
        <>
          <DetailHeader title="Supply Shopping List" onBack={() => setCurrentView('dashboard')} />
          <div className="p-4 max-w-4xl mx-auto">
            <SupplyList />
          </div>
        </>
      )}

      {/* Firing Log View */}
      {currentView === 'firing' && (
        <>
          <DetailHeader title="Firing Log" onBack={() => setCurrentView('dashboard')} />
          <div className="p-4 max-w-4xl mx-auto">
            <FiringLog />
          </div>
        </>
      )}

      {/* Photo Gallery View */}
      {currentView === 'photos' && (
        <>
          <DetailHeader title="Photo Gallery" onBack={() => setCurrentView('dashboard')} />
          <div className="px-4 py-3 bg-white border-b border-border flex gap-3 sticky top-[65px] z-10">
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Photo</span>
            </button>
            <button
              onClick={() => setShowPhotoCarousel(true)}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-all"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm">View Carousel</span>
            </button>
          </div>
          <div className="p-4 max-w-4xl mx-auto">
            <PhotoGallery />
          </div>
        </>
      )}

      {/* Maintenance View */}
      {currentView === 'maintenance' && (
        <>
          <DetailHeader title="Maintenance Schedule" onBack={() => setCurrentView('dashboard')} />
          <div className="p-4 max-w-4xl mx-auto">
            <MaintenanceList />
          </div>
        </>
      )}

      {/* Settings View */}
      {currentView === 'settings' && (
        <>
          <DetailHeader title="Settings" onBack={() => setCurrentView('dashboard')} />
          <div className="p-4 max-w-4xl mx-auto">
            <Settings onReset={resetToDefaults} />
          </div>
        </>
      )}

      {/* Add Photo View */}
      {currentView === 'addphoto' && (
        <>
          <DetailHeader title="Add Photo" onBack={() => setCurrentView('dashboard')} />
          <div className="p-4 max-w-4xl mx-auto">
            <AddPhotoModal 
              onClose={() => setCurrentView('dashboard')}
              onPhotoAdded={() => {
                window.dispatchEvent(new Event('storage'));
              }}
            />
          </div>
        </>
      )}

      {/* Photo Modals */}
      {showPhotoCarousel && <PhotoCarousel onClose={() => setShowPhotoCarousel(false)} />}
      {showAddPhotoModal && (
        <AddPhotoModal 
          onClose={() => setShowAddPhotoModal(false)}
          onPhotoAdded={() => {
            setShowAddPhotoModal(false);
            window.dispatchEvent(new Event('storage'));
          }}
        />
      )}
    </div>
  );
}
