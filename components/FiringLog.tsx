import { useState } from 'react';
import { Flame, Plus, Trash2, Calendar, Clock, ThermometerSun, AlertCircle, CheckCircle, Search, Filter, Camera, TrendingUp, X, Upload } from 'lucide-react';

type FiringType = 'Bisque' | 'Glaze' | 'Test';
type FiringResult = 'Success' | 'Partial' | 'Failed';

interface Firing {
  id: string;
  date: string; // ISO date string
  type: FiringType;
  cone: string; // e.g., "04", "6", "10"
  temperature?: number; // Optional actual temp
  program?: string; // Kiln program name/number
  duration?: number; // Hours
  contents: string; // What was in the firing
  result: FiringResult;
  notes?: string;
  issues?: string;
  photos?: string[]; // Array of base64 image data URLs
}

interface KilnStats {
  totalFirings: number;
  elementInstallDate?: string;
  firingSinceElements: number;
  lastMaintenance?: string;
}

export function FiringLog() {
  const [firings, setFirings] = useState<Firing[]>([
    {
      id: 'example-1',
      date: '2024-11-15T10:00:00',
      type: 'Bisque',
      cone: '04',
      temperature: 1945,
      program: 'Slow Bisque',
      duration: 10.5,
      contents: '12 mugs, 6 bowls, 8 test tiles',
      result: 'Success',
      notes: 'Perfect firing, no issues. Loaded kiln efficiently.',
    },
    {
      id: 'example-2',
      date: '2024-11-10T14:30:00',
      type: 'Glaze',
      cone: '6',
      temperature: 2232,
      program: 'Medium Glaze',
      duration: 9,
      contents: '10 glazed mugs, 5 bowls',
      result: 'Partial',
      notes: 'Most pieces came out well, but 2 mugs had glaze running.',
      issues: 'Applied glaze too thick on bottom third of 2 mugs - need to be more careful with application.',
    }
  ]);

  const [kilnStats, setKilnStats] = useState<KilnStats>({
    totalFirings: 47,
    elementInstallDate: '2024-01-15',
    firingSinceElements: 47,
    lastMaintenance: '2024-10-01'
  });

  const [isAddingFiring, setIsAddingFiring] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | FiringType>('All');
  const [showStats, setShowStats] = useState(true);

  const [newFiring, setNewFiring] = useState<Omit<Firing, 'id'>>({
    date: new Date().toISOString().slice(0, 16),
    type: 'Bisque',
    cone: '04',
    temperature: undefined,
    program: '',
    duration: undefined,
    contents: '',
    result: 'Success',
    notes: '',
    issues: ''
  });

  const addFiring = () => {
    if (!newFiring.contents.trim()) {
      alert('Please describe what was in the firing');
      return;
    }

    const firing: Firing = {
      ...newFiring,
      id: `firing-${Date.now()}`
    };

    setFirings([firing, ...firings]);
    setKilnStats({
      ...kilnStats,
      totalFirings: kilnStats.totalFirings + 1,
      firingSinceElements: kilnStats.firingSinceElements + 1
    });
    
    setNewFiring({
      date: new Date().toISOString().slice(0, 16),
      type: 'Bisque',
      cone: '04',
      temperature: undefined,
      program: '',
      duration: undefined,
      contents: '',
      result: 'Success',
      notes: '',
      issues: ''
    });
    setIsAddingFiring(false);
  };

  const deleteFiring = (id: string) => {
    if (confirm('Delete this firing record?')) {
      setFirings(firings.filter(f => f.id !== id));
      setKilnStats({
        ...kilnStats,
        totalFirings: Math.max(0, kilnStats.totalFirings - 1),
        firingSinceElements: Math.max(0, kilnStats.firingSinceElements - 1)
      });
    }
  };

  // Handle photo uploads
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentPhotos = newFiring.photos || [];
    const maxPhotos = 5;

    if (currentPhotos.length >= maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed per firing`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (currentPhotos.length >= maxPhotos) return;

      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setNewFiring(prev => ({
          ...prev,
          photos: [...(prev.photos || []), dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setNewFiring(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index)
    }));
  };

  const removePhotoFromFiring = (firingId: string, photoIndex: number) => {
    setFirings(prev => prev.map(firing => {
      if (firing.id === firingId) {
        return {
          ...firing,
          photos: (firing.photos || []).filter((_, i) => i !== photoIndex)
        };
      }
      return firing;
    }));
  };

  // Filter and search
  const filteredFirings = firings.filter(firing => {
    const matchesType = filterType === 'All' || firing.type === filterType;
    const matchesSearch = searchTerm === '' || 
      firing.contents.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firing.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firing.cone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate statistics
  const successRate = firings.length > 0 
    ? Math.round((firings.filter(f => f.result === 'Success').length / firings.length) * 100)
    : 0;

  const avgDuration = firings.filter(f => f.duration).length > 0
    ? (firings.filter(f => f.duration).reduce((acc, f) => acc + (f.duration || 0), 0) / firings.filter(f => f.duration).length).toFixed(1)
    : 'N/A';

  const bisqueCount = firings.filter(f => f.type === 'Bisque').length;
  const glazeCount = firings.filter(f => f.type === 'Glaze').length;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return 'N/A';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const getResultColor = (result: FiringResult) => {
    switch (result) {
      case 'Success': return 'text-green-600 bg-green-50 border-green-200';
      case 'Partial': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Failed': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getResultIcon = (result: FiringResult) => {
    switch (result) {
      case 'Success': return <CheckCircle className="w-4 h-4" />;
      case 'Partial': return <AlertCircle className="w-4 h-4" />;
      case 'Failed': return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getConeTemp = (cone: string): string => {
    const temps: { [key: string]: string } = {
      '022': '1112°F',
      '06': '1828°F',
      '05': '1888°F',
      '04': '1945°F',
      '6': '2232°F',
      '10': '2381°F'
    };
    return temps[cone] || '';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          <h2 className="text-slate-900">Firing Log</h2>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>

      {/* Add New Firing - Moved to Top */}
      {!isAddingFiring ? (
        <button
          onClick={() => setIsAddingFiring(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded border-2 border-dashed border-orange-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log New Firing
        </button>
      ) : (
        <div className="bg-orange-50 border-2 border-orange-200 rounded p-4">
          <h3 className="text-slate-900 mb-3">Log New Firing</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newFiring.date.slice(0, 16)}
                  onChange={(e) => setNewFiring({ ...newFiring, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Type *</label>
                <select
                  value={newFiring.type}
                  onChange={(e) => setNewFiring({ ...newFiring, type: e.target.value as FiringType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  <option value="Bisque">Bisque</option>
                  <option value="Glaze">Glaze</option>
                  <option value="Test">Test</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Cone *</label>
                <select
                  value={newFiring.cone}
                  onChange={(e) => setNewFiring({ ...newFiring, cone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  <option value="022">022 (1112°F)</option>
                  <option value="06">06 (1828°F)</option>
                  <option value="05">05 (1888°F)</option>
                  <option value="04">04 (1945°F)</option>
                  <option value="6">6 (2232°F)</option>
                  <option value="10">10 (2381°F)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Actual Temp (°F)</label>
                <input
                  type="number"
                  value={newFiring.temperature || ''}
                  onChange={(e) => setNewFiring({ ...newFiring, temperature: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="1945"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Duration (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newFiring.duration || ''}
                  onChange={(e) => setNewFiring({ ...newFiring, duration: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="10.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Program/Schedule</label>
              <input
                type="text"
                value={newFiring.program || ''}
                onChange={(e) => setNewFiring({ ...newFiring, program: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g., Slow Bisque, Medium Glaze, Program 4..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Contents *</label>
              <input
                type="text"
                value={newFiring.contents}
                onChange={(e) => setNewFiring({ ...newFiring, contents: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g., 12 mugs, 6 bowls, 8 test tiles..."
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Result *</label>
              <div className="flex gap-2">
                {(['Success', 'Partial', 'Failed'] as FiringResult[]).map(result => (
                  <button
                    key={result}
                    onClick={() => setNewFiring({ ...newFiring, result })}
                    className={`flex-1 px-3 py-2 rounded text-sm border-2 transition-colors ${
                      newFiring.result === result
                        ? result === 'Success' ? 'bg-green-100 border-green-500 text-green-900' :
                          result === 'Partial' ? 'bg-amber-100 border-amber-500 text-amber-900' :
                          'bg-red-100 border-red-500 text-red-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {result}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Notes</label>
              <textarea
                value={newFiring.notes || ''}
                onChange={(e) => setNewFiring({ ...newFiring, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                rows={2}
                placeholder="General observations, what worked well..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Issues/Problems</label>
              <textarea
                value={newFiring.issues || ''}
                onChange={(e) => setNewFiring({ ...newFiring, issues: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                rows={2}
                placeholder="Any problems, things to avoid next time..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">
                Photos {newFiring.photos && newFiring.photos.length > 0 && (
                  <span className="text-slate-500">({newFiring.photos.length}/5)</span>
                )}
              </label>
              
              {/* Photo Previews */}
              {newFiring.photos && newFiring.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {newFiring.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border-2 border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {(!newFiring.photos || newFiring.photos.length < 5) && (
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition-colors">
                  <Camera className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-700">Add Photos of Firing Results</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Upload up to 5 photos to document your firing results
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={addFiring}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
              >
                Save Firing
              </button>
              <button
                onClick={() => setIsAddingFiring(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Dashboard */}
      {showStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="text-center">
            <div className="text-2xl text-slate-900">{kilnStats.totalFirings}</div>
            <div className="text-xs text-slate-600">Total Firings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-slate-900">{successRate}%</div>
            <div className="text-xs text-slate-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-slate-900">{kilnStats.firingSinceElements}</div>
            <div className="text-xs text-slate-600">Since Elements</div>
            {kilnStats.firingSinceElements > 200 && (
              <div className="text-xs text-orange-600 mt-1">⚠️ Check soon</div>
            )}
          </div>
          <div className="text-center">
            <div className="text-2xl text-slate-900">{avgDuration}</div>
            <div className="text-xs text-slate-600">Avg Duration (h)</div>
          </div>
          <div className="text-center col-span-2 lg:col-span-1">
            <div className="text-2xl text-slate-900">{bisqueCount}</div>
            <div className="text-xs text-slate-600">Bisque Firings</div>
          </div>
          <div className="text-center col-span-2 lg:col-span-1">
            <div className="text-2xl text-slate-900">{glazeCount}</div>
            <div className="text-xs text-slate-600">Glaze Firings</div>
          </div>
          <div className="text-center col-span-2">
            <div className="text-sm text-slate-900">
              {kilnStats.elementInstallDate 
                ? new Date(kilnStats.elementInstallDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Not Set'}
            </div>
            <div className="text-xs text-slate-600">Elements Installed</div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search firings..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'All' | FiringType)}
          className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
        >
          <option value="All">All Types</option>
          <option value="Bisque">Bisque</option>
          <option value="Glaze">Glaze</option>
          <option value="Test">Test</option>
        </select>
      </div>

      {/* Firing List */}
      <div className="space-y-3 mb-4 max-h-[500px] overflow-y-auto">
        {filteredFirings.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm || filterType !== 'All' 
              ? 'No firings match your filters'
              : 'No firings logged yet. Add your first firing below!'}
          </div>
        ) : (
          filteredFirings.map(firing => (
            <div
              key={firing.id}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      firing.type === 'Bisque' ? 'bg-blue-100 text-blue-700' :
                      firing.type === 'Glaze' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {firing.type}
                    </span>
                    <span className="text-sm text-slate-900">
                      Cone {firing.cone}
                      {getConeTemp(firing.cone) && (
                        <span className="text-slate-500 ml-1">({getConeTemp(firing.cone)})</span>
                      )}
                    </span>
                    {firing.temperature && (
                      <span className="text-xs text-slate-500">
                        Actual: {firing.temperature}°F
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3 h-3" />
                    {formatDate(firing.date)}
                    {firing.duration && (
                      <>
                        <Clock className="w-3 h-3 ml-2" />
                        {formatDuration(firing.duration)}
                      </>
                    )}
                    {firing.program && (
                      <>
                        <ThermometerSun className="w-3 h-3 ml-2" />
                        {firing.program}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${getResultColor(firing.result)}`}>
                    {getResultIcon(firing.result)}
                    {firing.result}
                  </span>
                  <button
                    onClick={() => deleteFiring(firing.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-700 mb-2">
                <span className="text-slate-900">Contents:</span> {firing.contents}
              </div>

              {firing.notes && (
                <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded mb-2">
                  📝 {firing.notes}
                </div>
              )}

              {firing.issues && (
                <div className="text-sm text-orange-700 bg-orange-50 p-2 rounded border border-orange-200 mb-2">
                  ⚠️ <span className="text-slate-900">Issues:</span> {firing.issues}
                </div>
              )}

              {firing.photos && firing.photos.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-slate-600" />
                    <span className="text-xs text-slate-600">Photos ({firing.photos.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {firing.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Firing result ${index + 1}`}
                          className="w-24 h-24 object-cover rounded border-2 border-slate-200 hover:border-orange-400 transition-colors cursor-pointer"
                          onClick={() => window.open(photo, '_blank')}
                        />
                        <button
                          onClick={() => removePhotoFromFiring(firing.id, index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-600">
          💡 <span className="text-slate-900">Pro Tip:</span> Track every firing to identify patterns, 
          troubleshoot issues, and improve your results. Note problems to avoid repeating mistakes. 
          Kiln elements typically last 200-400 firings depending on usage.
        </p>
      </div>
    </div>
  );
}
