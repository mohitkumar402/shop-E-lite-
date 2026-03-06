import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  ThemeConfig, 
  defaultTheme, 
  BannerConfig, 
  FeatureProductsConfig, 
  CustomCardConfig,
  PageSection,
  HeaderConfig,
  FooterConfig,
  AnnouncementBarConfig,
  PromoCardsConfig,
  NewsletterConfig,
  TestimonialsConfig,
  CategoriesConfig,
  GalleryConfig,
  VideoBannerConfig,
  PromoCardItem,
  TestimonialItem,
  CategoryItem,
  GalleryImage
} from '../types/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  updateThemeColor: (key: keyof ThemeConfig['colors'], value: string) => void;
  updateThemeSetting: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
  updateBanner: (updates: Partial<BannerConfig>) => void;
  updateFeatureProducts: (updates: Partial<FeatureProductsConfig>) => void;
  updateCustomCard: (updates: Partial<CustomCardConfig>) => void;
  // New section config methods
  updatePromoCards: (updates: Partial<PromoCardsConfig>) => void;
  addPromoCard: (card: PromoCardItem) => void;
  updatePromoCard: (id: string, updates: Partial<PromoCardItem>) => void;
  removePromoCard: (id: string) => void;
  updateNewsletter: (updates: Partial<NewsletterConfig>) => void;
  updateTestimonials: (updates: Partial<TestimonialsConfig>) => void;
  addTestimonial: (testimonial: TestimonialItem) => void;
  updateTestimonial: (id: string, updates: Partial<TestimonialItem>) => void;
  removeTestimonial: (id: string) => void;
  updateCategories: (updates: Partial<CategoriesConfig>) => void;
  addCategory: (category: CategoryItem) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  removeCategory: (id: string) => void;
  updateGallery: (updates: Partial<GalleryConfig>) => void;
  addGalleryImage: (image: GalleryImage) => void;
  removeGalleryImage: (id: string) => void;
  updateVideoBanner: (updates: Partial<VideoBannerConfig>) => void;
  // Page Builder methods
  updatePageSection: (pageId: string, sectionId: string, updates: Partial<PageSection>) => void;
  reorderSections: (pageId: string, sections: PageSection[]) => void;
  addSection: (pageId: string, section: PageSection) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  // Global Components methods
  updateHeader: (updates: Partial<HeaderConfig>) => void;
  updateFooter: (updates: Partial<FooterConfig>) => void;
  updateAnnouncementBar: (updates: Partial<AnnouncementBarConfig>) => void;
  resetTheme: () => void;
  getColorClasses: () => {
    primaryGradient: string;
    primaryBg: string;
    primaryText: string;
    primaryBorder: string;
    primaryHover: string;
    primaryRing: string;
    secondaryGradient: string;
    accentBg: string;
    accentText: string;
    dangerBg: string;
    dangerText: string;
    successBg: string;
    successText: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'shopelite_theme';

// Migrate old theme to include new properties
const migrateTheme = (saved: Partial<ThemeConfig>): ThemeConfig => {
  return {
    ...defaultTheme,
    ...saved,
    // Ensure new properties exist with defaults if missing
    buttonStyle: saved.buttonStyle || defaultTheme.buttonStyle,
    pages: saved.pages || defaultTheme.pages,
    globalComponents: saved.globalComponents || defaultTheme.globalComponents,
    banner: { ...defaultTheme.banner, ...saved.banner },
    featureProducts: { ...defaultTheme.featureProducts, ...saved.featureProducts },
    // New section configs
    promoCards: { ...defaultTheme.promoCards, ...saved.promoCards },
    newsletter: { ...defaultTheme.newsletter, ...saved.newsletter },
    testimonials: { ...defaultTheme.testimonials, ...saved.testimonials },
    categories: { ...defaultTheme.categories, ...saved.categories },
    gallery: { ...defaultTheme.gallery, ...saved.gallery },
    videoBanner: { ...defaultTheme.videoBanner, ...saved.videoBanner },
  };
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      try {
        return migrateTheme(JSON.parse(saved));
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    
    // Apply font family
    const fontFamilies: Record<string, string> = {
      inter: "'Inter', sans-serif",
      poppins: "'Poppins', sans-serif",
      roboto: "'Roboto', sans-serif",
      nunito: "'Nunito', sans-serif"
    };
    document.documentElement.style.fontFamily = fontFamilies[theme.fontFamily] || fontFamilies.inter;
  }, [theme]);

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
  };

  const updateThemeColor = (key: keyof ThemeConfig['colors'], value: string) => {
    setThemeState(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const updateThemeSetting = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    setThemeState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateBanner = (updates: Partial<BannerConfig>) => {
    setThemeState(prev => ({
      ...prev,
      banner: {
        ...prev.banner,
        ...updates
      }
    }));
  };

  const updateFeatureProducts = (updates: Partial<FeatureProductsConfig>) => {
    setThemeState(prev => ({
      ...prev,
      featureProducts: {
        ...prev.featureProducts,
        ...updates
      }
    }));
  };

  const updateCustomCard = (updates: Partial<CustomCardConfig>) => {
    setThemeState(prev => ({
      ...prev,
      customCard: {
        ...prev.customCard,
        ...updates
      }
    }));
  };

  // Promo Cards methods
  const updatePromoCards = (updates: Partial<PromoCardsConfig>) => {
    setThemeState(prev => ({
      ...prev,
      promoCards: { ...prev.promoCards, ...updates }
    }));
  };

  const addPromoCard = (card: PromoCardItem) => {
    setThemeState(prev => ({
      ...prev,
      promoCards: { ...prev.promoCards, cards: [...prev.promoCards.cards, card] }
    }));
  };

  const updatePromoCard = (id: string, updates: Partial<PromoCardItem>) => {
    setThemeState(prev => ({
      ...prev,
      promoCards: {
        ...prev.promoCards,
        cards: prev.promoCards.cards.map(c => c.id === id ? { ...c, ...updates } : c)
      }
    }));
  };

  const removePromoCard = (id: string) => {
    setThemeState(prev => ({
      ...prev,
      promoCards: { ...prev.promoCards, cards: prev.promoCards.cards.filter(c => c.id !== id) }
    }));
  };

  // Newsletter methods
  const updateNewsletter = (updates: Partial<NewsletterConfig>) => {
    setThemeState(prev => ({
      ...prev,
      newsletter: { ...prev.newsletter, ...updates }
    }));
  };

  // Testimonials methods
  const updateTestimonials = (updates: Partial<TestimonialsConfig>) => {
    setThemeState(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, ...updates }
    }));
  };

  const addTestimonial = (testimonial: TestimonialItem) => {
    setThemeState(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, testimonials: [...prev.testimonials.testimonials, testimonial] }
    }));
  };

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    setThemeState(prev => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        testimonials: prev.testimonials.testimonials.map(t => t.id === id ? { ...t, ...updates } : t)
      }
    }));
  };

  const removeTestimonial = (id: string) => {
    setThemeState(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, testimonials: prev.testimonials.testimonials.filter(t => t.id !== id) }
    }));
  };

  // Categories methods
  const updateCategories = (updates: Partial<CategoriesConfig>) => {
    setThemeState(prev => ({
      ...prev,
      categories: { ...prev.categories, ...updates }
    }));
  };

  const addCategory = (category: CategoryItem) => {
    setThemeState(prev => ({
      ...prev,
      categories: { ...prev.categories, categories: [...prev.categories.categories, category] }
    }));
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setThemeState(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        categories: prev.categories.categories.map(c => c.id === id ? { ...c, ...updates } : c)
      }
    }));
  };

  const removeCategory = (id: string) => {
    setThemeState(prev => ({
      ...prev,
      categories: { ...prev.categories, categories: prev.categories.categories.filter(c => c.id !== id) }
    }));
  };

  // Gallery methods
  const updateGallery = (updates: Partial<GalleryConfig>) => {
    setThemeState(prev => ({
      ...prev,
      gallery: { ...prev.gallery, ...updates }
    }));
  };

  const addGalleryImage = (image: GalleryImage) => {
    setThemeState(prev => ({
      ...prev,
      gallery: { ...prev.gallery, images: [...prev.gallery.images, image] }
    }));
  };

  const removeGalleryImage = (id: string) => {
    setThemeState(prev => ({
      ...prev,
      gallery: { ...prev.gallery, images: prev.gallery.images.filter(i => i.id !== id) }
    }));
  };

  // Video Banner methods
  const updateVideoBanner = (updates: Partial<VideoBannerConfig>) => {
    setThemeState(prev => ({
      ...prev,
      videoBanner: { ...prev.videoBanner, ...updates }
    }));
  };

  // Page Builder methods
  const updatePageSection = (pageId: string, sectionId: string, updates: Partial<PageSection>) => {
    setThemeState(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === pageId 
          ? {
              ...page,
              sections: page.sections.map(section =>
                section.id === sectionId ? { ...section, ...updates } : section
              )
            }
          : page
      )
    }));
  };

  const reorderSections = (pageId: string, sections: PageSection[]) => {
    setThemeState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId ? { ...page, sections } : page
      )
    }));
  };

  const addSection = (pageId: string, section: PageSection) => {
    setThemeState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId 
          ? { ...page, sections: [...page.sections, section] }
          : page
      )
    }));
  };

  const removeSection = (pageId: string, sectionId: string) => {
    setThemeState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, sections: page.sections.filter(s => s.id !== sectionId) }
          : page
      )
    }));
  };

  // Global Components methods
  const updateHeader = (updates: Partial<HeaderConfig>) => {
    setThemeState(prev => ({
      ...prev,
      globalComponents: {
        ...prev.globalComponents,
        header: { ...prev.globalComponents.header, ...updates }
      }
    }));
  };

  const updateFooter = (updates: Partial<FooterConfig>) => {
    setThemeState(prev => ({
      ...prev,
      globalComponents: {
        ...prev.globalComponents,
        footer: { ...prev.globalComponents.footer, ...updates }
      }
    }));
  };

  const updateAnnouncementBar = (updates: Partial<AnnouncementBarConfig>) => {
    setThemeState(prev => ({
      ...prev,
      globalComponents: {
        ...prev.globalComponents,
        announcementBar: { ...prev.globalComponents.announcementBar, ...updates }
      }
    }));
  };

  const resetTheme = () => {
    setThemeState(defaultTheme);
  };

  const getColorClasses = () => {
    const { primary, secondary, accent, danger, success } = theme.colors;
    
    return {
      primaryGradient: `bg-gradient-to-r from-${primary}-600 to-${secondary}-600`,
      primaryBg: `bg-${primary}-600`,
      primaryText: `text-${primary}-600`,
      primaryBorder: `border-${primary}-500`,
      primaryHover: `hover:bg-${primary}-700`,
      primaryRing: `focus:ring-${primary}-500`,
      secondaryGradient: `bg-gradient-to-r from-${secondary}-500 to-${secondary}-600`,
      accentBg: `bg-${accent}-500`,
      accentText: `text-${accent}-600`,
      dangerBg: `bg-${danger}-500`,
      dangerText: `text-${danger}-600`,
      successBg: `bg-${success}-500`,
      successText: `text-${success}-600`
    };
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      updateThemeColor,
      updateThemeSetting,
      updateBanner,
      updateFeatureProducts,
      updateCustomCard,
      // New section methods
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
      // Page builder methods
      updatePageSection,
      reorderSections,
      addSection,
      removeSection,
      updateHeader,
      updateFooter,
      updateAnnouncementBar,
      resetTheme,
      getColorClasses
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
