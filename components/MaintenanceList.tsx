import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, MessageSquare, Bell, Pencil, Mail } from 'lucide-react';

type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

interface MaintenanceTask {
  id: string;
  name: string;
  frequency: Frequency;
  instructions?: string;
  lastCompleted?: string; // ISO date string
  isCustom?: boolean;
}

export function MaintenanceList() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    // Daily
    {
      id: 'd1',
      name: 'Wipe down work surfaces',
      frequency: 'Daily',
      instructions: 'Clean clay residue from tables and wedging surface'
    },
    {
      id: 'd2',
      name: 'Empty water buckets/throwing splash pan',
      frequency: 'Daily',
      instructions: 'Pour into clay trap or settling buckets'
    },
    {
      id: 'd3',
      name: 'Cover clay and works in progress',
      frequency: 'Daily',
      instructions: 'Use plastic sheeting to prevent drying'
    },
    // Weekly
    {
      id: 'w1',
      name: 'Mop studio floor',
      frequency: 'Weekly',
      instructions: 'Clay dust control - damp mop, never dry sweep'
    },
    {
      id: 'w2',
      name: 'Clean wheel splash pan thoroughly',
      frequency: 'Weekly',
      instructions: 'Remove dried clay buildup'
    },
    {
      id: 'w3',
      name: 'Check clay moisture levels',
      frequency: 'Weekly',
      instructions: 'Add water to storage containers if needed'
    },
    {
      id: 'w4',
      name: 'Organize and clean tools',
      frequency: 'Weekly',
      instructions: 'Wash tools, check for rust, reorganize'
    },
    // Monthly
    {
      id: 'm1',
      name: 'Clean mini-split filters',
      frequency: 'Monthly',
      instructions: 'Remove and wash reusable filters, or replace disposable ones'
    },
    {
      id: 'm2',
      name: 'Empty and clean clay trap/settling buckets',
      frequency: 'Monthly',
      instructions: 'Remove settled clay, clean buckets, restart settling process'
    },
    {
      id: 'm3',
      name: 'Deep clean sink area',
      frequency: 'Monthly',
      instructions: 'Scrub sink, check drain, clean surrounding area'
    },
    {
      id: 'm4',
      name: 'Vacuum/dust shelving units',
      frequency: 'Monthly',
      instructions: 'Remove clay dust from all storage areas'
    },
    {
      id: 'm5',
      name: 'Check kiln elements for cracks',
      frequency: 'Monthly',
      instructions: 'Visual inspection - look for breaks or sagging'
    },
    // Quarterly
    {
      id: 'q1',
      name: 'Vacuum kiln chamber and elements',
      frequency: 'Quarterly',
      instructions: 'Use soft brush attachment, be gentle with elements'
    },
    {
      id: 'q2',
      name: 'Inspect kiln lid and door seal',
      frequency: 'Quarterly',
      instructions: 'Check for gaps, replace fiber if deteriorating'
    },
    {
      id: 'q3',
      name: 'Replace HVAC filters',
      frequency: 'Quarterly',
      instructions: 'Clay dust clogs filters faster - check monthly, replace quarterly'
    },
    {
      id: 'q4',
      name: 'Organize and inventory glazes/supplies',
      frequency: 'Quarterly',
      instructions: 'Check expiration dates, stir glazes, restock as needed'
    },
    // Annually
    {
      id: 'a1',
      name: 'Kiln maintenance check',
      frequency: 'Annually',
      instructions: 'Test elements with multimeter, check thermocouple, inspect relays'
    },
    {
      id: 'a2',
      name: 'Deep clean entire studio',
      frequency: 'Annually',
      instructions: 'Top to bottom cleaning, move equipment, clean behind/under everything'
    },
    {
      id: 'a3',
      name: 'Refresh wedging canvas',
      frequency: 'Annually',
      instructions: 'Replace worn canvas on wedging table'
    },
    {
      id: 'a4',
      name: 'Plaster trap rebuild',
      frequency: 'Annually',
      instructions: 'If using DIY plaster trap, replace plaster and rebuild system'
    }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    name: '',
    frequency: 'Weekly' as Frequency,
    instructions: ''
  });

  const frequencies: Frequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];

  const completeTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, lastCompleted: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (!newTask.name.trim()) return;

    const task: MaintenanceTask = {
      id: `custom-${Date.now()}`,
      name: newTask.name,
      frequency: newTask.frequency,
      instructions: newTask.instructions,
      isCustom: true
    };

    setTasks([...tasks, task]);
    setNewTask({ name: '', frequency: 'Weekly', instructions: '' });
    setIsAddingTask(false);
  };

  const startEdit = (task: MaintenanceTask) => {
    setEditingTaskId(task.id);
    setNewTask({
      name: task.name,
      frequency: task.frequency,
      instructions: task.instructions || ''
    });
  };

  const saveEdit = () => {
    if (!newTask.name.trim() || !editingTaskId) return;

    setTasks(tasks.map(task => 
      task.id === editingTaskId 
        ? { ...task, name: newTask.name, frequency: newTask.frequency, instructions: newTask.instructions }
        : task
    ));
    setEditingTaskId(null);
    setNewTask({ name: '', frequency: 'Weekly', instructions: '' });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setNewTask({ name: '', frequency: 'Weekly', instructions: '' });
  };

  // Helper to check if task needs attention
  const needsAttention = (task: MaintenanceTask): boolean => {
    if (!task.lastCompleted) return true;

    const lastCompleted = new Date(task.lastCompleted);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));

    const thresholds: Record<Frequency, number> = {
      'Daily': 1,
      'Weekly': 7,
      'Monthly': 30,
      'Quarterly': 90,
      'Annually': 365
    };

    return daysSince >= thresholds[task.frequency];
  };

  // Format last completed date
  const formatLastCompleted = (dateString?: string): string => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince === 0) return 'Today';
    if (daysSince === 1) return 'Yesterday';
    if (daysSince < 7) return `${daysSince} days ago`;
    if (daysSince < 30) return `${Math.floor(daysSince / 7)} weeks ago`;
    if (daysSince < 365) return `${Math.floor(daysSince / 30)} months ago`;
    return `${Math.floor(daysSince / 365)} years ago`;
  };

  // Generate reminder text
  const generateReminderText = () => {
    const dueTasks = tasks.filter(needsAttention);
    
    let text = '🏺 POTTERY STUDIO MAINTENANCE REMINDERS\n';
    text += '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

    if (dueTasks.length === 0) {
      text += '✨ All caught up! No maintenance tasks due.\n\n';
    } else {
      text += `⚠️ ${dueTasks.length} task${dueTasks.length > 1 ? 's' : ''} need${dueTasks.length === 1 ? 's' : ''} attention:\n\n`;
      
      frequencies.forEach(freq => {
        const freqTasks = dueTasks.filter(t => t.frequency === freq);
        if (freqTasks.length > 0) {
          text += `${freq.toUpperCase()}:\n`;
          freqTasks.forEach(task => {
            text += `☐ ${task.name}\n`;
            text += `   Last: ${formatLastCompleted(task.lastCompleted)}\n`;
          });
          text += '\n';
        }
      });
    }

    text += '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    text += 'Keep your pottery studio running smoothly! 🎨';

    return text;
  };

  const sendReminders = async () => {
    const text = generateReminderText();
    
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Studio Maintenance Reminders',
          text: text
        });
        return;
      } catch (err) {
        // User cancelled or not available
      }
    }

    // Fallback: SMS
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  const copyReminders = async () => {
    const text = generateReminderText();
    try {
      await navigator.clipboard.writeText(text);
      alert('✓ Maintenance reminders copied to clipboard!');
    } catch (err) {
      alert(text);
    }
  };

  const emailReminders = () => {
    const text = generateReminderText();
    const subject = encodeURIComponent('Studio Maintenance Reminders');
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Group tasks by frequency
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.frequency]) acc[task.frequency] = [];
    acc[task.frequency].push(task);
    return acc;
  }, {} as Record<Frequency, MaintenanceTask[]>);

  const totalDue = tasks.filter(needsAttention).length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-900">Maintenance Schedule</h2>
          <p className="text-sm text-slate-600 mt-1">
            {totalDue > 0 ? (
              <span className="text-orange-600">⚠️ {totalDue} task{totalDue > 1 ? 's' : ''} need attention</span>
            ) : (
              <span className="text-green-600">✓ All tasks up to date!</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sendReminders}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            title="Send via SMS"
          >
            <MessageSquare className="w-4 h-4" />
            SMS
          </button>
          <button
            onClick={copyReminders}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            title="Copy to clipboard"
          >
            <Bell className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={emailReminders}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            title="Email reminders"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
        {frequencies.map(frequency => {
          const freqTasks = groupedTasks[frequency] || [];
          if (freqTasks.length === 0) return null;

          return (
            <div key={frequency}>
              <h3 className="text-slate-700 mb-2 pb-1 border-b border-slate-200 flex items-center justify-between">
                <span>{frequency}</span>
                <span className="text-xs text-slate-500">
                  {freqTasks.filter(needsAttention).length} due
                </span>
              </h3>
              <div className="space-y-2">
                {freqTasks.map(task => {
                  const isDue = needsAttention(task);
                  const isEditing = editingTaskId === task.id;
                  
                  if (isEditing) {
                    return (
                      <div key={task.id} className="bg-blue-50 border-2 border-blue-200 rounded p-4">
                        <h4 className="text-slate-900 mb-3 text-sm">Edit Task</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Task Name *</label>
                            <input
                              type="text"
                              value={newTask.name}
                              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                              autoFocus
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Frequency</label>
                            <select
                              value={newTask.frequency}
                              onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as Frequency })}
                              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                            >
                              {frequencies.map(freq => (
                                <option key={freq} value={freq}>{freq}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Instructions</label>
                            <input
                              type="text"
                              value={newTask.instructions}
                              onChange={(e) => setNewTask({ ...newTask, instructions: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={saveEdit}
                              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded border transition-colors ${
                        isDue
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => completeTask(task.id)}
                          className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                        >
                          {isDue ? (
                            <Circle className="w-5 h-5 text-orange-500" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-slate-900">
                              {task.name}
                              {task.isCustom && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                  Custom
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(task)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors flex-shrink-0"
                                title="Edit task"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
                                title="Delete task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className={`text-xs ${isDue ? 'text-orange-700' : 'text-slate-600'}`}>
                              Last completed: {formatLastCompleted(task.lastCompleted)}
                            </span>
                          </div>
                          {task.instructions && (
                            <div className="text-xs text-slate-600 mt-2 italic">
                              💡 {task.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Task */}
      {!isAddingTask ? (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border-2 border-dashed border-slate-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Custom Maintenance Task
        </button>
      ) : (
        <div className="bg-purple-50 border-2 border-purple-200 rounded p-4">
          <h3 className="text-slate-900 mb-3">Add Custom Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Task Name *</label>
              <input
                type="text"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g., Check wheel bearings, Oil pug mill..."
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Frequency</label>
              <select
                value={newTask.frequency}
                onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as Frequency })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Instructions</label>
              <input
                type="text"
                value={newTask.instructions}
                onChange={(e) => setNewTask({ ...newTask, instructions: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="How to perform this task..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
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
          💡 <span className="text-slate-700">Tip:</span> Mark tasks as complete to track when you last did them. 
          Tasks will automatically show as due again based on their frequency. Use SMS to send yourself reminders!
        </p>
      </div>
    </div>
  );
}
