import { Equipment } from '../App';
import { FloorPlan } from './FloorPlan';
import { EquipmentPanel } from './EquipmentPanel';
import { ContractorSpecs } from './ContractorSpecs';
import { AddEquipmentForm } from './AddEquipmentForm';
import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Package, Plus, FileText, X } from 'lucide-react';

interface StudioPlannerProps {
  width: number;
  depth: number;
  equipment: Equipment[];
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => void;
  onDeleteEquipment: (id: string) => void;
  onAddEquipment: (equipment: Omit<Equipment, 'id' | 'x' | 'y' | 'rotation'>) => void;
  onTogglePurchased: (id: string) => void;
  manDoorPosition?: number;
  initialTab?: 'equipment' | 'current' | 'specs';
}

type DrawerTab = 'equipment' | 'current' | 'specs';

export function StudioPlanner({
  width,
  depth,
  equipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onAddEquipment,
  onTogglePurchased,
  manDoorPosition = 8,
  initialTab = 'equipment'
}: StudioPlannerProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<DrawerTab>(initialTab);
  const [drawerHeight, setDrawerHeight] = useState(450);
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Handle drawer resize via touch/mouse drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startHeight.current = drawerHeight;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const delta = startY.current - clientY;
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.8, startHeight.current + delta));
      setDrawerHeight(newHeight);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const floorPlanItems = equipment.filter(e => e.x !== undefined && e.y !== undefined);
  const catalogItems = equipment.filter(e => e.x === undefined || e.y === undefined);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Studio Planner - Full Screen */}
      <div 
        className="absolute inset-0 overflow-auto pb-20 z-0"
        style={{ 
          paddingBottom: drawerOpen ? `${drawerHeight}px` : '80px',
          transition: isDragging ? 'none' : 'padding-bottom 0.3s ease-in-out'
        }}
      >
        <div className="p-4">
          <FloorPlan
            width={width}
            depth={depth}
            equipment={floorPlanItems}
            onUpdateEquipment={onUpdateEquipment}
            onDeleteEquipment={onDeleteEquipment}
            manDoorPosition={manDoorPosition}
          />
        </div>
      </div>

      {/* Bottom Drawer */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-terracotta-500 shadow-2xl transition-transform duration-300 z-50 ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ 
          height: drawerOpen ? `${drawerHeight}px` : 'auto',
          transform: drawerOpen ? 'translateY(0)' : `translateY(calc(100% - 60px))`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-in-out, height 0.3s ease-in-out'
        }}
      >
        {/* Drag Handle */}
        <div
          className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing bg-terracotta-600 hover:bg-terracotta-700 transition-colors"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-white/50 rounded-full" />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="absolute top-0 right-4 mt-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white p-1 rounded-full shadow-lg transition-colors z-10"
        >
          {drawerOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Drawer Header with Tabs */}
        <div className="pt-8 px-4 pb-2 border-b border-slate-200 bg-slate-50">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('equipment');
                setDrawerOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'equipment'
                  ? 'bg-white text-terracotta-600 border-t-2 border-x-2 border-terracotta-500'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Equipment</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('current');
                setDrawerOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'current'
                  ? 'bg-white text-terracotta-600 border-t-2 border-x-2 border-terracotta-500'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="text-sm">Equipment List ({equipment.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('specs');
                setDrawerOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'bg-white text-terracotta-600 border-t-2 border-x-2 border-terracotta-500'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Building Specs</span>
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="overflow-y-auto px-4 py-4" style={{ height: `calc(${drawerHeight}px - 120px)` }}>
          {activeTab === 'equipment' && (
            <div>
              <h3 className="text-slate-900 mb-3">Add Equipment to Studio</h3>
              <p className="text-sm text-slate-600 mb-4">
                Add new equipment to your catalog. You can then drag it onto your studio layout.
              </p>
              <AddEquipmentForm onAddEquipment={onAddEquipment} />
              
              {catalogItems.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-slate-700 mb-3">Equipment Catalog (Not Yet Placed)</h4>
                  <div className="space-y-2">
                    {catalogItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-600">
                            {item.width}' × {item.depth}' • {item.estimatedCost}
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteEquipment(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'current' && (
            <div>
              <EquipmentPanel
                equipment={equipment}
                onTogglePurchased={onTogglePurchased}
                onDeleteEquipment={onDeleteEquipment}
              />
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <ContractorSpecs />
            </div>
          )}
        </div>
      </div>

      {/* Floating hint when drawer is closed */}
      {!drawerOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-terracotta-600 text-white text-center py-3 text-sm">
          Swipe up or tap to access equipment & specs
        </div>
      )}
    </div>
  );
}
