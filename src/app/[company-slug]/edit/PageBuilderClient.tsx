"use client";

import React, { useState, useTransition } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ThemeConfig, SectionData, saveDraftAction, publishAction } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MediaUploader } from '../../../components/ui/MediaUploader';

// Sortable Item Component
const THEME_PRESETS = [
  { id: 'minimal_light', name: 'Minimal Light', bg: '#f8fafc', text: '#334155', accent: '#4f46e5' },
  { id: 'modern_dark', name: 'Modern Dark', bg: '#0f172a', text: '#94a3b8', accent: '#10b981' },
  { id: 'ocean', name: 'Ocean Depth', bg: '#082f49', text: '#7dd3fc', accent: '#0ea5e9' },
  { id: 'sunset', name: 'Warm Sunset', bg: '#fffbeb', text: '#78350f', accent: '#f59e0b' },
];

function SortableSectionItem({ 
  section, 
  onEdit, 
  onRemove 
}: { 
  section: SectionData, 
  onEdit: () => void, 
  onRemove: () => void 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-4 mb-3 bg-slate-900/50 border border-white/10 rounded-xl hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-4">
        <button {...attributes} {...listeners} className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 touch-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </button>
        <div>
          <h3 className="text-slate-100 font-medium">{section.title}</h3>
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase mt-1">Type: {section.type.replace(/_/g, ' ')}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors">Edit</button>
        <button onClick={onRemove} className="px-3 py-1.5 text-xs border border-red-900/50 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors">Remove</button>
      </div>
    </div>
  );
}

export default function PageBuilderClient({ 
  companyId, 
  companySlug,
  initialThemeConfig, 
  initialSections 
}: { 
  companyId: string;
  companySlug: string;
  initialThemeConfig: any;
  initialSections: any[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'branding' | 'sections'>('branding');
  const [theme, setTheme] = useState<ThemeConfig>(initialThemeConfig || {});
  
  // Assign stable temp IDs to initial sections for dnd-kit
  const [sections, setSections] = useState<SectionData[]>(
    initialSections.map(s => ({ ...s, id: s.id || Math.random().toString(36).substr(2, 9) }))
  );
  
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const editingSection = sections.find(s => s.id === editingSectionId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addSection = (type: SectionData['type']) => {
    const newSection: SectionData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `New ${type.replace(/_/g, ' ')}`,
      content: {},
      displayOrder: sections.length
    };
    setSections([...sections, newSection]);
    setEditingSectionId(newSection.id);
    setActiveTab('sections');
  };

  const handleSaveDraft = () => {
    startTransition(async () => {
      try {
        await saveDraftAction(companyId, theme, sections);
        alert("Draft saved successfully!");
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to save draft");
      }
    });
  };

  const handlePublish = () => {
    if (!confirm("Are you sure you want to publish these changes? The public will see them immediately.")) return;
    startTransition(async () => {
      try {
        await publishAction(companyId, companySlug);
        alert("Page published successfully!");
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to publish page");
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <h1 className="text-2xl font-light text-slate-50 font-playfair mb-6 tracking-tight">Builder</h1>
        
        <button 
          onClick={() => { setActiveTab('branding'); setEditingSectionId(null); }}
          className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'branding' && !editingSectionId ? 'bg-slate-100 text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
        >
          Theme & Branding
        </button>
        <button 
          onClick={() => { setActiveTab('sections'); setEditingSectionId(null); }}
          className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'sections' || editingSectionId ? 'bg-slate-100 text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
        >
          Content Sections
        </button>

        <div className="mt-12 flex flex-col gap-3">
          <button onClick={handleSaveDraft} disabled={isPending} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Draft'}
          </button>
          <Link href={`/${companySlug}/preview`} target="_blank" className="w-full py-2.5 bg-slate-900/50 hover:bg-slate-900 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-800 text-center block">
            Preview Draft
          </Link>
          <button onClick={handlePublish} disabled={isPending} className="w-full py-2.5 bg-white hover:bg-slate-200 text-slate-900 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 mt-4">
            {isPending ? 'Publishing...' : 'Publish to Live'}
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="lg:col-span-9 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[600px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        
        {/* BRANDING TAB */}
        {activeTab === 'branding' && !editingSectionId && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extralight text-slate-50 font-playfair mb-8">Brand Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Company Logo</label>
                <MediaUploader
                  companyId={companyId}
                  variant="logo"
                  currentUrl={theme.logoUrl}
                  onUpload={(url) => setTheme({ ...theme, logoUrl: url })}
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-3">Color Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  {THEME_PRESETS.map(preset => {
                    const isSelected = theme.presetTheme === preset.id || (!theme.presetTheme && preset.id === 'minimal_light');
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setTheme({ ...theme, presetTheme: preset.id })}
                        className={`flex flex-col gap-2 p-3 rounded-xl border text-left transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/10 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800'}`}
                      >
                        <div className="flex w-full h-8 rounded-md overflow-hidden border border-white/10">
                          <div style={{ backgroundColor: preset.bg }} className="flex-1 h-full"></div>
                          <div style={{ backgroundColor: preset.text }} className="w-4 h-full"></div>
                          <div style={{ backgroundColor: preset.accent }} className="w-8 h-full"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-200">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Hero Headline</label>
                <input type="text" value={theme.heroHeadline || ''} onChange={e => setTheme({...theme, heroHeadline: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Join our mission..." />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Hero Subtext</label>
                <textarea value={theme.heroSubtext || ''} onChange={e => setTheme({...theme, heroSubtext: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 h-24" placeholder="We are building the future of..." />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Hero Background Image</label>
                <MediaUploader
                  companyId={companyId}
                  variant="hero"
                  currentUrl={theme.heroImageUrl}
                  onUpload={(url) => setTheme({ ...theme, heroImageUrl: url })}
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Culture Video URL (YouTube/Vimeo)</label>
                <input type="text" value={theme.cultureVideoUrl || ''} onChange={e => setTheme({...theme, cultureVideoUrl: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
            </div>
          </div>
        )}

        {/* SECTIONS LIST TAB */}
        {activeTab === 'sections' && !editingSectionId && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extralight text-slate-50 font-playfair mb-8">Page Sections</h2>
            
            {sections.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/30 border border-white/5 rounded-2xl border-dashed mb-8">
                <p className="text-slate-400 font-mono tracking-wider text-sm uppercase">No sections added yet.</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1 mb-8">
                    {sections.map((section) => (
                      <SortableSectionItem 
                        key={section.id} 
                        section={section} 
                        onEdit={() => setEditingSectionId(section.id)}
                        onRemove={() => setSections(sections.filter(s => s.id !== section.id))}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xs font-mono tracking-wider uppercase text-slate-400 mb-4">Add a new section</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { type: 'about', label: 'About Us' },
                  { type: 'life_at_company', label: 'Life at Company' },
                  { type: 'jobs', label: 'Open Jobs' },
                  { type: 'custom_text', label: 'Custom Text' }
                ].filter(s => !sections.some(existing => existing.type === s.type)).map(s => (
                  <button 
                    key={s.type}
                    onClick={() => addSection(s.type as SectionData['type'])} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm transition-colors"
                  >
                    + {s.label}
                  </button>
                ))}
                {sections.length >= 4 && (
                  <p className="text-sm text-slate-500 italic w-full">All available section types have been added.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION EDITOR */}
        {editingSectionId && editingSection && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setEditingSectionId(null)} className="text-slate-400 hover:text-slate-100 flex items-center gap-2 text-sm font-medium mb-8 transition-colors">
              &larr; Back to Sections
            </button>
            <h2 className="text-3xl font-extralight text-slate-50 font-playfair mb-2">Edit {editingSection.type.replace(/_/g, ' ')}</h2>
            <p className="text-slate-500 font-mono tracking-wider text-xs uppercase mb-8">Configure this section&apos;s content</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Section Title</label>
                <input 
                  type="text" 
                  value={editingSection.title} 
                  onChange={e => setSections(sections.map(s => s.id === editingSection.id ? { ...s, title: e.target.value } : s))} 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500" 
                />
              </div>
              
              {/* Specialized fields based on type */}
              {editingSection.type !== 'jobs' && (
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">Content Body (Text)</label>
                  <textarea 
                    value={editingSection.content?.body || ''} 
                    onChange={e => setSections(sections.map(s => s.id === editingSection.id ? { ...s, content: { ...s.content, body: e.target.value } } : s))} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[200px]" 
                  />
                </div>
              )}
              {editingSection.type === 'jobs' && (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                  <p className="text-sm text-slate-300">This section automatically displays your company&apos;s active jobs. You can customize the section title above.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <button onClick={() => setEditingSectionId(null)} className="px-6 py-2.5 bg-slate-100 text-slate-900 font-medium rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Done Editing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
