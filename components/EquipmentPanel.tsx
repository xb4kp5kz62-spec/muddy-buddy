import { Equipment } from '../App';
import { CheckCircle2, Circle, Package, Trash2, ChevronDown, ChevronUp, ExternalLink, ShoppingCart, Info } from 'lucide-react';
import { AddEquipmentForm } from './AddEquipmentForm';
import { useState } from 'react';

interface EquipmentPanelProps {
  equipment: Equipment[];
  onTogglePurchased: (id: string) => void;
  onDeleteEquipment?: (id: string) => void;
  onAddEquipment?: (equipment: Omit<Equipment, 'id' | 'x' | 'y' | 'rotation'>) => void;
}

// Detailed equipment recommendations with buying guides and store links
const equipmentDetails: Record<string, {
  buyingGuide: string;
  topPicks: Array<{
    brand: string;
    model: string;
    price: string;
    description: string;
    amazonLink?: string;
    seattlePotteryLink?: string;
    manufacturerLink?: string;
  }>;
}> = {
  'Pottery Wheel': {
    buyingGuide: 'Look for a wheel with a powerful motor (1/2 HP minimum), smooth speed control, and a sturdy construction. Belt-driven wheels are quieter than direct-drive. Consider the wheel head size (12-14" is standard) and whether you need a splash pan.',
    topPicks: [
      {
        brand: 'Shimpo',
        model: 'VL-Whisper',
        price: '$1,200-$1,500',
        description: 'Ultra-quiet, reliable, great for home studios. 1/2 HP motor.',
        amazonLink: 'https://www.amazon.com/s?k=shimpo+vl+whisper+pottery+wheel',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/pottery-wheels',
        manufacturerLink: 'https://www.nidec-shimpo.com/'
      },
      {
        brand: 'Brent',
        model: 'Model C',
        price: '$1,400-$1,800',
        description: 'Industry standard, extremely durable. Direct-drive 1/2 HP.',
        amazonLink: 'https://www.amazon.com/s?k=brent+model+c+pottery+wheel',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/pottery-wheels'
      },
      {
        brand: 'Speedball',
        model: 'Artista Turbo',
        price: '$800-$1,000',
        description: 'Budget-friendly option, good for beginners. 1/3 HP motor.',
        amazonLink: 'https://www.amazon.com/s?k=speedball+artista+turbo',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/pottery-wheels'
      }
    ]
  },
  'Electric Kiln': {
    buyingGuide: 'Choose kiln size based on how much you plan to fire (7-10 cu ft is good for home studios). Check if you have 240V power available. Digital controllers are worth the investment. Consider cone 6 capability for most work.',
    topPicks: [
      {
        brand: 'Skutt',
        model: 'KM-1027-3',
        price: '$3,500-$4,200',
        description: '10 cu ft, digital controller, cone 10 capable. Most popular home studio size.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/kilns',
        manufacturerLink: 'https://skutt.com/'
      },
      {
        brand: 'L&L',
        model: 'e23S',
        price: '$3,200-$3,800',
        description: '7 cu ft, DynaTrol controller, compact and reliable.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/kilns',
        manufacturerLink: 'https://hotkilns.com/'
      },
      {
        brand: 'Olympic',
        model: 'Doll 627HE',
        price: '$2,800-$3,400',
        description: '7 cu ft, energy efficient, good for small batches.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/kilns'
      }
    ]
  },
  'Wedging/Work Table': {
    buyingGuide: 'A good wedging table should be counter height (36") with a canvas-covered plaster surface. The plaster absorbs moisture from clay. You can DIY this with a 2" plaster slab on a sturdy table frame.',
    topPicks: [
      {
        brand: 'DIY Option',
        model: 'Custom Plaster Top',
        price: '$200-$400',
        description: 'Build your own: 2" plaster slab on sturdy table frame, cover with canvas.',
        amazonLink: 'https://www.amazon.com/s?k=pottery+plaster+wedging',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/wedging-tables'
      },
      {
        brand: 'Continental Clay',
        model: 'Wedging Table',
        price: '$500-$700',
        description: 'Pre-made plaster wedging surface, very sturdy.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/wedging-tables'
      }
    ]
  },
  'Clay Sink w/ Trap': {
    buyingGuide: 'CRITICAL: Never wash clay down a regular drain! You need a sediment trap (plaster trap) that catches clay particles. The trap needs to be emptied regularly. Can be DIY with buckets or purchased pre-made.',
    topPicks: [
      {
        brand: 'DIY Bucket System',
        model: '3-Bucket Settling System',
        price: '$50-$100',
        description: 'Three 5-gallon buckets in series. Clay settles, clean water pours off. Cheap and effective.',
        amazonLink: 'https://www.amazon.com/s?k=5+gallon+bucket',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/clay-trap'
      },
      {
        brand: 'Continental Clay',
        model: 'Clay Trap',
        price: '$300-$500',
        description: 'Professional plaster trap system, easier to maintain.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/clay-trap'
      },
      {
        brand: 'Bluebird',
        model: 'Sink with Trap',
        price: '$600-$800',
        description: 'Complete sink system with built-in clay trap.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/sinks'
      }
    ]
  },
  'Greenware Drying Shelf': {
    buyingGuide: 'Need open wire shelving for airflow. 4-6 shelves high works well. Adjustable shelves let you customize for different piece heights. Can use garage shelving units.',
    topPicks: [
      {
        brand: 'Wire Shelving (DIY)',
        model: 'NSF Wire Rack',
        price: '$100-$200',
        description: 'Chrome wire shelving from hardware store. Perfect airflow for drying.',
        amazonLink: 'https://www.amazon.com/s?k=wire+shelving+unit',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/shelving'
      },
      {
        brand: 'Bailey',
        model: 'Drying Rack',
        price: '$300-$500',
        description: 'Professional pottery drying shelves, very sturdy.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/shelving'
      }
    ]
  },
  'Pug Mill': {
    buyingGuide: 'Pug mills recycle clay by mixing and de-airing it. Great time-saver for studios that produce a lot of work, but not essential when starting. Consider getting one after your first year.',
    topPicks: [
      {
        brand: 'Peter Pugger',
        model: 'VPM-9',
        price: '$2,000-$2,500',
        description: 'Compact de-airing pug mill, perfect for home studios. 25 lbs/hour.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/pugmills',
        manufacturerLink: 'https://www.peterpugger.com/'
      },
      {
        brand: 'Venco',
        model: 'V-100',
        price: '$1,800-$2,200',
        description: 'Reliable and affordable, good reviews from home potters.',
        seattlePotteryLink: 'https://seattlepotterysupply.com/collections/pugmills'
      }
    ]
  }
};

export function EquipmentPanel({ equipment, onTogglePurchased, onDeleteEquipment, onAddEquipment }: EquipmentPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItemDetails = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Helper to get base equipment name (without optional/numbers)
  const getBaseEquipmentName = (name: string): string => {
    return name
      .replace(/\(Optional\)/i, '')
      .replace(/#\d+/g, '')
      .trim();
  };
  
  const groupedEquipment = equipment.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const totalCost = equipment
    .filter(item => !item.purchased)
    .reduce((sum, item) => {
      const avg = item.estimatedCost
        .replace(/\$/g, '')
        .split('-')
        .map(n => parseInt(n))
        .reduce((a, b) => a + b, 0) / 2;
      return sum + avg;
    }, 0);

  const essentialCount = equipment.filter(e => e.priority === 'essential' && !e.purchased).length;
  const purchasedCount = equipment.filter(e => e.purchased).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-900">Equipment List</h2>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-900">Essential Items</div>
            <div className="text-blue-600">{essentialCount} remaining</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-green-900">Purchased</div>
            <div className="text-green-600">{purchasedCount} / {equipment.length}</div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-sm text-amber-900">Estimated Budget Remaining</div>
          <div className="text-amber-700">${totalCost.toLocaleString()}</div>
          <div className="text-xs text-amber-600 mt-1">
            Based on average prices for unpurchased items
          </div>
        </div>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {Object.entries(groupedEquipment).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-slate-700 mb-3 pb-2 border-b border-slate-200">{category}</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      item.purchased
                        ? 'bg-slate-50 border-slate-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onTogglePurchased(item.id)}
                        className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                      >
                        {item.purchased ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${item.purchased ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {item.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                item.priority === 'essential'
                                  ? 'bg-blue-100 text-blue-700'
                                  : item.priority === 'recommended'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          {onDeleteEquipment && (
                            <button
                              onClick={() => onDeleteEquipment(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
                              title="Remove from plan"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 mb-2">
                          {item.estimatedCost} • {item.width}' × {item.depth}'
                        </div>
                        <div className="text-xs text-slate-700 mb-2">
                          <span className="text-slate-500">Brands:</span> {item.brands.join(', ')}
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed">
                          {item.notes}
                        </div>
                        
                        {/* Learn More Button */}
                        {equipmentDetails[getBaseEquipmentName(item.name)] && (
                          <>
                            <button
                              onClick={() => toggleItemDetails(item.id)}
                              className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              <Info className="w-4 h-4" />
                              {expandedItems[item.id] ? 'Hide Details' : 'Learn More & Shop'}
                            </button>

                            {expandedItems[item.id] && (
                              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                <div className="mb-3">
                                  <div className="text-xs text-blue-900 mb-1">💡 Buying Guide</div>
                                  <div className="text-xs text-slate-700 leading-relaxed">
                                    {equipmentDetails[getBaseEquipmentName(item.name)].buyingGuide}
                                  </div>
                                </div>

                                <div className="text-xs text-blue-900 mb-2">🏆 Top Recommendations</div>
                                <div className="space-y-2">
                                  {equipmentDetails[getBaseEquipmentName(item.name)].topPicks.map((pick, idx) => (
                                    <div key={idx} className="bg-white p-2 rounded border border-blue-200">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                          <div className="text-xs text-slate-900">{pick.brand} {pick.model}</div>
                                          <div className="text-xs text-green-700">{pick.price}</div>
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-600 mb-2">{pick.description}</div>
                                      <div className="flex flex-wrap gap-1">
                                        {pick.seattlePotteryLink && (
                                          <a
                                            href={pick.seattlePotteryLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-xs transition-colors"
                                          >
                                            <ShoppingCart className="w-3 h-3" />
                                            Seattle Pottery
                                            <ExternalLink className="w-2 h-2" />
                                          </a>
                                        )}
                                        {pick.amazonLink && (
                                          <a
                                            href={pick.amazonLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors"
                                          >
                                            <ShoppingCart className="w-3 h-3" />
                                            Amazon
                                            <ExternalLink className="w-2 h-2" />
                                          </a>
                                        )}
                                        {pick.manufacturerLink && (
                                          <a
                                            href={pick.manufacturerLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs transition-colors"
                                          >
                                            Website
                                            <ExternalLink className="w-2 h-2" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {onAddEquipment && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <AddEquipmentForm onAddEquipment={onAddEquipment} />
          </div>
        )}
      </div>
    </div>
  );
}
