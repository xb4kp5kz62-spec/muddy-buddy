import { Equipment } from '../App';
import { DraggableEquipment } from './DraggableEquipment';
import { useState } from 'react';
import { Zap, Droplets, Wind, AlertTriangle } from 'lucide-react';

interface FloorPlanProps {
  width: number;
  depth: number;
  equipment: Equipment[];
  onUpdateEquipment: (id: string, updates: Partial<Equipment>) => void;
  onDeleteEquipment?: (id: string) => void;
  manDoorPosition?: number;
}

export function FloorPlan({ width, depth, equipment, onUpdateEquipment, onDeleteEquipment, manDoorPosition = 8 }: FloorPlanProps) {
  // Responsive scale: smaller on mobile, larger on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 20 : 30; // pixels per foot - 20 for mobile, 30 for desktop
  const pixelWidth = width * scale;
  const pixelDepth = depth * scale;
  const [showUtilities, setShowUtilities] = useState(false);
  const [showKilnClearance, setShowKilnClearance] = useState(true);
  const [showKilnWall, setShowKilnWall] = useState(false);
  
  // Define door positions and sizes
  const garageDoorWidth = width; // Full width at bottom
  const garageDoorHeight = 0.5; // Visual representation
  const manDoorWidth = 3; // 3 foot wide door
  const manDoorHeight = 0.5;
  const exteriorDoorPosition = 16; // Position along the right wall (exterior)
  
  // Find the kiln
  const kiln = equipment.find(item => item.id === 'kiln-1');
  const sink = equipment.find(item => item.id === 'sink-1');
  const wheel = equipment.find(item => item.id === 'wheel-1');

  return (
    <div className="relative">
      {/* Control buttons */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowKilnClearance(!showKilnClearance)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            showKilnClearance
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Kiln Safety Zone (18")
        </button>
        
        <button
          onClick={() => setShowUtilities(!showUtilities)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            showUtilities
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          Show Utilities
        </button>
        
        <button
          onClick={() => setShowKilnWall(!showKilnWall)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            showKilnWall
              ? 'bg-purple-100 text-purple-700 border border-purple-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Kiln Enclosure Wall
        </button>
      </div>

      <div
        className="relative bg-slate-100 border-2 border-slate-300 mx-auto"
        style={{
          width: `${pixelWidth}px`,
          height: `${pixelDepth}px`,
          maxWidth: '100%',
          aspectRatio: `${width} / ${depth}`
        }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {/* Vertical lines every foot */}
          {Array.from({ length: width + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i / width) * 100}%`}
              y1="0%"
              x2={`${(i / width) * 100}%`}
              y2="100%"
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          {/* Horizontal lines every foot */}
          {Array.from({ length: depth + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0%"
              y1={`${(i / depth) * 100}%`}
              x2="100%"
              y2={`${(i / depth) * 100}%`}
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          
          {/* Bold lines every 5 feet */}
          {Array.from({ length: Math.floor(width / 5) + 1 }).map((_, i) => (
            <line
              key={`vb-${i}`}
              x1={`${(i * 5 / width) * 100}%`}
              y1="0%"
              x2={`${(i * 5 / width) * 100}%`}
              y2="100%"
              stroke="#94a3b8"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}
          {Array.from({ length: Math.floor(depth / 5) + 1 }).map((_, i) => (
            <line
              key={`hb-${i}`}
              x1="0%"
              y1={`${(i * 5 / depth) * 100}%`}
              x2="100%"
              y2={`${(i * 5 / depth) * 100}%`}
              stroke="#94a3b8"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}
          
          {/* Garage Door at bottom (full 12' width) */}
          <rect
            x="0"
            y={`${((depth - garageDoorHeight) / depth) * 100}%`}
            width="100%"
            height={`${(garageDoorHeight / depth) * 100}%`}
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="2"
          />
          <text
            x="50%"
            y={`${((depth - garageDoorHeight / 2) / depth) * 100}%`}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
          >
            GARAGE DOOR ({width}')
          </text>
          
          {/* Man Door on left wall (new wall to other garage bays) */}
          <rect
            x="0"
            y={`${(manDoorPosition / depth) * 100}%`}
            width={`${(manDoorHeight / width) * 100}%`}
            height={`${(manDoorWidth / depth) * 100}%`}
            fill="#475569"
            stroke="#334155"
            strokeWidth="2"
          />
          <text
            x={`${(manDoorHeight / 2 / width) * 100}%`}
            y={`${((manDoorPosition + manDoorWidth / 2) / depth) * 100}%`}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            transform={`rotate(-90, ${((manDoorHeight / 2 / width) * 100).toFixed(2)}%, ${(((manDoorPosition + manDoorWidth / 2) / depth) * 100).toFixed(2)}%)`}
          >
            DOOR
          </text>
          
          {/* Exterior Door on right wall */}
          <rect
            x={`${((width - manDoorHeight) / width) * 100}%`}
            y={`${(exteriorDoorPosition / depth) * 100}%`}
            width={`${(manDoorHeight / width) * 100}%`}
            height={`${(manDoorWidth / depth) * 100}%`}
            fill="#475569"
            stroke="#334155"
            strokeWidth="2"
          />
          <text
            x={`${((width - manDoorHeight / 2) / width) * 100}%`}
            y={`${((exteriorDoorPosition + manDoorWidth / 2) / depth) * 100}%`}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            transform={`rotate(-90, ${(((width - manDoorHeight / 2) / width) * 100).toFixed(2)}%, ${(((exteriorDoorPosition + manDoorWidth / 2) / depth) * 100).toFixed(2)}%)`}
          >
            DOOR
          </text>
          
          {/* Wall label - Interior (top) - stays inside */}
          <text
            x="50%"
            y="3%"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
          >
            Interior Wall
          </text>
        </svg>

        {/* Dimensions */}
        <div className="absolute -top-6 left-0 right-0 text-center text-sm text-slate-600">
          {width}'
        </div>
        <div className="absolute -left-8 top-0 bottom-0 flex items-center text-sm text-slate-600">
          <div className="transform -rotate-90">{depth}'</div>
        </div>
        
        {/* Wall Labels - Outside the box - Only show with utilities */}
        {showUtilities && (
          <>
            <div className="absolute -right-24 top-0 bottom-0 flex items-center text-xs text-slate-600">
              <div className="transform rotate-90 whitespace-nowrap">
                Exterior Wall (Sink Here)
              </div>
            </div>
            
            <div className="absolute -left-24 top-0 bottom-0 flex items-center text-xs text-slate-600">
              <div className="transform -rotate-90 whitespace-nowrap">
                New Wall (to other bays)
              </div>
            </div>
          </>
        )}

        {/* Equipment */}
        {equipment.map((item) => (
          <DraggableEquipment
            key={item.id}
            equipment={item}
            scale={scale}
            maxX={width}
            maxY={depth}
            onUpdate={onUpdateEquipment}
            onDelete={onDeleteEquipment}
          />
        ))}
        
        {/* Kiln Safety Clearance Zone */}
        {showKilnClearance && kiln && (
          <div
            className="absolute border-2 border-dashed border-red-500 bg-red-100 bg-opacity-30 pointer-events-none"
            style={{
              left: `${((kiln.x - 1.5) / width) * 100}%`,
              top: `${((kiln.y - 1.5) / depth) * 100}%`,
              width: `${((kiln.width + 3) / width) * 100}%`,
              height: `${((kiln.depth + 3) / depth) * 100}%`,
              zIndex: 5
            }}
          >
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 rounded-br">
              18" CLEARANCE
            </div>
          </div>
        )}
        
        {/* Optional Kiln Enclosure Wall */}
        {showKilnWall && kiln && (
          <>
            {/* Wall around kiln area */}
            <div
              className="absolute border-4 border-purple-700 bg-purple-200 bg-opacity-20 pointer-events-none"
              style={{
                left: `${((kiln.x - 2) / width) * 100}%`,
                top: `0%`,
                width: `${((kiln.width + 4) / width) * 100}%`,
                height: `${((kiln.y + kiln.depth + 2) / depth) * 100}%`,
                zIndex: 4
              }}
            >
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white text-xs px-2 py-1 rounded">
                Optional Fire-Rated Kiln Room ({((kiln.width + 4)).toFixed(1)}' x {(kiln.y + kiln.depth + 2).toFixed(1)}')
              </div>
            </div>
            <div className="absolute text-xs text-purple-700 bg-white px-2 py-1 rounded border border-purple-300" style={{
              left: `${((kiln.x) / width) * 100}%`,
              top: `${((kiln.y + kiln.depth + 2.5) / depth) * 100}%`,
              zIndex: 15
            }}>
              Entry to kiln room
            </div>
          </>
        )}
        
        {/* Utilities Overlay */}
        {showUtilities && (
          <>
            {/* 240V for Kiln */}
            {kiln && (
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  left: `${((kiln.x + kiln.width / 2) / width) * 100}%`,
                  top: `${((kiln.y + kiln.depth / 2) / depth) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 15
                }}
              >
                <div className="flex flex-col items-center bg-yellow-500 text-black px-2 py-1 rounded shadow-lg">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs whitespace-nowrap">240V/50A</span>
                </div>
              </div>
            )}
            
            {/* Kiln Vent */}
            {kiln && (
              <div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  left: `${((kiln.x + kiln.width + 0.5) / width) * 100}%`,
                  top: `${((kiln.y) / depth) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 15
                }}
              >
                <div className="flex flex-col items-center bg-cyan-500 text-white px-2 py-1 rounded shadow-lg">
                  <Wind className="w-4 h-4" />
                  <span className="text-xs whitespace-nowrap">Vent to Ext.</span>
                </div>
              </div>
            )}
            
            {/* Sink Plumbing */}
            {sink && (
              <>
                <div
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{
                    left: `${((sink.x + sink.width / 2) / width) * 100}%`,
                    top: `${((sink.y + sink.depth / 2) / depth) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 15
                  }}
                >
                  <div className="flex flex-col items-center bg-blue-500 text-white px-2 py-1 rounded shadow-lg">
                    <Droplets className="w-4 h-4" />
                    <span className="text-xs whitespace-nowrap">Water + Drain</span>
                  </div>
                </div>
                <div
                  className="absolute text-xs bg-blue-100 text-blue-900 px-1 rounded border border-blue-300 pointer-events-none"
                  style={{
                    left: `${((sink.x + sink.width / 2) / width) * 100}%`,
                    top: `${((sink.y + sink.depth + 0.3) / depth) * 100}%`,
                    transform: 'translateX(-50%)',
                    zIndex: 15
                  }}
                >
                  Sediment trap required
                </div>
              </>
            )}
            
            {/* General 120V outlets along walls */}
            <div className="absolute bottom-1 left-4 bg-yellow-400 text-black text-xs px-2 py-1 rounded shadow pointer-events-none" style={{ zIndex: 15 }}>
              <Zap className="w-3 h-3 inline mr-1" />
              120V outlets every 6' along walls
            </div>
          </>
        )}
      </div>

      <div className="mt-4 text-sm text-slate-600">
        <p className="mb-2">💡 <span className="text-slate-700">Optimized Layout:</span></p>
        <ul className="space-y-1 ml-4">
          <li>• <span className="text-slate-900">Wheels near garage door:</span> Natural light and fresh air when door is open!</li>
          <li>• <span className="text-slate-900">Work flow:</span> Storage shelves (back) → Wedging table (center) → Hand-building/Wheel (front) → Sink (right)</li>
          <li>• <span className="text-slate-900">Kiln:</span> Positioned in back corner away from door. Maintains 18" clearance.</li>
          <li>• <span className="text-slate-900">Clay recycling:</span> Reclaim buckets near sink and clay storage for easy workflow</li>
          <li>• <span className="text-slate-900">Drying shelves:</span> Multiple shelving units along back wall for greenware drying</li>
          <li>• <span className="text-slate-900">Man door (left):</span> Keep this area accessible to other garage bays</li>
        </ul>
      </div>
    </div>
  );
}
