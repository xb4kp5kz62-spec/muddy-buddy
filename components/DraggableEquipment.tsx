import { useState, useRef } from 'react';
import { Equipment } from '../App';
import { RotateCw, Trash2 } from 'lucide-react';

interface DraggableEquipmentProps {
  equipment: Equipment;
  scale: number;
  maxX: number;
  maxY: number;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onDelete?: (id: string) => void;
}

export function DraggableEquipment({ equipment, scale, maxX, maxY, onUpdate, onDelete }: DraggableEquipmentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = ((equipment.rotation + 90) % 360) as 0 | 90 | 180 | 270;
    // Swap width and depth when rotating 90 or 270 degrees
    if (newRotation === 90 || newRotation === 270) {
      onUpdate(equipment.id, { 
        rotation: newRotation,
        width: equipment.depth,
        depth: equipment.width
      });
    } else {
      onUpdate(equipment.id, { rotation: newRotation });
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(equipment.id);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: equipment.x,
      initialY: equipment.y
    };
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const deltaX = (e.clientX - dragRef.current.startX) / scale;
    const deltaY = (e.clientY - dragRef.current.startY) / scale;

    let newX = dragRef.current.initialX + deltaX;
    let newY = dragRef.current.initialY + deltaY;

    // Special constraint for sink - must be on right wall (exterior wall)
    if (equipment.id === 'sink-1') {
      // Sink must be against the right wall (x = maxX - equipment.width)
      newX = maxX - equipment.width;
      // Can only move along the Y axis
      newY = Math.max(0.5, Math.min(maxY - equipment.depth - 0.5, newY));
    } else {
      // Regular constraints for other equipment
      // Avoid the garage door area (bottom 1 foot)
      const minY = 0.5;
      const maxYPos = maxY - equipment.depth - 0.5; // Keep away from garage door
      
      // Avoid the man door area on left wall (x < 1, y between 8 and 11)
      newX = Math.max(0.5, Math.min(maxX - equipment.width, newX));
      newY = Math.max(minY, Math.min(maxYPos, newY));
    }

    onUpdate(equipment.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  // Add/remove event listeners
  if (typeof window !== 'undefined') {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    // Cleanup
    if (!isDragging) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }

  const getColor = () => {
    if (equipment.purchased) return 'bg-slate-300 border-slate-400 border-2';
    switch (equipment.priority) {
      case 'essential': return 'bg-blue-500';
      case 'recommended': return 'bg-green-500';
      case 'optional': return 'bg-amber-500';
    }
  };

  return (
    <>
      <div
        className={`absolute rounded shadow-lg cursor-move transition-shadow hover:shadow-xl ${getColor()} ${
          isDragging ? 'opacity-80 z-50' : 'opacity-90 hover:opacity-100'
        }`}
        style={{
          left: `${(equipment.x / maxX) * 100}%`,
          top: `${(equipment.y / maxY) * 100}%`,
          width: `${(equipment.width / maxX) * 100}%`,
          height: `${(equipment.depth / maxY) * 100}%`,
          zIndex: isDragging ? 50 : 10
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseOver={() => setShowControls(true)}
        onMouseOut={() => setShowControls(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center p-1">
          <span className="text-white text-center text-xs leading-tight drop-shadow">
            {equipment.name}
          </span>
        </div>
        <div className="absolute bottom-0 right-0 text-white text-xs px-1 bg-black bg-opacity-30 rounded-tl">
          {equipment.width}'×{equipment.depth}'
        </div>
        {showControls && (
          <div className="absolute top-0 right-0 flex flex-col space-y-1">
            <button
              className="bg-red-500 text-white p-1 rounded"
              onClick={handleDelete}
            >
              <Trash2 size={12} />
            </button>
            <button
              className="bg-blue-500 text-white p-1 rounded"
              onClick={handleRotate}
            >
              <RotateCw size={12} />
            </button>
          </div>
        )}
      </div>

      {showTooltip && !isDragging && (
        <div
          className="absolute bg-slate-900 text-white p-3 rounded-lg shadow-xl z-50 pointer-events-none"
          style={{
            left: `${((equipment.x + equipment.width / 2) / maxX) * 100}%`,
            top: `${((equipment.y - 0.5) / maxY) * 100}%`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '250px'
          }}
        >
          <div className="text-sm space-y-1">
            <div>{equipment.name}</div>
            <div className="text-slate-300 text-xs">{equipment.estimatedCost}</div>
            <div className="text-slate-400 text-xs">
              Brands: {equipment.brands.join(', ')}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
