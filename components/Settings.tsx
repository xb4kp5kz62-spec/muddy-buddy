import { Save, RotateCcw, Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  onReset: () => void;
}

export function Settings({ onReset }: SettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-2">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-terracotta-500" />
        <h2 className="text-slate-800">Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Auto-save Status */}
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-slate-800">Auto-save Enabled</div>
              <div className="text-sm text-slate-500">All changes are saved automatically to your device</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>

        {/* Reset to Defaults */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-slate-600" />
            <div>
              <div className="text-slate-800">Reset to Default Layout</div>
              <div className="text-sm text-slate-500">Clear all changes and restore the original studio layout</div>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-white hover:bg-slate-100 text-slate-700 rounded-lg border-2 border-slate-300 transition-colors shadow-sm"
          >
            Reset
          </button>
        </div>

        {/* PWA Info */}
        <div className="p-4 bg-ochre-50 rounded-lg border-2 border-ochre-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📱</div>
            <div>
              <div className="text-slate-800 mb-1">Works Offline</div>
              <div className="text-sm text-slate-600">
                This app works offline! All your data is stored locally on your device.
                Add it to your home screen for the best mobile experience.
              </div>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="p-4 bg-celadon-50 rounded-lg border-2 border-celadon-300">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💾</div>
            <div>
              <div className="text-slate-800 mb-1">Data Storage</div>
              <div className="text-sm text-slate-600">
                Your floor plans, photos, and lists are saved in your browser's local storage.
                Make sure to back up important data periodically.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
