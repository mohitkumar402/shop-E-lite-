import React, { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeConfig, colorOptions, fontOptions, borderRadiusOptions, spacingOptions, PageSection, SectionType, PromoCardItem, TestimonialItem, CategoryItem, GalleryImage } from '../types/theme';
import { useToast } from '../context/ToastContext';

type AdminView = 'dashboard' | 'pages' | 'products' | 'theme' | 'header' | 'footer' | 'settings';

const sectionTemplates: { type: SectionType; name: string; icon: string; description: string }[] = [
  { type: 'banner', name: 'Banner', icon: '🏷️', description: 'Hero section with title and CTA' },
  { type: 'featuredProducts', name: 'Product Grid', icon: '🛍️', description: 'Display products in a grid' },
  { type: 'categories', name: 'Categories', icon: '📁', description: 'Show product categories' },
  { type: 'promoCards', name: 'Promo Cards', icon: '🎁', description: 'Promotional cards section' },
  { type: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Customer reviews' },
  { type: 'newsletter', name: 'Newsletter', icon: '📧', description: 'Email signup form' },
  { type: 'gallery', name: 'Gallery', icon: '🖼️', description: 'Image gallery' },
  { type: 'videoBanner', name: 'Video Banner', icon: '🎬', description: 'Video background section' },
];

const Admin: React.FC = () => {
  const { 
    theme, 
    updateThemeColor, 
    updateThemeSetting, 
    updateBanner, 
    updateFeatureProducts,
    updatePromoCards,
    addPromoCard,
    updatePromoCard,
    removePromoCard,
    updateNewsletter,
    updateTestimonials,
    addTestimonial,
    updateTestimonial,
    removeTestimonial,
    updateCategories,
    addCategory,
    updateCategory,
    removeCategory,
    updateGallery,
    addGalleryImage,
    removeGalleryImage,
    updateVideoBanner,
    updatePageSection,
    reorderSections,
    addSection,
    removeSection,
    updateHeader,
    updateFooter,
    updateAnnouncementBar,
    resetTheme 
  } = useTheme();
  const { showToast } = useToast();
  
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingPromoCard, setEditingPromoCard] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const selectedPage = theme.pages?.find(p => p.id === selectedPageId);
  const selectedSection = selectedPage?.sections.find(s => s.id === selectedSectionId);
  const selectedPromoCard = useMemo(
    () => theme.promoCards.cards.find((card) => card.id === editingPromoCard) || null,
    [theme.promoCards.cards, editingPromoCard]
  );
  const selectedTestimonial = useMemo(
    () => theme.testimonials.testimonials.find((t) => t.id === editingTestimonial) || null,
    [theme.testimonials.testimonials, editingTestimonial]
  );
  const selectedCategory = useMemo(
    () => theme.categories.categories.find((c) => c.id === editingCategory) || null,
    [theme.categories.categories, editingCategory]
  );

  // Drag and Drop handlers
  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedSection || !selectedPage) return;
    
    const sections = [...selectedPage.sections];
    const draggedIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = sections.splice(draggedIndex, 1);
      sections.splice(targetIndex, 0, removed);
      const reordered = sections.map((s, i) => ({ ...s, order: i }));
      reorderSections(selectedPageId, reordered);
      showToast('Section reordered!', 'success');
    }
    setDraggedSection(null);
  };

  const handleAddSection = (type: SectionType) => {
    const newSection: PageSection = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: selectedPage?.sections.length || 0,
      settings: {}
    };
    addSection(selectedPageId, newSection);
    setShowAddSection(false);
    showToast(`${type} section added!`, 'success');
  };

  const handleRemoveSection = (sectionId: string) => {
    removeSection(selectedPageId, sectionId);
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
    showToast('Section removed!', 'info');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-config.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Theme exported!', 'success');
  };

  const handleSaveTheme = () => {
    localStorage.setItem('shopelite_theme', JSON.stringify(theme));
    showToast('Theme saved successfully!', 'success');
  };

  const handleAddPromoCard = () => {
    const newCard: PromoCardItem = {
      id: `promo-${Date.now()}`,
      title: 'New Promo Card',
      description: 'Add your offer details',
      buttonText: 'Explore',
      buttonLink: '/products',
      backgroundColor: 'violet',
      icon: '✨',
      enabled: true,
    };
    addPromoCard(newCard);
    setEditingPromoCard(newCard.id);
    showToast('Promo card added!', 'success');
  };

  const handleAddTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: `testimonial-${Date.now()}`,
      name: 'New Customer',
      role: 'Customer',
      company: 'Company',
      content: 'Add testimonial content here...',
      avatar: '',
      rating: 5,
      enabled: true,
    };
    addTestimonial(newTestimonial);
    setEditingTestimonial(newTestimonial.id);
    showToast('Testimonial added!', 'success');
  };

  const handleAddCategory = () => {
    const newCategory: CategoryItem = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      icon: '📦',
      image: '',
      link: '/products',
      enabled: true,
    };
    addCategory(newCategory);
    setEditingCategory(newCategory.id);
    showToast('Category added!', 'success');
  };

  const handleAddGalleryImage = () => {
    const newImage: GalleryImage = {
      id: `gallery-${Date.now()}`,
      url: `https://picsum.photos/400/300?random=${Date.now()}`,
      alt: 'Gallery Image',
      caption: 'New Image',
    };
    addGalleryImage(newImage);
    showToast('Image added!', 'success');
  };

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'pages', icon: '📄', label: 'Pages' },
    { id: 'products', icon: '🛍️', label: 'Products' },
    { id: 'theme', icon: '🎨', label: 'Theme Editor' },
    { id: 'header', icon: '🔝', label: 'Header' },
    { id: 'footer', icon: '🔚', label: 'Footer' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-8 bg-slate-100">
      {/* Sidebar */}
      <div className="w-56 bg-slate-900 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-sm">⚡</span>
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleExport}
            className="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            📦 Export Theme
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-96 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800">
              {activeView === 'dashboard' && 'Dashboard Overview'}
              {activeView === 'pages' && 'Page Builder'}
              {activeView === 'products' && 'Product Management'}
              {activeView === 'theme' && 'Theme Customization'}
              {activeView === 'header' && 'Header Settings'}
              {activeView === 'footer' && 'Footer Settings'}
              {activeView === 'settings' && 'General Settings'}
            </h3>
            <button
              onClick={handleSaveTheme}
              className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors"
            >
              Save
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-violet-50 rounded-xl">
                    <div className="text-2xl font-bold text-violet-600">{theme.pages?.length || 0}</div>
                    <div className="text-sm text-slate-600">Pages</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{theme.pages?.reduce((acc, p) => acc + p.sections.length, 0) || 0}</div>
                    <div className="text-sm text-slate-600">Sections</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button onClick={() => setActiveView('pages')} className="w-full text-left px-3 py-2 bg-white rounded-lg text-sm hover:bg-slate-100">📄 Edit Pages</button>
                    <button onClick={() => setActiveView('theme')} className="w-full text-left px-3 py-2 bg-white rounded-lg text-sm hover:bg-slate-100">🎨 Customize Theme</button>
                    <button onClick={() => setActiveView('header')} className="w-full text-left px-3 py-2 bg-white rounded-lg text-sm hover:bg-slate-100">🔝 Edit Header</button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-2">Current Theme</h4>
                  <p className="text-sm text-slate-600">{theme.name}</p>
                  <div className="flex gap-1 mt-2">
                    {Object.values(theme.colors).map((color, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full bg-${color}-500`}></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pages View */}
            {activeView === 'pages' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Select Page</label>
                  <select
                    value={selectedPageId}
                    onChange={(e) => { setSelectedPageId(e.target.value); setSelectedSectionId(null); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    {theme.pages?.map(page => (
                      <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Sections</label>
                    <button
                      onClick={() => setShowAddSection(true)}
                      className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
                    >
                      + Add Section
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedPage?.sections.sort((a, b) => a.order - b.order).map(section => (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={() => handleDragStart(section.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(section.id)}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedSectionId === section.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        } ${draggedSection === section.id ? 'opacity-50' : ''}`}
                      >
                        <span className="cursor-grab text-slate-400">☰</span>
                        <span className="text-lg">{sectionTemplates.find(t => t.type === section.type)?.icon || '📦'}</span>
                        <span className="flex-1 text-sm font-medium capitalize">{section.type}</span>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={(e) => {
                              e.stopPropagation();
                              updatePageSection(selectedPageId, section.id, { enabled: e.target.checked });
                            }}
                            className="w-4 h-4 text-violet-600 rounded"
                          />
                        </label>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSection && (
                  <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                    <h4 className="font-medium text-slate-700">Section Settings</h4>
                    
                    {selectedSection.type === 'banner' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Title</label>
                          <input
                            type="text"
                            value={theme.banner.title}
                            onChange={(e) => updateBanner({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Subtitle</label>
                          <textarea
                            value={theme.banner.subtitle}
                            onChange={(e) => updateBanner({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Button Text</label>
                            <input
                              type="text"
                              value={theme.banner.buttonText}
                              onChange={(e) => updateBanner({ buttonText: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Button Link</label>
                            <input
                              type="text"
                              value={theme.banner.buttonLink}
                              onChange={(e) => updateBanner({ buttonLink: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Background Type</label>
                          <select
                            value={theme.banner.backgroundType}
                            onChange={(e) => updateBanner({ backgroundType: e.target.value as 'color' | 'gradient' | 'image' })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="color">Solid Color</option>
                            <option value="gradient">Gradient</option>
                            <option value="image">Image</option>
                          </select>
                        </div>
                        {theme.banner.backgroundType === 'gradient' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-slate-600">From</label>
                              <select
                                value={theme.banner.gradientFrom}
                                onChange={(e) => updateBanner({ gradientFrom: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                              >
                                {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-slate-600">To</label>
                              <select
                                value={theme.banner.gradientTo}
                                onChange={(e) => updateBanner({ gradientTo: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                              >
                                {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-xs text-slate-600">Height</label>
                          <select
                            value={theme.banner.height}
                            onChange={(e) => updateBanner({ height: e.target.value as 'small' | 'medium' | 'large' })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Banner settings saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Banner Settings
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'featuredProducts' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Section Title</label>
                          <input
                            type="text"
                            value={theme.featureProducts.title}
                            onChange={(e) => updateFeatureProducts({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Columns</label>
                            <select
                              value={theme.featureProducts.columns}
                              onChange={(e) => updateFeatureProducts({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value={2}>2 Columns</option>
                              <option value={3}>3 Columns</option>
                              <option value={4}>4 Columns</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Products</label>
                            <input
                              type="number"
                              min={1}
                              max={12}
                              value={theme.featureProducts.productCount}
                              onChange={(e) => updateFeatureProducts({ productCount: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Card Style</label>
                          <select
                            value={theme.featureProducts.cardStyle}
                            onChange={(e) => updateFeatureProducts({ cardStyle: e.target.value as 'minimal' | 'detailed' | 'compact' })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="minimal">Minimal</option>
                            <option value="detailed">Detailed</option>
                            <option value="compact">Compact</option>
                          </select>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.featureProducts.showRating}
                              onChange={(e) => updateFeatureProducts({ showRating: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Rating
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.featureProducts.showPrice}
                              onChange={(e) => updateFeatureProducts({ showPrice: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Price
                          </label>
                        </div>
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Product settings saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Product Settings
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'promoCards' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-slate-600">Section Title</label>
                          <input
                            type="text"
                            value={theme.promoCards.title}
                            onChange={(e) => updatePromoCards({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Subtitle</label>
                          <input
                            type="text"
                            value={theme.promoCards.subtitle}
                            onChange={(e) => updatePromoCards({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Layout</label>
                            <select
                              value={theme.promoCards.layout}
                              onChange={(e) => updatePromoCards({ layout: e.target.value as 'grid' | 'carousel' | 'list' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="grid">Grid</option>
                              <option value="carousel">Carousel</option>
                              <option value="list">List</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Columns</label>
                            <select
                              value={theme.promoCards.columns}
                              onChange={(e) => updatePromoCards({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Card Style</label>
                            <select
                              value={theme.promoCards.cardStyle}
                              onChange={(e) => updatePromoCards({ cardStyle: e.target.value as 'filled' | 'outlined' | 'gradient' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="filled">Filled</option>
                              <option value="outlined">Outlined</option>
                              <option value="gradient">Gradient</option>
                            </select>
                          </div>
                          <label className="flex items-end gap-2 text-sm pb-2">
                            <input
                              type="checkbox"
                              checked={theme.promoCards.showIcons}
                              onChange={(e) => updatePromoCards({ showIcons: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Icons
                          </label>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-slate-600">Promo Cards</label>
                            <button
                              onClick={handleAddPromoCard}
                              className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
                            >
                              + Add Card
                            </button>
                          </div>
                          {theme.promoCards.cards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setEditingPromoCard(card.id)}
                              className={`p-2 border rounded-lg cursor-pointer ${
                                editingPromoCard === card.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-medium text-slate-700 truncate">{card.title}</div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePromoCard(card.id);
                                    if (editingPromoCard === card.id) {
                                      setEditingPromoCard(null);
                                    }
                                    showToast('Promo card removed', 'info');
                                  }}
                                  className="text-rose-500 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="text-xs text-slate-500">{card.description}</div>
                            </div>
                          ))}
                        </div>

                        {selectedPromoCard && (
                          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                            <div className="text-xs font-semibold text-slate-700">Edit Card</div>
                            <input
                              type="text"
                              value={selectedPromoCard.title}
                              onChange={(e) => updatePromoCard(selectedPromoCard.id, { title: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              placeholder="Card title"
                            />
                            <input
                              type="text"
                              value={selectedPromoCard.description}
                              onChange={(e) => updatePromoCard(selectedPromoCard.id, { description: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              placeholder="Description"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={selectedPromoCard.icon}
                                onChange={(e) => updatePromoCard(selectedPromoCard.id, { icon: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Icon"
                              />
                              <select
                                value={selectedPromoCard.backgroundColor}
                                onChange={(e) => updatePromoCard(selectedPromoCard.id, { backgroundColor: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              >
                                {colorOptions.map((color) => (
                                  <option key={color} value={color}>{color}</option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={selectedPromoCard.buttonText}
                                onChange={(e) => updatePromoCard(selectedPromoCard.id, { buttonText: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Button text"
                              />
                              <input
                                type="text"
                                value={selectedPromoCard.buttonLink}
                                onChange={(e) => updatePromoCard(selectedPromoCard.id, { buttonLink: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Button link"
                              />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={selectedPromoCard.enabled}
                                onChange={(e) => updatePromoCard(selectedPromoCard.id, { enabled: e.target.checked })}
                                className="w-4 h-4 text-violet-600 rounded"
                              />
                              Card Enabled
                            </label>
                          </div>
                        )}
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Promo Cards saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Promo Cards
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'newsletter' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Title</label>
                          <input
                            type="text"
                            value={theme.newsletter.title}
                            onChange={(e) => updateNewsletter({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Subtitle</label>
                          <textarea
                            rows={2}
                            value={theme.newsletter.subtitle}
                            onChange={(e) => updateNewsletter({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={theme.newsletter.placeholder}
                            onChange={(e) => updateNewsletter({ placeholder: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Input placeholder"
                          />
                          <input
                            type="text"
                            value={theme.newsletter.buttonText}
                            onChange={(e) => updateNewsletter({ buttonText: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Button text"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Layout</label>
                            <select
                              value={theme.newsletter.layout}
                              onChange={(e) => updateNewsletter({ layout: e.target.value as 'centered' | 'split' | 'minimal' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="centered">Centered</option>
                              <option value="split">Split</option>
                              <option value="minimal">Minimal</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Background</label>
                            <select
                              value={theme.newsletter.backgroundType}
                              onChange={(e) => updateNewsletter({ backgroundType: e.target.value as 'color' | 'gradient' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="color">Solid</option>
                              <option value="gradient">Gradient</option>
                            </select>
                          </div>
                        </div>
                        {theme.newsletter.backgroundType === 'gradient' ? (
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={theme.newsletter.gradientFrom}
                              onChange={(e) => updateNewsletter({ gradientFrom: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              {colorOptions.map((color) => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                            <select
                              value={theme.newsletter.gradientTo}
                              onChange={(e) => updateNewsletter({ gradientTo: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              {colorOptions.map((color) => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <select
                            value={theme.newsletter.backgroundColor}
                            onChange={(e) => updateNewsletter({ backgroundColor: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            {colorOptions.map((color) => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        )}
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={theme.newsletter.showImage}
                            onChange={(e) => updateNewsletter({ showImage: e.target.checked })}
                            className="w-4 h-4 text-violet-600 rounded"
                          />
                          Show Side Image
                        </label>
                        {theme.newsletter.showImage && (
                          <input
                            type="text"
                            value={theme.newsletter.imageUrl}
                            onChange={(e) => updateNewsletter({ imageUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Image URL"
                          />
                        )}
                        <div>
                          <label className="text-xs text-slate-600">Success Message</label>
                          <input
                            type="text"
                            value={theme.newsletter.successMessage}
                            onChange={(e) => updateNewsletter({ successMessage: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Newsletter settings saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Newsletter Settings
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'testimonials' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Section Title</label>
                          <input
                            type="text"
                            value={theme.testimonials.title}
                            onChange={(e) => updateTestimonials({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Subtitle</label>
                          <input
                            type="text"
                            value={theme.testimonials.subtitle}
                            onChange={(e) => updateTestimonials({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Layout</label>
                            <select
                              value={theme.testimonials.layout}
                              onChange={(e) => updateTestimonials({ layout: e.target.value as 'grid' | 'carousel' | 'masonry' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="grid">Grid</option>
                              <option value="carousel">Carousel</option>
                              <option value="masonry">Masonry</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Columns</label>
                            <select
                              value={theme.testimonials.columns}
                              onChange={(e) => updateTestimonials({ columns: Number(e.target.value) as 2 | 3 })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Card Style</label>
                            <select
                              value={theme.testimonials.cardStyle}
                              onChange={(e) => updateTestimonials({ cardStyle: e.target.value as 'minimal' | 'boxed' | 'quote' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="minimal">Minimal</option>
                              <option value="boxed">Boxed</option>
                              <option value="quote">Quote</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.testimonials.showRating}
                              onChange={(e) => updateTestimonials({ showRating: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Rating
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.testimonials.showAvatar}
                              onChange={(e) => updateTestimonials({ showAvatar: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Avatar
                          </label>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-slate-600">Testimonials</label>
                            <button
                              onClick={handleAddTestimonial}
                              className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
                            >
                              + Add
                            </button>
                          </div>
                          {theme.testimonials.testimonials.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => setEditingTestimonial(t.id)}
                              className={`p-2 border rounded-lg cursor-pointer ${
                                editingTestimonial === t.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t.name}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeTestimonial(t.id); showToast('Removed', 'info'); }}
                                  className="text-rose-500 text-xs"
                                >Remove</button>
                              </div>
                              <div className="text-xs text-slate-500 truncate">{t.content}</div>
                            </div>
                          ))}
                        </div>

                        {selectedTestimonial && (
                          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                            <div className="text-xs font-semibold text-slate-700">Edit Testimonial</div>
                            <input
                              type="text"
                              value={selectedTestimonial.name}
                              onChange={(e) => updateTestimonial(selectedTestimonial.id, { name: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              placeholder="Name"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={selectedTestimonial.role}
                                onChange={(e) => updateTestimonial(selectedTestimonial.id, { role: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Role"
                              />
                              <input
                                type="text"
                                value={selectedTestimonial.company}
                                onChange={(e) => updateTestimonial(selectedTestimonial.id, { company: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Company"
                              />
                            </div>
                            <textarea
                              value={selectedTestimonial.content}
                              onChange={(e) => updateTestimonial(selectedTestimonial.id, { content: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              placeholder="Content"
                              rows={2}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={selectedTestimonial.rating}
                                onChange={(e) => updateTestimonial(selectedTestimonial.id, { rating: Number(e.target.value) })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Rating"
                              />
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedTestimonial.enabled}
                                  onChange={(e) => updateTestimonial(selectedTestimonial.id, { enabled: e.target.checked })}
                                  className="w-4 h-4 text-violet-600 rounded"
                                />
                                Enabled
                              </label>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Testimonials saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Testimonials
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'categories' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Section Title</label>
                          <input
                            type="text"
                            value={theme.categories.title}
                            onChange={(e) => updateCategories({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Subtitle</label>
                          <input
                            type="text"
                            value={theme.categories.subtitle}
                            onChange={(e) => updateCategories({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Layout</label>
                            <select
                              value={theme.categories.layout}
                              onChange={(e) => updateCategories({ layout: e.target.value as 'grid' | 'carousel' | 'list' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="grid">Grid</option>
                              <option value="carousel">Carousel</option>
                              <option value="list">List</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Columns</label>
                            <select
                              value={theme.categories.columns}
                              onChange={(e) => updateCategories({ columns: Number(e.target.value) as 3 | 4 | 6 })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={6}>6</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Card Style</label>
                          <select
                            value={theme.categories.cardStyle}
                            onChange={(e) => updateCategories({ cardStyle: e.target.value as 'minimal' | 'card' | 'overlay' })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="minimal">Minimal</option>
                            <option value="card">Card</option>
                            <option value="overlay">Overlay</option>
                          </select>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.categories.showIcons}
                              onChange={(e) => updateCategories({ showIcons: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Icons
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.categories.showImages}
                              onChange={(e) => updateCategories({ showImages: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Images
                          </label>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-slate-600">Categories</label>
                            <button
                              onClick={handleAddCategory}
                              className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
                            >
                              + Add
                            </button>
                          </div>
                          {theme.categories.categories.map((cat) => (
                            <div
                              key={cat.id}
                              onClick={() => setEditingCategory(cat.id)}
                              className={`p-2 border rounded-lg cursor-pointer ${
                                editingCategory === cat.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{cat.icon} {cat.name}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeCategory(cat.id); showToast('Removed', 'info'); }}
                                  className="text-rose-500 text-xs"
                                >Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedCategory && (
                          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                            <div className="text-xs font-semibold text-slate-700">Edit Category</div>
                            <input
                              type="text"
                              value={selectedCategory.name}
                              onChange={(e) => updateCategory(selectedCategory.id, { name: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              placeholder="Category name"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={selectedCategory.icon}
                                onChange={(e) => updateCategory(selectedCategory.id, { icon: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Icon (emoji)"
                              />
                              <input
                                type="text"
                                value={selectedCategory.link}
                                onChange={(e) => updateCategory(selectedCategory.id, { link: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                                placeholder="Link"
                              />
                            </div>
                            <input
                              type="text"
                              value={selectedCategory.image}
                              onChange={(e) => updateCategory(selectedCategory.id, { image: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                              placeholder="Image URL"
                            />
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={selectedCategory.enabled}
                                onChange={(e) => updateCategory(selectedCategory.id, { enabled: e.target.checked })}
                                className="w-4 h-4 text-violet-600 rounded"
                              />
                              Enabled
                            </label>
                          </div>
                        )}
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Categories saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Categories
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'gallery' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Section Title</label>
                          <input
                            type="text"
                            value={theme.gallery.title}
                            onChange={(e) => updateGallery({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Layout</label>
                            <select
                              value={theme.gallery.layout}
                              onChange={(e) => updateGallery({ layout: e.target.value as 'grid' | 'masonry' | 'carousel' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="grid">Grid</option>
                              <option value="masonry">Masonry</option>
                              <option value="carousel">Carousel</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Columns</label>
                            <select
                              value={theme.gallery.columns}
                              onChange={(e) => updateGallery({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Gap</label>
                          <select
                            value={theme.gallery.gap}
                            onChange={(e) => updateGallery({ gap: e.target.value as 'small' | 'medium' | 'large' })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.gallery.showCaptions}
                              onChange={(e) => updateGallery({ showCaptions: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Show Captions
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.gallery.lightbox}
                              onChange={(e) => updateGallery({ lightbox: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Enable Lightbox
                          </label>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-slate-600">Images</label>
                            <button
                              onClick={handleAddGalleryImage}
                              className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
                            >
                              + Add Image
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {theme.gallery.images.map((img) => (
                              <div key={img.id} className="relative group">
                                <img src={img.url} alt={img.alt} className="w-full h-16 object-cover rounded-lg" />
                                <button
                                  onClick={() => { removeGalleryImage(img.id); showToast('Image removed', 'info'); }}
                                  className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >×</button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Gallery saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Gallery
                        </button>
                      </div>
                    )}

                    {selectedSection.type === 'videoBanner' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600">Title</label>
                          <input
                            type="text"
                            value={theme.videoBanner.title}
                            onChange={(e) => updateVideoBanner({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Subtitle</label>
                          <input
                            type="text"
                            value={theme.videoBanner.subtitle}
                            onChange={(e) => updateVideoBanner({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Video URL</label>
                          <input
                            type="text"
                            value={theme.videoBanner.videoUrl}
                            onChange={(e) => updateVideoBanner({ videoUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600">Video Type</label>
                            <select
                              value={theme.videoBanner.videoType}
                              onChange={(e) => updateVideoBanner({ videoType: e.target.value as 'youtube' | 'vimeo' | 'custom' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="youtube">YouTube</option>
                              <option value="vimeo">Vimeo</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Height</label>
                            <select
                              value={theme.videoBanner.height}
                              onChange={(e) => updateVideoBanner({ height: e.target.value as 'small' | 'medium' | 'large' | 'fullscreen' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                              <option value="fullscreen">Fullscreen</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.videoBanner.autoplay}
                              onChange={(e) => updateVideoBanner({ autoplay: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Autoplay
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.videoBanner.muted}
                              onChange={(e) => updateVideoBanner({ muted: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Muted
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={theme.videoBanner.loop}
                              onChange={(e) => updateVideoBanner({ loop: e.target.checked })}
                              className="w-4 h-4 text-violet-600 rounded"
                            />
                            Loop
                          </label>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Overlay Opacity ({theme.videoBanner.overlayOpacity}%)</label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={theme.videoBanner.overlayOpacity}
                            onChange={(e) => updateVideoBanner({ overlayOpacity: Number(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={theme.videoBanner.buttonText}
                            onChange={(e) => updateVideoBanner({ buttonText: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Button text"
                          />
                          <input
                            type="text"
                            value={theme.videoBanner.buttonLink}
                            onChange={(e) => updateVideoBanner({ buttonLink: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Button link"
                          />
                        </div>
                        <button
                          onClick={() => { handleSaveTheme(); showToast('Video Banner saved!', 'success'); }}
                          className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        >
                          💾 Save Video Banner
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {showAddSection && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-96 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Add Section</h3>
                        <button onClick={() => setShowAddSection(false)} className="text-slate-400 hover:text-slate-600">×</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {sectionTemplates.map(template => (
                          <button
                            key={template.type}
                            onClick={() => handleAddSection(template.type)}
                            className="p-4 bg-slate-50 rounded-xl hover:bg-violet-50 hover:border-violet-300 border border-slate-200 text-left transition-all"
                          >
                            <div className="text-2xl mb-2">{template.icon}</div>
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-slate-500">{template.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Theme View */}
            {activeView === 'theme' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-700">Color Scheme</h4>
                  <button onClick={resetTheme} className="text-xs text-slate-500 hover:text-slate-700">Reset</button>
                </div>
                
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs text-slate-600 capitalize">{key}</label>
                    <div className="flex gap-1 flex-wrap">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          onClick={() => updateThemeColor(key as keyof ThemeConfig['colors'], color)}
                          className={`w-7 h-7 rounded-lg transition-all ${
                            value === color ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-105'
                          }`}
                        >
                          <div className={`w-full h-full rounded-lg bg-${color}-500`}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <hr className="border-slate-200" />

                <div className="space-y-3">
                  <label className="text-xs text-slate-600">Font Family</label>
                  <div className="flex gap-2 flex-wrap">
                    {fontOptions.map(font => (
                      <button
                        key={font.value}
                        onClick={() => updateThemeSetting('fontFamily', font.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          theme.fontFamily === font.value
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ fontFamily: font.label }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-600">Border Radius</label>
                  <div className="flex gap-2 flex-wrap">
                    {borderRadiusOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateThemeSetting('borderRadius', opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          theme.borderRadius === opt.value
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-600">Button Style</label>
                  <div className="flex gap-2 flex-wrap">
                    {['rounded', 'square', 'pill'].map(style => (
                      <button
                        key={style}
                        onClick={() => updateThemeSetting('buttonStyle', style as 'rounded' | 'square' | 'pill')}
                        className={`px-3 py-1.5 text-sm border transition-all capitalize ${
                          theme.buttonStyle === style
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-slate-200 hover:border-slate-300'
                        } ${
                          style === 'square' ? 'rounded-none' : style === 'pill' ? 'rounded-full' : 'rounded-lg'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-600">Spacing</label>
                  <div className="flex gap-2 flex-wrap">
                    {spacingOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateThemeSetting('spacing', opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          theme.spacing === opt.value
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { handleSaveTheme(); showToast('Theme settings saved!', 'success'); }}
                  className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  💾 Save Theme Settings
                </button>
              </div>
            )}

            {/* Header Settings */}
            {activeView === 'header' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600">Logo Text</label>
                    <input
                      type="text"
                      value={theme.globalComponents?.header?.logoText || 'ShopElite'}
                      onChange={(e) => updateHeader({ logoText: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Menu Style</label>
                    <select
                      value={theme.globalComponents?.header?.menuStyle || 'horizontal'}
                      onChange={(e) => updateHeader({ menuStyle: e.target.value as 'horizontal' | 'dropdown' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="horizontal">Horizontal</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={theme.globalComponents?.header?.showSearch ?? true}
                        onChange={(e) => updateHeader({ showSearch: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded"
                      />
                      Show Search
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={theme.globalComponents?.header?.showCart ?? true}
                        onChange={(e) => updateHeader({ showCart: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded"
                      />
                      Show Cart
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={theme.globalComponents?.header?.sticky ?? true}
                        onChange={(e) => updateHeader({ sticky: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded"
                      />
                      Sticky Header
                    </label>
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700">Announcement Bar</h4>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={theme.globalComponents?.announcementBar?.enabled ?? false}
                      onChange={(e) => updateAnnouncementBar({ enabled: e.target.checked })}
                      className="w-4 h-4 text-violet-600 rounded"
                    />
                    Enable Announcement Bar
                  </label>
                  {theme.globalComponents?.announcementBar?.enabled && (
                    <>
                      <div>
                        <label className="text-xs text-slate-600">Text</label>
                        <input
                          type="text"
                          value={theme.globalComponents?.announcementBar?.text || ''}
                          onChange={(e) => updateAnnouncementBar({ text: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={theme.globalComponents?.announcementBar?.dismissible ?? true}
                          onChange={(e) => updateAnnouncementBar({ dismissible: e.target.checked })}
                          className="w-4 h-4 text-violet-600 rounded"
                        />
                        Dismissible
                      </label>
                    </>
                  )}
                </div>
                <button
                  onClick={() => { handleSaveTheme(); showToast('Header settings saved!', 'success'); }}
                  className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  💾 Save Header Settings
                </button>
              </div>
            )}

            {/* Footer Settings */}
            {activeView === 'footer' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-600">Company Name</label>
                  <input
                    type="text"
                    value={theme.globalComponents?.footer?.companyName || 'ShopElite'}
                    onChange={(e) => updateFooter({ companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Footer Columns</label>
                  <select
                    value={theme.globalComponents?.footer?.columns || 4}
                    onChange={(e) => updateFooter({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={theme.globalComponents?.footer?.showSocial ?? true}
                      onChange={(e) => updateFooter({ showSocial: e.target.checked })}
                      className="w-4 h-4 text-violet-600 rounded"
                    />
                    Show Social Links
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={theme.globalComponents?.footer?.showNewsletter ?? true}
                      onChange={(e) => updateFooter({ showNewsletter: e.target.checked })}
                      className="w-4 h-4 text-violet-600 rounded"
                    />
                    Show Newsletter
                  </label>
                </div>
                <button
                  onClick={() => { handleSaveTheme(); showToast('Footer settings saved!', 'success'); }}
                  className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  💾 Save Footer Settings
                </button>
              </div>
            )}

            {/* Products View */}
            {activeView === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-700">Product Management</h4>
                  <button className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm">+ Add Product</button>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
                  <p>Products are fetched from the Fake Store API. This section shows product display settings.</p>
                </div>
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-600">Display Settings</h5>
                  <div>
                    <label className="text-xs text-slate-600">Default Grid Columns</label>
                    <select
                      value={theme.featureProducts.columns}
                      onChange={(e) => updateFeatureProducts({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={theme.featureProducts.showRating}
                        onChange={(e) => updateFeatureProducts({ showRating: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded"
                      />
                      Show Rating
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={theme.featureProducts.showPrice}
                        onChange={(e) => updateFeatureProducts({ showPrice: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded"
                      />
                      Show Price
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Settings View */}
            {activeView === 'settings' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <h4 className="font-medium text-slate-700">Theme Name</h4>
                  <input
                    type="text"
                    value={theme.name}
                    onChange={(e) => updateThemeSetting('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <h4 className="font-medium text-slate-700">Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={handleExport}
                      className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                    >
                      Export Theme JSON
                    </button>
                    <button
                      onClick={resetTheme}
                      className="w-full px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="flex-1 bg-slate-200 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-full">
            <div className="p-3 bg-slate-100 border-b flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-500 text-center">shopelite.com</div>
              </div>
            </div>
            
            <div className="p-0">
              {/* Header Preview */}
              <div className={`bg-white border-b px-4 py-3 flex items-center justify-between ${theme.globalComponents?.header?.sticky ? 'sticky top-0' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 bg-gradient-to-br from-${theme.colors.primary}-600 to-${theme.colors.secondary}-600 rounded-lg`}></div>
                  <span className="font-bold text-slate-800">{theme.globalComponents?.header?.logoText || 'ShopElite'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>Home</span>
                  <span>Shop</span>
                  <span>About</span>
                  {theme.globalComponents?.header?.showCart && <span>🛒</span>}
                </div>
              </div>

              {theme.globalComponents?.announcementBar?.enabled && (
                <div className={`bg-${theme.colors.primary}-600 text-white text-center py-2 text-sm`}>
                  {theme.globalComponents?.announcementBar?.text || 'Announcement text here'}
                </div>
              )}

              {selectedPage?.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order).map(section => (
                <div key={section.id} className="border-b border-slate-100">
                  {section.type === 'banner' && (
                    <div className={`bg-gradient-to-r from-${theme.banner.gradientFrom}-600 to-${theme.banner.gradientTo}-600 text-white ${
                      theme.banner.height === 'small' ? 'py-8' : theme.banner.height === 'large' ? 'py-20' : 'py-14'
                    } px-6`}>
                      <h1 className="text-2xl font-bold mb-2">{theme.banner.title}</h1>
                      <p className="text-white/80 text-sm mb-4 max-w-md">{theme.banner.subtitle}</p>
                      <button className={`px-4 py-2 bg-white text-${theme.colors.primary}-600 font-medium text-sm ${
                        theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-lg'
                      }`}>
                        {theme.banner.buttonText}
                      </button>
                    </div>
                  )}
                  {section.type === 'featuredProducts' && (
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-slate-800 mb-4">{theme.featureProducts.title}</h2>
                      <div className={`grid gap-4 ${
                        theme.featureProducts.columns === 2 ? 'grid-cols-2' :
                        theme.featureProducts.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'
                      }`}>
                        {[1, 2, 3, 4].slice(0, theme.featureProducts.productCount).map(i => (
                          <div key={i} className="bg-slate-100 rounded-lg p-3">
                            <div className="bg-slate-200 h-20 rounded mb-2"></div>
                            <div className="h-3 bg-slate-300 rounded w-3/4"></div>
                            {theme.featureProducts.showPrice && <div className="h-3 bg-slate-300 rounded w-1/4 mt-2"></div>}
                            {theme.featureProducts.showRating && (
                              <div className="flex gap-0.5 mt-2">
                                {[1,2,3,4,5].map(s => <div key={s} className="w-2 h-2 bg-amber-400 rounded-full"></div>)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.type === 'categories' && (
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-slate-800 mb-4">Categories</h2>
                      <div className="grid grid-cols-4 gap-3">
                        {['Electronics', 'Jewelery', "Men's", "Women's"].map(cat => (
                          <div key={cat} className={`bg-${theme.colors.accent}-100 text-${theme.colors.accent}-700 rounded-lg p-3 text-center text-xs font-medium`}>{cat}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.type === 'promoCards' && (
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-slate-800 mb-1">{theme.promoCards.title}</h2>
                      <p className="text-sm text-slate-500 mb-4">{theme.promoCards.subtitle}</p>
                      <div className={`grid gap-3 ${
                        theme.promoCards.layout === 'list'
                          ? 'grid-cols-1'
                          : theme.promoCards.columns === 2
                            ? 'grid-cols-2'
                            : theme.promoCards.columns === 3
                              ? 'grid-cols-3'
                              : 'grid-cols-4'
                      }`}>
                        {theme.promoCards.cards.filter((card) => card.enabled).map((card) => (
                          <div
                            key={card.id}
                            className={`p-3 rounded-lg ${
                              theme.promoCards.cardStyle === 'outlined'
                                ? `border border-${card.backgroundColor}-300`
                                : theme.promoCards.cardStyle === 'gradient'
                                  ? `bg-gradient-to-br from-${card.backgroundColor}-100 to-${card.backgroundColor}-200`
                                  : `bg-${card.backgroundColor}-100`
                            }`}
                          >
                            {theme.promoCards.showIcons && <div className="text-xl mb-2">{card.icon}</div>}
                            <h3 className="text-sm font-semibold text-slate-800">{card.title}</h3>
                            <p className="text-xs text-slate-600 mb-2">{card.description}</p>
                            <button className={`px-3 py-1.5 text-xs bg-${theme.colors.primary}-600 text-white ${
                              theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-md'
                            }`}>
                              {card.buttonText}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.type === 'newsletter' && (
                    <div className={`${
                      theme.newsletter.backgroundType === 'gradient'
                        ? `bg-gradient-to-r from-${theme.newsletter.gradientFrom}-50 to-${theme.newsletter.gradientTo}-100`
                        : `bg-${theme.newsletter.backgroundColor}-50`
                    } p-6`}>
                      <div className={`grid gap-4 ${theme.newsletter.layout === 'split' ? 'grid-cols-2 items-center' : 'grid-cols-1 text-center'}`}>
                        <div>
                          <h3 className="font-bold text-slate-800 mb-2">{theme.newsletter.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{theme.newsletter.subtitle}</p>
                          <div className={`flex gap-2 ${theme.newsletter.layout === 'centered' || theme.newsletter.layout === 'minimal' ? 'justify-center' : ''}`}>
                            <input
                              type="email"
                              placeholder={theme.newsletter.placeholder}
                              className="px-3 py-2 border rounded-lg text-sm w-48"
                              disabled
                            />
                            <button className={`px-4 py-2 bg-${theme.colors.primary}-600 text-white text-sm ${
                              theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-lg'
                            }`}>
                              {theme.newsletter.buttonText}
                            </button>
                          </div>
                        </div>
                        {theme.newsletter.showImage && (
                          <div className="bg-white/80 rounded-lg h-32 flex items-center justify-center text-xs text-slate-500">
                            {theme.newsletter.imageUrl ? 'Newsletter Image' : 'Add image URL in editor'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {section.type === 'testimonials' && (
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-slate-800 mb-1">{theme.testimonials.title}</h2>
                      <p className="text-sm text-slate-500 mb-4">{theme.testimonials.subtitle}</p>
                      <div className={`grid gap-3 ${
                        theme.testimonials.columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
                      }`}>
                        {theme.testimonials.testimonials.filter((t) => t.enabled).slice(0, 3).map((testimonial) => (
                          <div
                            key={testimonial.id}
                            className={`p-3 ${
                              theme.testimonials.cardStyle === 'boxed'
                                ? 'bg-slate-50 rounded-lg border border-slate-100'
                                : theme.testimonials.cardStyle === 'quote'
                                  ? `bg-${theme.colors.primary}-50 rounded-lg border-l-4 border-${theme.colors.primary}-500`
                                  : 'bg-transparent'
                            }`}
                          >
                            <p className="text-slate-600 text-xs mb-2 line-clamp-2">{testimonial.content}</p>
                            <div className="flex items-center gap-2">
                              {theme.testimonials.showAvatar && (
                                <div className={`w-6 h-6 rounded-full bg-${theme.colors.primary}-200 flex items-center justify-center text-${theme.colors.primary}-700 text-xs font-bold`}>
                                  {testimonial.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-slate-800 text-xs">{testimonial.name}</div>
                                {theme.testimonials.showRating && (
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span key={star} className={`text-[8px] ${star <= testimonial.rating ? 'text-amber-400' : 'text-slate-300'}`}>★</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.type === 'gallery' && (
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-slate-800 mb-4">{theme.gallery.title}</h2>
                      <div className={`grid ${
                        theme.gallery.columns === 2 ? 'grid-cols-2' :
                        theme.gallery.columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
                      } ${
                        theme.gallery.gap === 'small' ? 'gap-1' :
                        theme.gallery.gap === 'large' ? 'gap-4' : 'gap-2'
                      }`}>
                        {theme.gallery.images.slice(0, 4).map((image) => (
                          <div key={image.id} className="relative group overflow-hidden rounded-lg">
                            <img src={image.url} alt={image.alt} className="w-full h-16 object-cover" />
                            {theme.gallery.showCaptions && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                                <div className="text-white text-[8px]">{image.caption}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.type === 'videoBanner' && (
                    <div className={`relative overflow-hidden ${
                      theme.videoBanner.height === 'small' ? 'h-24' :
                      theme.videoBanner.height === 'large' ? 'h-48' : 'h-32'
                    }`}>
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <div className="text-center text-white z-10 px-4">
                          <h2 className="text-base font-bold mb-1">{theme.videoBanner.title}</h2>
                          <p className="text-white/80 text-xs mb-2">{theme.videoBanner.subtitle}</p>
                          {theme.videoBanner.buttonText && (
                            <button className={`px-3 py-1.5 bg-white text-slate-900 font-medium text-xs ${
                              theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-lg'
                            }`}>
                              ▶ {theme.videoBanner.buttonText}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black" style={{ opacity: theme.videoBanner.overlayOpacity / 100 }}></div>
                    </div>
                  )}
                </div>
              ))}

              <div className={`bg-slate-900 text-white p-6`}>
                <div className={`grid gap-4 mb-4 ${
                  theme.globalComponents?.footer?.columns === 2 ? 'grid-cols-2' :
                  theme.globalComponents?.footer?.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'
                }`}>
                  <div>
                    <h4 className="font-bold mb-2">{theme.globalComponents?.footer?.companyName || 'ShopElite'}</h4>
                    <p className="text-xs text-slate-400">Your trusted shopping destination.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-sm">Links</h4>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>Home</div>
                      <div>Shop</div>
                      <div>About</div>
                    </div>
                  </div>
                  {theme.globalComponents?.footer?.showSocial && (
                    <div>
                      <h4 className="font-bold mb-2 text-sm">Follow Us</h4>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-xs">📘</div>
                        <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-xs">🐦</div>
                        <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-xs">📸</div>
                      </div>
                    </div>
                  )}
                  {theme.globalComponents?.footer?.showNewsletter && (
                    <div>
                      <h4 className="font-bold mb-2 text-sm">Newsletter</h4>
                      <p className="text-xs text-slate-400 mb-2">Subscribe for updates</p>
                      <div className="flex gap-1">
                        <input type="email" placeholder="email" className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-white" disabled />
                        <button className={`px-2 py-1 bg-${theme.colors.primary}-600 text-white text-[10px] ${
                          theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded'
                        }`}>→</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
                  © {new Date().getFullYear()} {theme.globalComponents?.footer?.companyName || 'ShopElite'}. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
