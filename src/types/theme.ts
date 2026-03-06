export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
}

// Banner customization config
export interface BannerConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  showBanner: boolean;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  textColor: string;
  overlayOpacity: number;
  height: 'small' | 'medium' | 'large';
}

// Feature Products customization
export interface FeatureProductsConfig {
  title: string;
  showRating: boolean;
  showPrice: boolean;
  columns: 2 | 3 | 4;
  cardStyle: 'minimal' | 'detailed' | 'compact';
  productCount: number;
}

// Custom Card config
export interface CustomCardConfig {
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadow: 'none' | 'small' | 'medium' | 'large';
  padding: 'compact' | 'normal' | 'spacious';
}

// Promo Cards customization
export interface PromoCardItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  icon: string;
  enabled: boolean;
}

export interface PromoCardsConfig {
  title: string;
  subtitle: string;
  layout: 'grid' | 'carousel' | 'list';
  columns: 2 | 3 | 4;
  cardStyle: 'filled' | 'outlined' | 'gradient';
  showIcons: boolean;
  cards: PromoCardItem[];
}

// Newsletter customization
export interface NewsletterConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  placeholder: string;
  backgroundColor: string;
  backgroundType: 'color' | 'gradient';
  gradientFrom: string;
  gradientTo: string;
  showImage: boolean;
  imageUrl: string;
  layout: 'centered' | 'split' | 'minimal';
  successMessage: string;
}

// Testimonials customization  
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  enabled: boolean;
}

export interface TestimonialsConfig {
  title: string;
  subtitle: string;
  layout: 'grid' | 'carousel' | 'masonry';
  columns: 2 | 3;
  showRating: boolean;
  showAvatar: boolean;
  cardStyle: 'minimal' | 'boxed' | 'quote';
  testimonials: TestimonialItem[];
}

// Categories customization
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  image: string;
  link: string;
  enabled: boolean;
}

export interface CategoriesConfig {
  title: string;
  subtitle: string;
  layout: 'grid' | 'carousel' | 'list';
  columns: 3 | 4 | 6;
  showIcons: boolean;
  showImages: boolean;
  cardStyle: 'minimal' | 'card' | 'overlay';
  categories: CategoryItem[];
}

// Gallery customization
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

export interface GalleryConfig {
  title: string;
  layout: 'grid' | 'masonry' | 'carousel';
  columns: 2 | 3 | 4;
  gap: 'small' | 'medium' | 'large';
  showCaptions: boolean;
  lightbox: boolean;
  images: GalleryImage[];
}

// Video Banner customization
export interface VideoBannerConfig {
  title: string;
  subtitle: string;
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'custom';
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  overlayColor: string;
  overlayOpacity: number;
  height: 'small' | 'medium' | 'large' | 'fullscreen';
  buttonText: string;
  buttonLink: string;
}

// Section types for page builder
export type SectionType = 
  | 'banner' 
  | 'featuredProducts' 
  | 'categories' 
  | 'promoCards' 
  | 'testimonials' 
  | 'newsletter' 
  | 'gallery' 
  | 'videoBanner';

export interface PageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  settings: Record<string, unknown>;
}

export interface PageConfig {
  id: string;
  name: string;
  slug: string;
  sections: PageSection[];
}

// Global components (Header, Footer, etc.)
export interface HeaderConfig {
  logoText: string;
  showSearch: boolean;
  showCart: boolean;
  menuStyle: 'horizontal' | 'dropdown';
  sticky: boolean;
}

export interface FooterConfig {
  companyName: string;
  showSocial: boolean;
  showNewsletter: boolean;
  columns: 2 | 3 | 4;
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
}

export interface GlobalComponentsConfig {
  header: HeaderConfig;
  footer: FooterConfig;
  announcementBar: AnnouncementBarConfig;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass';
  fontFamily: 'inter' | 'poppins' | 'roboto' | 'nunito';
  spacing: 'compact' | 'comfortable' | 'spacious';
  buttonStyle: 'rounded' | 'square' | 'pill';
  // Customizable sections
  banner: BannerConfig;
  featureProducts: FeatureProductsConfig;
  customCard: CustomCardConfig;
  // New section configs
  promoCards: PromoCardsConfig;
  newsletter: NewsletterConfig;
  testimonials: TestimonialsConfig;
  categories: CategoriesConfig;
  gallery: GalleryConfig;
  videoBanner: VideoBannerConfig;
  // Page builder
  pages: PageConfig[];
  // Global components
  globalComponents: GlobalComponentsConfig;
}

// Color options for the customizer
export const colorOptions = [
  'violet', 'indigo', 'blue', 'cyan', 'teal', 'emerald', 'green', 'lime',
  'amber', 'orange', 'rose', 'pink', 'purple', 'fuchsia', 'red', 'slate'
];

// Font options for the customizer
export const fontOptions: { value: ThemeConfig['fontFamily']; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'nunito', label: 'Nunito' },
];

// Border radius options
export const borderRadiusOptions: { value: ThemeConfig['borderRadius']; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

// Spacing options
export const spacingOptions: { value: ThemeConfig['spacing']; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

export const defaultTheme: ThemeConfig = {
  name: 'Violet Dream',
  colors: {
    primary: 'violet',
    secondary: 'indigo',
    accent: 'emerald',
    danger: 'rose',
    success: 'emerald',
    warning: 'amber'
  },
  borderRadius: 'large',
  cardStyle: 'elevated',
  fontFamily: 'inter',
  spacing: 'comfortable',
  buttonStyle: 'rounded',
  banner: {
    title: 'Welcome back!',
    subtitle: 'Explore our latest collection of products and find amazing deals.',
    buttonText: 'Browse Products',
    buttonLink: '/products',
    showBanner: true,
    backgroundType: 'gradient',
    backgroundColor: '#6C5CE7',
    gradientFrom: 'violet',
    gradientTo: 'indigo',
    backgroundImage: '',
    textColor: '#FFFFFF',
    overlayOpacity: 0,
    height: 'medium'
  },
  featureProducts: {
    title: 'Featured Products',
    showRating: true,
    showPrice: true,
    columns: 4,
    cardStyle: 'detailed',
    productCount: 4
  },
  customCard: {
    borderRadius: 'large',
    shadow: 'medium',
    padding: 'normal'
  },
  promoCards: {
    title: 'Special Offers',
    subtitle: 'Check out our exclusive deals',
    layout: 'grid',
    columns: 3,
    cardStyle: 'filled',
    showIcons: true,
    cards: [
      { id: 'promo-1', title: 'Free Shipping', description: 'On orders over $50', buttonText: 'Shop Now', buttonLink: '/products', backgroundColor: 'violet', icon: '🚚', enabled: true },
      { id: 'promo-2', title: '24/7 Support', description: 'We\'re here to help', buttonText: 'Contact Us', buttonLink: '/contact', backgroundColor: 'emerald', icon: '💬', enabled: true },
      { id: 'promo-3', title: 'Money Back', description: '30-day guarantee', buttonText: 'Learn More', buttonLink: '/about', backgroundColor: 'amber', icon: '💰', enabled: true },
    ]
  },
  newsletter: {
    title: 'Stay Updated',
    subtitle: 'Subscribe to our newsletter for exclusive offers and updates',
    buttonText: 'Subscribe',
    placeholder: 'Enter your email',
    backgroundColor: 'slate',
    backgroundType: 'gradient',
    gradientFrom: 'violet',
    gradientTo: 'indigo',
    showImage: false,
    imageUrl: '',
    layout: 'centered',
    successMessage: 'Thanks for subscribing!'
  },
  testimonials: {
    title: 'What Our Customers Say',
    subtitle: 'Real reviews from real customers',
    layout: 'grid',
    columns: 3,
    showRating: true,
    showAvatar: true,
    cardStyle: 'boxed',
    testimonials: [
      { id: 'test-1', name: 'Sarah Johnson', role: 'Designer', company: 'CreativeCo', content: 'Amazing products and excellent customer service. Highly recommended!', avatar: '', rating: 5, enabled: true },
      { id: 'test-2', name: 'Mike Chen', role: 'Developer', company: 'TechStart', content: 'Fast shipping and quality items. Will definitely buy again!', avatar: '', rating: 5, enabled: true },
      { id: 'test-3', name: 'Emily Davis', role: 'Manager', company: 'RetailPro', content: 'Best online shopping experience I\'ve had. Love the variety!', avatar: '', rating: 4, enabled: true },
    ]
  },
  categories: {
    title: 'Shop by Category',
    subtitle: 'Browse our collections',
    layout: 'grid',
    columns: 4,
    showIcons: true,
    showImages: false,
    cardStyle: 'card',
    categories: [
      { id: 'cat-1', name: 'Electronics', icon: '📱', image: '', link: '/products?category=electronics', enabled: true },
      { id: 'cat-2', name: 'Jewelery', icon: '💎', image: '', link: '/products?category=jewelery', enabled: true },
      { id: 'cat-3', name: "Men's Clothing", icon: '👔', image: '', link: '/products?category=men\'s clothing', enabled: true },
      { id: 'cat-4', name: "Women's Clothing", icon: '👗', image: '', link: '/products?category=women\'s clothing', enabled: true },
    ]
  },
  gallery: {
    title: 'Gallery',
    layout: 'grid',
    columns: 3,
    gap: 'medium',
    showCaptions: true,
    lightbox: true,
    images: [
      { id: 'img-1', url: 'https://picsum.photos/400/300?random=1', alt: 'Gallery Image 1', caption: 'Featured Product' },
      { id: 'img-2', url: 'https://picsum.photos/400/300?random=2', alt: 'Gallery Image 2', caption: 'New Arrival' },
      { id: 'img-3', url: 'https://picsum.photos/400/300?random=3', alt: 'Gallery Image 3', caption: 'Best Seller' },
    ]
  },
  videoBanner: {
    title: 'Watch Our Story',
    subtitle: 'Discover what makes us different',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    autoplay: false,
    muted: true,
    loop: true,
    overlayColor: '#000000',
    overlayOpacity: 40,
    height: 'medium',
    buttonText: 'Learn More',
    buttonLink: '/about'
  },
  pages: [
    {
      id: 'home',
      name: 'Home Page',
      slug: '/',
      sections: [
        { id: 'banner-1', type: 'banner', enabled: true, order: 0, settings: {} },
        { id: 'featured-1', type: 'featuredProducts', enabled: true, order: 1, settings: {} },
        { id: 'categories-1', type: 'categories', enabled: true, order: 2, settings: {} },
        { id: 'promo-1', type: 'promoCards', enabled: true, order: 3, settings: {} },
        { id: 'testimonials-1', type: 'testimonials', enabled: true, order: 4, settings: {} },
        { id: 'newsletter-1', type: 'newsletter', enabled: true, order: 5, settings: {} },
      ]
    },
    {
      id: 'shop',
      name: 'Shop Page',
      slug: '/products',
      sections: [
        { id: 'products-grid', type: 'featuredProducts', enabled: true, order: 0, settings: {} },
      ]
    },
    {
      id: 'about',
      name: 'About Page',
      slug: '/about',
      sections: []
    },
    {
      id: 'contact',
      name: 'Contact Page',
      slug: '/contact',
      sections: []
    }
  ],
  globalComponents: {
    header: {
      logoText: 'ShopElite',
      showSearch: true,
      showCart: true,
      menuStyle: 'horizontal',
      sticky: true
    },
    footer: {
      companyName: 'ShopElite',
      showSocial: true,
      showNewsletter: true,
      columns: 4
    },
    announcementBar: {
      enabled: false,
      text: 'Free shipping on orders over $50!',
      backgroundColor: '#6C5CE7',
      textColor: '#FFFFFF',
      dismissible: true
    }
  }
};

export const presetThemes: { name: string; theme: ThemeConfig }[] = [
  {
    name: 'Violet Dream',
    theme: defaultTheme
  },
  {
    name: 'Ocean Blue',
    theme: {
      ...defaultTheme,
      name: 'Ocean Blue',
      colors: {
        primary: 'blue',
        secondary: 'cyan',
        accent: 'teal',
        danger: 'red',
        success: 'green',
        warning: 'yellow'
      }
    }
  },
  {
    name: 'Sunset Orange',
    theme: {
      ...defaultTheme,
      name: 'Sunset Orange',
      colors: {
        primary: 'orange',
        secondary: 'amber',
        accent: 'rose',
        danger: 'red',
        success: 'emerald',
        warning: 'yellow'
      },
      borderRadius: 'medium',
      cardStyle: 'bordered',
      fontFamily: 'poppins'
    }
  },
  {
    name: 'Forest Green',
    theme: {
      ...defaultTheme,
      name: 'Forest Green',
      colors: {
        primary: 'emerald',
        secondary: 'green',
        accent: 'lime',
        danger: 'rose',
        success: 'green',
        warning: 'amber'
      },
      cardStyle: 'glass',
      fontFamily: 'nunito',
      spacing: 'spacious'
    }
  },
  {
    name: 'Royal Purple',
    theme: {
      ...defaultTheme,
      name: 'Royal Purple',
      colors: {
        primary: 'purple',
        secondary: 'fuchsia',
        accent: 'pink',
        danger: 'red',
        success: 'emerald',
        warning: 'orange'
      },
      fontFamily: 'poppins'
    }
  },
  {
    name: 'Minimalist Gray',
    theme: {
      ...defaultTheme,
      name: 'Minimalist Gray',
      colors: {
        primary: 'slate',
        secondary: 'gray',
        accent: 'zinc',
        danger: 'red',
        success: 'green',
        warning: 'yellow'
      },
      borderRadius: 'small',
      cardStyle: 'flat',
      fontFamily: 'roboto',
      spacing: 'compact'
    }
  }
];
