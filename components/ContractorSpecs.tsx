import { Hammer, CheckSquare } from 'lucide-react';

export function ContractorSpecs() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-t-lg flex items-center gap-2">
        <Hammer className="w-5 h-5" />
        <h3>Contractor Specifications</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Wall Construction */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-slate-900">Wall Construction</h4>
          </div>
          <div className="ml-6 space-y-2 text-sm text-slate-600">
            <p><span className="text-slate-900">New left wall:</span> 2x4 framed wall to separate pottery bay from other garage bays</p>
            <ul className="space-y-1 ml-4">
              <li>• Install 3' wide pre-hung door at approximately 8' from top wall</li>
              <li>• Insulate with R-13 or R-15 fiberglass batts</li>
              <li>• 5/8" drywall both sides, taped and finished</li>
              <li>• Consider soundproofing insulation if you'll be throwing late</li>
            </ul>
            <p className="mt-2"><span className="text-slate-900">Optional kiln room enclosure:</span></p>
            <ul className="space-y-1 ml-4">
              <li>• 2x4 framed walls creating ~6.5' x 6' room in back corner</li>
              <li>• Use fire-rated 5/8" Type X drywall (not required by code but safer)</li>
              <li>• No door needed - open entry is fine for ventilation</li>
              <li>• Isolates heat and fumes from main studio</li>
            </ul>
          </div>
        </div>

        {/* Electrical Work */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-yellow-600" />
            <h4 className="text-slate-900">Electrical (Licensed Electrician Required)</h4>
          </div>
          <div className="ml-6 space-y-2 text-sm text-slate-600">
            <p className="text-red-700">⚠️ This is the most critical and expensive part of the build</p>
            
            <div className="mt-3">
              <p className="text-slate-900">Kiln Circuit (ESSENTIAL):</p>
              <ul className="space-y-1 ml-4">
                <li>• Dedicated 240V/50A circuit from main panel</li>
                <li>• 6/3 wire (6 AWG, 3 conductor) with ground</li>
                <li>• NEMA 6-50R receptacle at kiln location (back corner)</li>
                <li>• May require panel upgrade if insufficient amperage available</li>
                <li>• Estimated cost: $1,500-$2,500</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <p className="text-slate-900">General Power (120V circuits):</p>
              <ul className="space-y-1 ml-4">
                <li>• Outlets every 6' along walls (code minimum)</li>
                <li>• Dedicated circuit for wheels (they draw 3-5 amps each)</li>
                <li>• GFCI outlet near sink (required for wet location)</li>
                <li>• Estimated cost: $500-$1,000</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <p className="text-slate-900">Lighting:</p>
              <ul className="space-y-1 ml-4">
                <li>• LED shop lights (4,000-5,000K color temp for accurate clay color)</li>
                <li>• Mount 4-6 fixtures on ceiling for even coverage</li>
                <li>• Consider dimmer switch for ambiance control</li>
                <li>• Estimated cost: $200-$500</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Plumbing */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-slate-900">Plumbing (Licensed Plumber Recommended)</h4>
          </div>
          <div className="ml-6 space-y-2 text-sm text-slate-600">
            <p><span className="text-slate-900">Sink location:</span> Right (exterior) wall - easier to run plumbing through exterior wall</p>
            
            <div className="mt-3">
              <p className="text-slate-900">Requirements:</p>
              <ul className="space-y-1 ml-4">
                <li>• Utility sink (laundry tub style) or commercial clay sink</li>
                <li>• Hot and cold water supply lines</li>
                <li>• <span className="text-red-700">CRITICAL: Sediment trap/clay trap system</span></li>
                <li>• Never allow clay to go down regular drain - it will harden and clog pipes</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <p className="text-slate-900">Clay Trap Options:</p>
              <ul className="space-y-1 ml-4">
                <li>• <span className="text-slate-900">DIY bucket system:</span> 3-bucket series under sink. Clay settles, pour off water. ($50-$100)</li>
                <li>• <span className="text-slate-900">Commercial clay trap:</span> Plaster or concrete settling basin. ($300-$600)</li>
                <li>• <span className="text-slate-900">Professional install:</span> Built-in sediment trap in drainage. ($500-$1,000)</li>
              </ul>
            </div>
            
            <p className="mt-3"><span className="text-slate-900">Estimated total cost:</span> $800-$2,000 depending on complexity</p>
          </div>
        </div>

        {/* HVAC */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-cyan-600" />
            <h4 className="text-slate-900">HVAC & Ventilation</h4>
          </div>
          <div className="ml-6 space-y-2 text-sm text-slate-600">
            <div>
              <p className="text-slate-900">Kiln Ventilation (NON-NEGOTIABLE):</p>
              <ul className="space-y-1 ml-4">
                <li>• Vent-A-Kiln or Skutt EnviroVent downdraft system ($400-$800)</li>
                <li>• Requires 4" duct through exterior wall near kiln</li>
                <li>• Vents fumes and heat outside during firing</li>
                <li>• This is a safety requirement - kiln fumes are toxic</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <p className="text-slate-900">Heating & Cooling Options:</p>
              <ul className="space-y-1 ml-4">
                <li>• <span className="text-slate-900">Best:</span> Mini-split heat pump. Quiet, efficient, both heat/cool. ($1,500-$3,000 installed)</li>
                <li>• <span className="text-slate-900">Budget:</span> Electric space heater + window AC. ($200-$600 total)</li>
                <li>• <span className="text-slate-900">Premium:</span> Extend HVAC from main house if feasible. ($2,000-$5,000)</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <p className="text-slate-900">General Ventilation:</p>
              <ul className="space-y-1 ml-4">
                <li>• Exhaust fan in ceiling or wall ($100-$300)</li>
                <li>• HEPA air purifier for clay dust ($200-$400)</li>
                <li>• Garage door provides excellent natural ventilation in good weather</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Flooring */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-green-600" />
            <h4 className="text-slate-900">Flooring</h4>
          </div>
          <div className="ml-6 space-y-2 text-sm text-slate-600">
            <p><span className="text-slate-900">Recommended:</span> Seal existing concrete garage floor</p>
            <ul className="space-y-1 ml-4">
              <li>• Epoxy or polyurethane concrete sealer ($2-$5/sq ft DIY or professional)</li>
              <li>• For 12x20 = 240 sq ft: $480-$1,200</li>
              <li>• Alternative: Waterproof luxury vinyl plank (LifeProof, Coretec) $3-$7/sq ft</li>
              <li>• AVOID: Carpet, hardwood, unsealed concrete - clay dust will ruin them</li>
            </ul>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-slate-900 mb-3">Estimated Total Construction Budget</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Wall construction (framing, drywall, door):</span>
              <span className="text-slate-900">$800-$1,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Electrical (kiln circuit + outlets + lights):</span>
              <span className="text-slate-900">$2,000-$4,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Plumbing (sink + clay trap):</span>
              <span className="text-slate-900">$800-$2,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">HVAC (kiln vent + heating/cooling):</span>
              <span className="text-slate-900">$1,500-$3,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Flooring (sealed concrete):</span>
              <span className="text-slate-900">$500-$1,200</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2 mt-2">
              <span className="text-slate-900">Total Build-Out Cost:</span>
              <span className="text-slate-900">$5,600-$12,200</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 italic">
              <span>Plus equipment costs (see Equipment List panel)</span>
              <span>~$4,000-$8,000</span>
            </div>
          </div>
        </div>

        {/* Permits */}
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-900">
            <span className="">📋 Permits:</span> Electrical and plumbing work will likely require permits. 
            Your contractors should pull these. Budget $200-$500 for permit fees. Check local building codes - 
            some areas may require permits for the wall construction as well.
          </p>
        </div>
      </div>
    </div>
  );
}
