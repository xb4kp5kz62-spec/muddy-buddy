import { useState } from 'react';
import { Plus, Trash2, Share2, Mail, Copy, CheckCircle2, Circle, Star, ShoppingCart, ExternalLink, Heart, Search, Sparkles } from 'lucide-react';

interface SupplyItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  purchased: boolean;
  notes?: string;
  availability?: {
    amazon?: string;
    seattlePottery?: string;
  };
}

interface FavoriteItem {
  name: string;
  category: string;
  quantity: string;
  notes?: string;
  availability: {
    amazon?: string;
    seattlePottery?: string;
  };
}

export function SupplyList() {
  const [supplies, setSupplies] = useState<SupplyItem[]>([
    {
      id: '1',
      name: 'Clay - Cone 6 Stoneware',
      category: 'Clay',
      quantity: '25 lbs',
      purchased: false,
      notes: 'Start with one bag to test'
    },
    {
      id: '2',
      name: 'Trimming Tools Set',
      category: 'Tools',
      quantity: '1 set',
      purchased: false,
      notes: 'Kemper or Mudtools'
    },
    {
      id: '3',
      name: 'Natural Sponges',
      category: 'Tools',
      quantity: '6-8',
      purchased: false,
      notes: 'Various sizes'
    },
    {
      id: '4',
      name: 'Clear Glaze',
      category: 'Glazes',
      quantity: '1 gallon',
      purchased: false
    },
    {
      id: '5',
      name: 'Wire Tool',
      category: 'Tools',
      quantity: '2',
      purchased: false,
      notes: 'Cutting wire with handles'
    }
  ]);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{
    name: string;
    category: string;
    quantity: string;
    notes: string;
    availability: {
      amazon: string;
      seattlePottery: string;
    };
  } | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Clay',
    quantity: '',
    notes: ''
  });

  // Favorites library with store availability
  const favoriteItems: FavoriteItem[] = [
    // Clay
    {
      name: 'Laguna B-Mix Cone 5 Stoneware',
      category: 'Clay',
      quantity: '25 lbs',
      notes: 'Popular smooth throwing clay',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/clay-cone-5',
        amazon: 'https://www.amazon.com/s?k=laguna+b-mix+clay'
      }
    },
    {
      name: 'Cone 10 Reduction Stoneware',
      category: 'Clay',
      quantity: '25 lbs',
      notes: 'High-fire clay body',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/clay-cone-10'
      }
    },
    {
      name: 'Laguna WC-617 Porcelain',
      category: 'Clay',
      quantity: '25 lbs',
      notes: 'White throwing porcelain',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/clay-porcelain',
        amazon: 'https://www.amazon.com/s?k=laguna+porcelain+clay'
      }
    },
    // Tools
    {
      name: 'Kemper Tool Set - 10 Piece',
      category: 'Tools',
      quantity: '1 set',
      notes: 'Essential starter tools',
      availability: {
        amazon: 'https://www.amazon.com/s?k=kemper+pottery+tool+set',
        seattlePottery: 'https://seattlepotterysupply.com/collections/modeling-tools'
      }
    },
    {
      name: 'Mudtools Wire Tool',
      category: 'Tools',
      quantity: '1',
      notes: 'Professional cutting wire',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/cutting-wires',
        amazon: 'https://www.amazon.com/s?k=mudtools+wire'
      }
    },
    {
      name: 'Natural Sea Sponges (6-pack)',
      category: 'Tools',
      quantity: '1 pack',
      notes: 'Assorted sizes',
      availability: {
        amazon: 'https://www.amazon.com/s?k=natural+sea+sponge+pottery',
        seattlePottery: 'https://seattlepotterysupply.com/collections/sponges'
      }
    },
    {
      name: 'Giffin Grip Trimming Tool',
      category: 'Tools',
      quantity: '1',
      notes: 'For trimming bowls and vases',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/trimming-tools',
        amazon: 'https://www.amazon.com/s?k=giffin+grip'
      }
    },
    {
      name: 'Needle Tool',
      category: 'Tools',
      quantity: '2',
      notes: 'Essential for trimming and scoring',
      availability: {
        amazon: 'https://www.amazon.com/s?k=pottery+needle+tool',
        seattlePottery: 'https://seattlepotterysupply.com/collections/modeling-tools'
      }
    },
    {
      name: 'Fettling Knife',
      category: 'Tools',
      quantity: '1',
      notes: 'For trimming and carving',
      availability: {
        amazon: 'https://www.amazon.com/s?k=pottery+fettling+knife',
        seattlePottery: 'https://seattlepotterysupply.com/collections/modeling-tools'
      }
    },
    // Glazes
    {
      name: 'Amaco Celadon Glazes',
      category: 'Glazes',
      quantity: '1 pint',
      notes: 'Cone 5-6, various colors',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/amaco-celadon',
        amazon: 'https://www.amazon.com/s?k=amaco+celadon+glaze'
      }
    },
    {
      name: 'Mayco Stroke & Coat',
      category: 'Glazes',
      quantity: '2 oz',
      notes: 'Cone 5-6 brush-on glazes',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/mayco-stroke-coat',
        amazon: 'https://www.amazon.com/s?k=mayco+stroke+coat'
      }
    },
    {
      name: 'Clear Glaze (Cone 6)',
      category: 'Glazes',
      quantity: '1 gallon',
      notes: 'Food-safe transparent',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/clear-glazes'
      }
    },
    // Underglazes
    {
      name: 'Amaco Velvet Underglazes',
      category: 'Underglazes',
      quantity: '2 oz',
      notes: 'Rich colors, brush-on',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/amaco-velvet',
        amazon: 'https://www.amazon.com/s?k=amaco+velvet+underglaze'
      }
    },
    {
      name: 'Speedball Underglaze Set',
      category: 'Underglazes',
      quantity: '1 set',
      notes: '12 color starter set',
      availability: {
        amazon: 'https://www.amazon.com/s?k=speedball+underglaze+set',
        seattlePottery: 'https://seattlepotterysupply.com/collections/underglazes'
      }
    },
    // Oxides and Stains
    {
      name: 'Cobalt Oxide',
      category: 'Oxides/Stains',
      quantity: '1 lb',
      notes: 'For creating blue colors',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/oxides',
        amazon: 'https://www.amazon.com/s?k=cobalt+oxide+pottery'
      }
    },
    {
      name: 'Iron Oxide (Red)',
      category: 'Oxides/Stains',
      quantity: '1 lb',
      notes: 'For earth tones',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/oxides',
        amazon: 'https://www.amazon.com/s?k=iron+oxide+pottery'
      }
    },
    {
      name: 'Mason Stain Set',
      category: 'Oxides/Stains',
      quantity: '4 oz each',
      notes: 'Stable colorants',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/stains'
      }
    },
    // Safety Gear
    {
      name: 'Respirator Mask (N95 or P100)',
      category: 'Safety Gear',
      quantity: '1',
      notes: 'Essential for mixing glazes',
      availability: {
        amazon: 'https://www.amazon.com/s?k=p100+respirator',
        seattlePottery: 'https://seattlepotterysupply.com/collections/safety'
      }
    },
    {
      name: 'Nitrile Gloves (Box of 100)',
      category: 'Safety Gear',
      quantity: '1 box',
      notes: 'For glazing and cleanup',
      availability: {
        amazon: 'https://www.amazon.com/s?k=nitrile+gloves',
        seattlePottery: 'https://seattlepotterysupply.com/collections/safety'
      }
    },
    {
      name: 'Apron (Canvas)',
      category: 'Safety Gear',
      quantity: '1',
      notes: 'Protect clothing from clay',
      availability: {
        amazon: 'https://www.amazon.com/s?k=pottery+apron',
        seattlePottery: 'https://seattlepotterysupply.com/collections/aprons'
      }
    },
    // Other
    {
      name: 'Pottery Bats (10" diameter)',
      category: 'Other',
      quantity: '3-5',
      notes: 'Masonite or plaster',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/bats',
        amazon: 'https://www.amazon.com/s?k=pottery+bats'
      }
    },
    {
      name: 'Canvas for Wedging Table',
      category: 'Other',
      quantity: '1 yard',
      notes: 'Heavy duck canvas',
      availability: {
        amazon: 'https://www.amazon.com/s?k=canvas+duck+cloth',
        seattlePottery: 'https://seattlepotterysupply.com/collections/canvas'
      }
    },
    {
      name: 'Kiln Shelves (10" square)',
      category: 'Other',
      quantity: '4-6',
      notes: 'Depends on kiln size',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/kiln-shelves',
        amazon: 'https://www.amazon.com/s?k=kiln+shelves'
      }
    },
    {
      name: 'Kiln Posts (assorted heights)',
      category: 'Other',
      quantity: '1 set',
      notes: 'For stacking shelves',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/kiln-furniture',
        amazon: 'https://www.amazon.com/s?k=kiln+posts'
      }
    },
    {
      name: 'Pyrometric Cones (Cone 6)',
      category: 'Other',
      quantity: '25 pack',
      notes: 'Match your firing temp',
      availability: {
        seattlePottery: 'https://seattlepotterysupply.com/collections/cones',
        amazon: 'https://www.amazon.com/s?k=pyrometric+cones'
      }
    }
  ];

  const categories = ['Clay', 'Glazes', 'Tools', 'Underglazes', 'Oxides/Stains', 'Safety Gear', 'Other'];

  // Smart AI search function to detect product details and generate store links
  const handleAISearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Detect category
    let detectedCategory = 'Other';
    let quantity = '1';
    let notes = '';
    
    if (lowerQuery.includes('clay') || lowerQuery.includes('porcelain') || lowerQuery.includes('stoneware') || lowerQuery.includes('b-mix') || lowerQuery.includes('seamix')) {
      detectedCategory = 'Clay';
      quantity = '25 lbs';
      notes = 'Check cone rating';
    } else if (lowerQuery.includes('glaze') || lowerQuery.includes('celadon') || lowerQuery.includes('obsidian') || lowerQuery.includes('stroke')) {
      detectedCategory = 'Glazes';
      quantity = '1 pint';
      notes = 'Verify cone compatibility';
    } else if (lowerQuery.includes('underglaze') || lowerQuery.includes('velvet')) {
      detectedCategory = 'Underglazes';
      quantity = '2 oz';
    } else if (lowerQuery.includes('oxide') || lowerQuery.includes('stain') || lowerQuery.includes('cobalt') || lowerQuery.includes('iron')) {
      detectedCategory = 'Oxides/Stains';
      quantity = '1 lb';
      notes = 'Use with care - strong colorant';
    } else if (lowerQuery.includes('tool') || lowerQuery.includes('wire') || lowerQuery.includes('needle') || lowerQuery.includes('rib') || lowerQuery.includes('sponge') || lowerQuery.includes('kemper') || lowerQuery.includes('mudtools')) {
      detectedCategory = 'Tools';
      quantity = '1';
    } else if (lowerQuery.includes('cone') || lowerQuery.includes('bat') || lowerQuery.includes('shelf') || lowerQuery.includes('post')) {
      detectedCategory = 'Other';
    }
    
    // Generate optimized search URLs
    const amazonSearchQuery = query.trim().replace(/\s+/g, '+') + '+pottery';
    const seattlePotterySearchQuery = query.trim().replace(/\s+/g, '+');
    
    // Create search result
    const result = {
      name: query.trim(),
      category: detectedCategory,
      quantity,
      notes: notes || 'AI-detected category',
      availability: {
        amazon: `https://www.amazon.com/s?k=${amazonSearchQuery}`,
        seattlePottery: `https://seattlepotterysupply.com/search?q=${seattlePotterySearchQuery}`
      }
    };
    
    setSearchResult(result);
  };

  const addSearchResultToList = () => {
    if (!searchResult) return;
    
    const item: SupplyItem = {
      id: Date.now().toString(),
      name: searchResult.name,
      category: searchResult.category,
      quantity: searchResult.quantity,
      purchased: false,
      notes: searchResult.notes,
      availability: searchResult.availability
    };
    
    setSupplies([...supplies, item]);
    setSearchQuery('');
    setSearchResult(null);
    setShowAISearch(false);
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;

    const item: SupplyItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity || '1',
      purchased: false,
      notes: newItem.notes
    };

    setSupplies([...supplies, item]);
    setNewItem({ name: '', category: 'Clay', quantity: '', notes: '' });
    setIsAddingItem(false);
  };

  const togglePurchased = (id: string) => {
    setSupplies(supplies.map(item =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const deleteItem = (id: string) => {
    setSupplies(supplies.filter(item => item.id !== id));
  };

  const addFavoriteToList = (favorite: FavoriteItem) => {
    const item: SupplyItem = {
      id: Date.now().toString(),
      name: favorite.name,
      category: favorite.category,
      quantity: favorite.quantity,
      purchased: false,
      notes: favorite.notes,
      availability: favorite.availability
    };
    setSupplies([...supplies, item]);
  };

  const generateListText = () => {
    let text = '🏺 POTTERY STUDIO SUPPLY LIST\n';
    text += '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

    const groupedSupplies = supplies.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, SupplyItem[]>);

    Object.entries(groupedSupplies).forEach(([category, items]) => {
      text += `📦 ${category.toUpperCase()}\n`;
      items.forEach(item => {
        const checkbox = item.purchased ? '✓' : '☐';
        text += `${checkbox} ${item.name}`;
        if (item.quantity) text += ` (${item.quantity})`;
        if (item.notes) text += `\n   Note: ${item.notes}`;
        text += '\n';
      });
      text += '\n';
    });

    const totalItems = supplies.length;
    const purchasedItems = supplies.filter(s => s.purchased).length;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Progress: ${purchasedItems}/${totalItems} items purchased\n`;

    return text;
  };

  const handleShare = async () => {
    const text = generateListText();

    // Try Web Share API first (works great on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pottery Studio Supply List',
          text: text
        });
        return;
      } catch (err) {
        // User cancelled or API not available, fall through to other options
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      alert('✓ List copied to clipboard! You can now paste it into a text message or notes app.');
    } catch (err) {
      // Final fallback: show the text in an alert
      alert(text);
    }
  };

  const handleEmailList = () => {
    const text = generateListText();
    const subject = encodeURIComponent('Pottery Studio Supply List');
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSMS = () => {
    const text = generateListText();
    // SMS protocol - works on mobile devices
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  const groupedSupplies = supplies.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SupplyItem[]>);

  const totalItems = supplies.length;
  const purchasedItems = supplies.filter(s => s.purchased).length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-900">Supply Shopping List</h2>
          <p className="text-sm text-slate-600 mt-1">
            {purchasedItems}/{totalItems} items purchased
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            title="Share or copy list"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleSMS}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            title="Send as text message"
          >
            <Copy className="w-4 h-4" />
            SMS
          </button>
          <button
            onClick={handleEmailList}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            title="Email list"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Supply List */}
      <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
        {Object.entries(groupedSupplies).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-slate-700 mb-2 pb-1 border-b border-slate-200">{category}</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded border transition-colors ${
                    item.purchased
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => togglePurchased(item.id)}
                      className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                    >
                      {item.purchased ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm ${item.purchased ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.name}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {item.quantity && (
                        <div className="text-xs text-slate-600 mt-1">
                          Quantity: {item.quantity}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-xs text-slate-600 mt-1 italic">
                          {item.notes}
                        </div>
                      )}
                      {item.availability && (
                        <div className="flex gap-2 mt-2">
                          {item.availability.seattlePottery && (
                            <a
                              href={item.availability.seattlePottery}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-xs transition-colors"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Seattle Pottery
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {item.availability.amazon && (
                            <a
                              href={item.availability.amazon}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Amazon
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Item */}
      {!isAddingItem ? (
        <div className="space-y-3">
          {/* AI Search */}
          <button
            onClick={() => {
              setShowAISearch(!showAISearch);
              setShowFavorites(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-900 rounded border-2 border-purple-200 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            {showAISearch ? 'Hide' : 'AI Smart'} Product Search
          </button>

          {showAISearch && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded p-4">
              <h3 className="text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Product Finder
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Type any pottery product (e.g., "Seamix Clay", "Amaco Obsidian Glaze", "Mudtools Rib") and we'll find it for you!
              </p>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleAISearch(searchQuery);
                    }
                  }}
                  className="w-full px-4 py-3 pr-12 border-2 border-purple-300 rounded text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Amaco Obsidian glaze, Seamix clay..."
                  autoFocus
                />
                <button
                  onClick={() => searchQuery.trim() && handleAISearch(searchQuery)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {searchResult && (
                <div className="mt-4 bg-white border-2 border-purple-300 rounded p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="text-sm text-slate-900 mb-1">{searchResult.name}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                          {searchResult.category}
                        </span>
                        <span className="text-xs text-slate-600">
                          Qty: {searchResult.quantity}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 italic mb-3">
                        💡 {searchResult.notes}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="text-xs text-slate-700 mb-1">Available at:</div>
                        <div className="flex gap-2">
                          <a
                            href={searchResult.availability.seattlePottery}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-xs transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Seattle Pottery Supply
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={searchResult.availability.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Amazon
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={addSearchResultToList}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add to My Shopping List
                  </button>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={() => {
              setShowFavorites(!showFavorites);
              setShowAISearch(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded border-2 border-pink-200 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {showFavorites ? 'Hide' : 'Browse'} Common Supplies
          </button>

          {showFavorites && (
            <div className="bg-pink-50 border-2 border-pink-200 rounded p-4 max-h-[400px] overflow-y-auto">
              <h3 className="text-slate-900 mb-3">Common Pottery Supplies</h3>
              <p className="text-xs text-slate-600 mb-4">Click "Add to List" to add items to your shopping list with store links</p>
              
              <div className="space-y-4">
                {categories.map(category => {
                  const categoryItems = favoriteItems.filter(item => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h4 className="text-slate-700 text-sm mb-2 pb-1 border-b border-pink-200">{category}</h4>
                      <div className="space-y-2">
                        {categoryItems.map((item, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-pink-200">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <div className="text-sm text-slate-900">{item.name}</div>
                                <div className="text-xs text-slate-600 mt-1">Qty: {item.quantity}</div>
                                {item.notes && (
                                  <div className="text-xs text-slate-600 mt-1 italic">{item.notes}</div>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  addFavoriteToList(item);
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs transition-colors flex-shrink-0"
                              >
                                <Plus className="w-3 h-3" />
                                Add to List
                              </button>
                            </div>
                            <div className="flex gap-2">
                              {item.availability.seattlePottery && (
                                <a
                                  href={item.availability.seattlePottery}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-xs transition-colors"
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                  Seattle Pottery
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {item.availability.amazon && (
                                <a
                                  href={item.availability.amazon}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors"
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                  Amazon
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border-2 border-dashed border-slate-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Custom Supply Item
          </button>
        </div>
      ) : (
        <div className="bg-blue-50 border-2 border-blue-200 rounded p-4">
          <h3 className="text-slate-900 mb-3">Add New Supply</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Item Name *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g., Cone 6 Porcelain, Cobalt Oxide, Needle Tool"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Quantity</label>
                <input
                  type="text"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g., 25 lbs, 2, 1 set"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Notes</label>
              <input
                type="text"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="Brand preferences, specifications..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddItem}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Add Item
              </button>
              <button
                onClick={() => setIsAddingItem(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-600">
          💡 <span className="text-slate-700">Tip:</span> Use the Share button to send this list to your phone, 
          or use SMS/Email to send directly. The list updates automatically as you check off items.
        </p>
      </div>
    </div>
  );
}
