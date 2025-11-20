import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Equipment } from '../App';

interface AddEquipmentFormProps {
  onAddEquipment: (equipment: Omit<Equipment, 'id' | 'x' | 'y' | 'rotation'>) => void;
}

export function AddEquipmentForm({ onAddEquipment }: AddEquipmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    width: 2,
    depth: 2,
    purchased: false,
    priority: 'optional' as 'essential' | 'recommended' | 'optional',
    estimatedCost: '$0',
    brands: '',
    notes: ''
  });

  const generateEstimates = async () => {
    if (!formData.name.trim()) {
      alert('Please enter an equipment name first');
      return;
    }

    setIsGenerating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const name = formData.name.toLowerCase();
    let estimates = {
      category: 'Other',
      width: 2,
      depth: 2,
      priority: 'optional' as 'essential' | 'recommended' | 'optional',
      estimatedCost: '$100-$300',
      brands: 'Various',
      notes: ''
    };

    // AI-powered equipment knowledge base
    if (name.includes('slab roller')) {
      estimates = {
        category: 'Clay Prep',
        width: 3,
        depth: 4,
        priority: 'recommended',
        estimatedCost: '$400-$1200',
        brands: 'Bailey, Northstar, Brent',
        notes: 'Manual slab rollers are $400-$600. Motorized models $800-$1200. Great for consistent slab thickness. Table-top models available.'
      };
    } else if (name.includes('stool')) {
      estimates = {
        category: 'Seating',
        width: 1.5,
        depth: 1.5,
        priority: 'recommended',
        estimatedCost: '$50-$150',
        brands: 'Speedball, Continental Clay, Adjustable shop stool',
        notes: 'Adjustable height stools work best. Look for easy-clean vinyl seats. Get one per wheel plus extras for hand-building.'
      };
    } else if (name.includes('extruder')) {
      estimates = {
        category: 'Clay Prep',
        width: 1.5,
        depth: 2,
        priority: 'optional',
        estimatedCost: '$150-$500',
        brands: 'Kemper, Bailey, Scott Creek',
        notes: 'Wall-mounted or table-mounted. Great for handles, coils, and decorative elements. Includes multiple dies.'
      };
    } else if (name.includes('glaze mixer') || name.includes('mixer')) {
      estimates = {
        category: 'Storage',
        width: 1,
        depth: 1,
        priority: 'recommended',
        estimatedCost: '$50-$200',
        brands: 'Jiffy Mixer, DeWalt drill with mixer paddle',
        notes: 'Drill-powered mixer attachment works well. Essential for keeping glazes in suspension. Get multiple paddles.'
      };
    } else if (name.includes('spray booth')) {
      estimates = {
        category: 'Other',
        width: 3,
        depth: 3,
        priority: 'optional',
        estimatedCost: '$300-$1500',
        brands: 'Paasche, Continental Clay, DIY build',
        notes: 'Necessary for spray glazing. Requires ventilation to exterior. Can build DIY with box fan and furnace filters.'
      };
    } else if (name.includes('work bench') || name.includes('workbench')) {
      estimates = {
        category: 'Work Surfaces',
        width: 4,
        depth: 2.5,
        priority: 'recommended',
        estimatedCost: '$150-$400',
        brands: 'DIY, Husky, Gladiator',
        notes: 'Sturdy construction essential. Easy-clean surface. Counter height (36") or adjustable. Add casters for mobility.'
      };
    } else if (name.includes('ware cart') || name.includes('ware rack')) {
      estimates = {
        category: 'Storage',
        width: 2,
        depth: 3,
        priority: 'recommended',
        estimatedCost: '$200-$500',
        brands: 'Bailey, Continental Clay, Metro wire shelving',
        notes: 'Rolling cart for moving greenware safely. Multiple shelf levels. Consider one for greenware, one for bisque.'
      };
    } else if (name.includes('drying cabinet')) {
      estimates = {
        category: 'Storage',
        width: 2.5,
        depth: 2,
        priority: 'optional',
        estimatedCost: '$400-$900',
        brands: 'DIY with dehumidifier, Commercial pottery suppliers',
        notes: 'Controlled drying prevents cracking. Can DIY with shelving unit and dehumidifier. Great for large or thick pieces.'
      };
    } else if (name.includes('banding wheel') || name.includes('turntable')) {
      estimates = {
        category: 'Work Surfaces',
        width: 1,
        depth: 1,
        priority: 'recommended',
        estimatedCost: '$30-$150',
        brands: 'Speedball, Brent, Shimpo',
        notes: 'Essential for hand-building and decorating. Ball-bearing models spin smoothest. Get multiple sizes.'
      };
    } else if (name.includes('kiln furniture') || name.includes('shelves')) {
      estimates = {
        category: 'Kilns',
        width: 2,
        depth: 2,
        priority: 'essential',
        estimatedCost: '$200-$600',
        brands: 'L&L, Advancer, Continental Clay',
        notes: 'Shelves, posts, stilts for kiln stacking. Buy specific to your kiln size. Get extras - they crack over time.'
      };
    } else if (name.includes('wedging table')) {
      estimates = {
        category: 'Work Surfaces',
        width: 2.5,
        depth: 2,
        priority: 'essential',
        estimatedCost: '$200-$500',
        brands: 'DIY plaster/canvas top, Bailey, Continental Clay',
        notes: 'Plaster top with canvas cover ideal. Counter height (36"). Can DIY with concrete/plaster and wooden frame.'
      };
    } else if (name.includes('heat gun') || name.includes('torch')) {
      estimates = {
        category: 'Other',
        width: 0.5,
        depth: 0.5,
        priority: 'optional',
        estimatedCost: '$20-$80',
        brands: 'DeWalt, Milwaukee, Wagner',
        notes: 'Useful for drying joints, smoothing surfaces, and warming clay. Heat guns safer than torches in studio.'
      };
    } else if (name.includes('scale')) {
      estimates = {
        category: 'Other',
        width: 1,
        depth: 1,
        priority: 'recommended',
        estimatedCost: '$20-$100',
        brands: 'Escali, Ohaus, digital kitchen scale',
        notes: 'Essential for accurate glaze mixing. Get one that weighs up to 10-20 lbs. Digital with tare function.'
      };
    } else if (name.includes('chair')) {
      estimates = {
        category: 'Seating',
        width: 2,
        depth: 2,
        priority: 'optional',
        estimatedCost: '$50-$200',
        brands: 'Office chair, shop chair',
        notes: 'For hand-building or teaching. Look for easy-clean materials. Adjustable height helpful.'
      };
    } else if (name.includes('fan') || name.includes('ventilation')) {
      estimates = {
        category: 'Other',
        width: 1.5,
        depth: 1.5,
        priority: 'recommended',
        estimatedCost: '$50-$200',
        brands: 'Shop fan, box fan, exhaust fan',
        notes: 'Good ventilation essential for clay dust and kiln fumes. Consider ceiling-mounted or window exhaust fan.'
      };
    } else if (name.includes('tool kit') || name.includes('tools')) {
      estimates = {
        category: 'Storage',
        width: 1,
        depth: 1,
        priority: 'essential',
        estimatedCost: '$50-$200',
        brands: 'Kemper, Xiem, Mudtools, Speedball',
        notes: 'Basic kit: ribs, needle tool, wire tool, sponges, trimming tools. Build collection over time.'
      };
    } else if (name.includes('apron')) {
      estimates = {
        category: 'Other',
        width: 0.5,
        depth: 0.5,
        priority: 'recommended',
        estimatedCost: '$20-$60',
        brands: 'Canvas apron, leather apron',
        notes: 'Heavy canvas or leather. Cross-back style reduces neck strain. Get multiple for washing rotation.'
      };
    } else {
      // Generic estimate based on name hints
      if (name.includes('large') || name.includes('big')) {
        estimates.width = 4;
        estimates.depth = 3;
        estimates.estimatedCost = '$300-$800';
      } else if (name.includes('small') || name.includes('mini')) {
        estimates.width = 1;
        estimates.depth = 1;
        estimates.estimatedCost = '$20-$100';
      }
      
      estimates.notes = 'AI-generated estimate. Please verify dimensions and pricing for your specific needs.';
    }

    setFormData({
      ...formData,
      ...estimates
    });

    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const brandsArray = formData.brands
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    onAddEquipment({
      name: formData.name,
      category: formData.category,
      width: formData.width,
      depth: formData.depth,
      purchased: formData.purchased,
      priority: formData.priority,
      estimatedCost: formData.estimatedCost,
      brands: brandsArray.length > 0 ? brandsArray : ['Custom'],
      notes: formData.notes
    });

    // Reset form
    setFormData({
      name: '',
      category: 'Other',
      width: 2,
      depth: 2,
      purchased: false,
      priority: 'optional',
      estimatedCost: '$0',
      brands: '',
      notes: ''
    });
    
    setIsOpen(false);
  };

  const categories = [
    'Wheels',
    'Kilns',
    'Work Surfaces',
    'Storage',
    'Clay Prep',
    'Plumbing',
    'Seating',
    'Other'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Custom Equipment
      </button>
    );
  }

  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900">Add Custom Equipment</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Equipment Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder="e.g., Stool, Slab Roller"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Width (feet) *
            </label>
            <input
              type="number"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="0.5"
              max="20"
              step="0.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Depth (feet) *
            </label>
            <input
              type="number"
              value={formData.depth}
              onChange={(e) => setFormData({ ...formData, depth: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="0.5"
              max="20"
              step="0.5"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="essential">Essential</option>
              <option value="recommended">Recommended</option>
              <option value="optional">Optional</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Estimated Cost
          </label>
          <input
            type="text"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder="e.g., $50-$100"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Brands (comma-separated)
          </label>
          <input
            type="text"
            value={formData.brands}
            onChange={(e) => setFormData({ ...formData, brands: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder="e.g., Bailey, Speedball, DIY"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder="Additional notes or specifications..."
            rows={2}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="purchased"
            checked={formData.purchased}
            onChange={(e) => setFormData({ ...formData, purchased: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="purchased" className="text-sm text-slate-700">
            Already purchased
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={generateEstimates}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded transition-colors"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI Estimates
              </>
            )}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
