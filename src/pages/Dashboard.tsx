import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const homePage = useMemo(() => theme.pages.find((p) => p.id === 'home'), [theme.pages]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = useMemo(
    () => products.slice(0, theme.featureProducts.productCount),
    [products, theme.featureProducts.productCount]
  );

  const orderedSections = useMemo(
    () => (homePage?.sections ?? []).filter((s) => s.enabled).sort((a, b) => a.order - b.order),
    [homePage]
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
      {theme.globalComponents?.announcementBar?.enabled && (
        <div className={`bg-${theme.colors.primary}-600 text-white text-center py-3 text-sm rounded-xl`}>
          {theme.globalComponents?.announcementBar?.text || 'Free delivery'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {orderedSections.map((section) => (
        <div key={section.id} className="border-b border-slate-100 p-6">
          {section.type === 'banner' && theme.banner.showBanner && (
            <div className={`relative overflow-hidden text-white rounded-3xl px-8 ${
              theme.banner.height === 'small' ? 'py-10' : theme.banner.height === 'large' ? 'py-16' : 'py-12'
            } ${
              theme.banner.backgroundType === 'gradient'
                ? `bg-gradient-to-r from-${theme.banner.gradientFrom}-600 to-${theme.banner.gradientTo}-600`
                : `bg-${theme.colors.primary}-600`
            }`}>
              <h1 className="text-3xl font-bold mb-2">
                {theme.banner.title.replace('!', '')}, {user?.name || 'User'}!
              </h1>
              <p className="text-white/90 mb-6 max-w-xl">{theme.banner.subtitle}</p>
              <Link
                to={theme.banner.buttonLink || '/products'}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white text-${theme.colors.primary}-600 font-semibold ${
                  theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-xl'
                }`}
              >
                <span>{theme.banner.buttonText}</span>
              </Link>
            </div>
          )}

          {section.type === 'featuredProducts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{theme.featureProducts.title}</h2>
                  <p className="text-slate-500 text-sm mt-1">Check out our top picks for you</p>
                </div>
                <Link to="/products" className={`text-${theme.colors.primary}-600 font-medium text-sm`}>View all</Link>
              </div>

              {isLoading ? (
                <div className={`grid gap-4 ${
                  theme.featureProducts.columns === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : theme.featureProducts.columns === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {[...Array(theme.featureProducts.productCount)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
                      <div className="aspect-square bg-slate-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  theme.featureProducts.columns === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : theme.featureProducts.columns === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {featuredProducts.map((product) => (
                    <Link key={product.id} to="/products" className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square bg-slate-50 rounded-xl p-4 mb-4 overflow-hidden">
                        <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="font-medium text-slate-800 line-clamp-1 mb-1">{product.title}</h3>
                      {theme.featureProducts.showPrice && <p className={`text-lg font-bold text-${theme.colors.primary}-600`}>${product.price.toFixed(2)}</p>}
                      {theme.featureProducts.showRating && (
                        <p className="text-xs text-slate-500 mt-1">Rating: {product.rating.rate.toFixed(1)} ({product.rating.count})</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {section.type === 'newsletter' && (
            <div className={`${
              theme.newsletter.backgroundType === 'gradient'
                ? `bg-gradient-to-r from-${theme.newsletter.gradientFrom}-50 to-${theme.newsletter.gradientTo}-100`
                : `bg-${theme.newsletter.backgroundColor}-50`
            } p-6 rounded-2xl`}>
              <div className={`grid gap-4 ${theme.newsletter.layout === 'split' ? 'grid-cols-1 md:grid-cols-2 items-center' : 'grid-cols-1 text-center'}`}>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">{theme.newsletter.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{theme.newsletter.subtitle}</p>
                  <div className={`flex gap-2 ${theme.newsletter.layout === 'centered' || theme.newsletter.layout === 'minimal' ? 'justify-center' : ''}`}>
                    <input type="email" placeholder={theme.newsletter.placeholder} className="px-3 py-2 border rounded-lg text-sm w-56" disabled />
                    <button className={`px-4 py-2 bg-${theme.colors.primary}-600 text-white text-sm ${
                      theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-lg'
                    }`}>
                      {theme.newsletter.buttonText}
                    </button>
                  </div>
                </div>
                {theme.newsletter.showImage && (
                  <div className="bg-white/80 rounded-lg h-32 flex items-center justify-center text-xs text-slate-500">
                    {theme.newsletter.imageUrl ? 'Newsletter Image' : 'Add image URL in Admin'}
                  </div>
                )}
              </div>
            </div>
          )}

          {section.type === 'categories' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{theme.categories.title}</h2>
              <p className="text-slate-500 text-sm mb-4">{theme.categories.subtitle}</p>
              <div className={`grid gap-3 ${
                theme.categories.columns === 3 ? 'grid-cols-2 md:grid-cols-3' :
                theme.categories.columns === 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 md:grid-cols-4'
              }`}>
                {theme.categories.categories.filter((c) => c.enabled).map((category) => (
                  <Link key={category.id} to={category.link || '/products'} className={`rounded-lg p-3 text-center text-sm bg-${theme.colors.accent}-50 hover:bg-${theme.colors.accent}-100 transition-colors`}>
                    {theme.categories.showIcons && <div className="text-xl mb-1">{category.icon}</div>}
                    <div className={`font-medium text-${theme.colors.accent}-700`}>{category.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {section.type === 'promoCards' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{theme.promoCards.title}</h2>
              <p className="text-slate-500 text-sm mb-4">{theme.promoCards.subtitle}</p>
              <div className={`grid gap-3 ${
                theme.promoCards.layout === 'list'
                  ? 'grid-cols-1'
                  : theme.promoCards.columns === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : theme.promoCards.columns === 3
                      ? 'grid-cols-1 md:grid-cols-3'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}>
                {theme.promoCards.cards.filter((card) => card.enabled).map((card) => (
                  <div
                    key={card.id}
                    className={`p-4 rounded-lg ${
                      theme.promoCards.cardStyle === 'outlined'
                        ? `border border-${card.backgroundColor}-300`
                        : theme.promoCards.cardStyle === 'gradient'
                          ? `bg-gradient-to-br from-${card.backgroundColor}-100 to-${card.backgroundColor}-200`
                          : `bg-${card.backgroundColor}-100`
                    }`}
                  >
                    {theme.promoCards.showIcons && <div className="text-xl mb-2">{card.icon}</div>}
                    <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{card.description}</p>
                    <Link to={card.buttonLink || '/products'} className={`inline-block px-3 py-2 text-xs bg-${theme.colors.primary}-600 text-white ${
                      theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-md'
                    }`}>
                      {card.buttonText}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.type === 'testimonials' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{theme.testimonials.title}</h2>
              <p className="text-slate-500 text-sm mb-4">{theme.testimonials.subtitle}</p>
              <div className={`grid gap-4 ${
                theme.testimonials.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {theme.testimonials.testimonials.filter((t) => t.enabled).map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`p-4 ${
                      theme.testimonials.cardStyle === 'boxed'
                        ? 'bg-slate-50 rounded-xl border border-slate-100'
                        : theme.testimonials.cardStyle === 'quote'
                          ? `bg-${theme.colors.primary}-50 rounded-xl border-l-4 border-${theme.colors.primary}-500`
                          : 'bg-transparent'
                    }`}
                  >
                    {theme.testimonials.cardStyle === 'quote' && (
                      <div className={`text-3xl text-${theme.colors.primary}-300 mb-2`}>"</div>
                    )}
                    <p className="text-slate-600 text-sm mb-3">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      {theme.testimonials.showAvatar && (
                        <div className={`w-10 h-10 rounded-full bg-${theme.colors.primary}-200 flex items-center justify-center text-${theme.colors.primary}-700 font-bold`}>
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-slate-500">{testimonial.role} at {testimonial.company}</div>
                        {theme.testimonials.showRating && (
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= testimonial.rating ? 'text-amber-400' : 'text-slate-300'}>★</span>
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
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">{theme.gallery.title}</h2>
              <div className={`grid ${
                theme.gallery.columns === 2 ? 'grid-cols-2' :
                theme.gallery.columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
              } ${
                theme.gallery.gap === 'small' ? 'gap-2' :
                theme.gallery.gap === 'large' ? 'gap-6' : 'gap-4'
              }`}>
                {theme.gallery.images.map((image) => (
                  <div key={image.id} className="relative group overflow-hidden rounded-lg">
                    <img src={image.url} alt={image.alt} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300" />
                    {theme.gallery.showCaptions && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="text-white text-sm font-medium">{image.caption}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.type === 'videoBanner' && (
            <div className={`relative overflow-hidden rounded-2xl ${
              theme.videoBanner.height === 'small' ? 'h-48' :
              theme.videoBanner.height === 'large' ? 'h-96' :
              theme.videoBanner.height === 'fullscreen' ? 'h-[70vh]' : 'h-64'
            }`}>
              <div className={`absolute inset-0 bg-black`} style={{ opacity: theme.videoBanner.overlayOpacity / 100 }}></div>
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="text-center text-white z-10 px-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{theme.videoBanner.title}</h2>
                  <p className="text-white/80 mb-4 max-w-lg mx-auto">{theme.videoBanner.subtitle}</p>
                  {theme.videoBanner.buttonText && (
                    <Link
                      to={theme.videoBanner.buttonLink || '/products'}
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold ${
                        theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-xl'
                      }`}
                    >
                      ▶ {theme.videoBanner.buttonText}
                    </Link>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 text-white/50 text-xs">
                  Video: {theme.videoBanner.videoType} ({theme.videoBanner.videoUrl ? 'configured' : 'not set'})
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {orderedSections.length === 0 && (
        <div className="p-10 text-center text-slate-500 text-sm">
          No sections enabled for Home page. Enable sections from Admin {'>'} Pages.
        </div>
      )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white rounded-xl overflow-hidden mt-8">
        <div className="p-6">
          <div className={`grid gap-6 mb-6 ${
            theme.globalComponents?.footer?.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
            theme.globalComponents?.footer?.columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            <div>
              <h4 className="font-bold text-lg mb-3">{theme.globalComponents?.footer?.companyName || 'ShopElite'}</h4>
              <p className="text-sm text-slate-400">Your trusted shopping destination for quality products and exceptional service.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">Quick Links</h4>
              <div className="text-sm text-slate-400 space-y-2">
                <Link to="/dashboard" className="block hover:text-white transition-colors">Home</Link>
                <Link to="/products" className="block hover:text-white transition-colors">Shop</Link>
                <Link to="/cart" className="block hover:text-white transition-colors">Cart</Link>
                <Link to="/profile" className="block hover:text-white transition-colors">Profile</Link>
              </div>
            </div>
            {theme.globalComponents?.footer?.showSocial && (
              <div>
                <h4 className="font-bold mb-3 text-sm">Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">📘</a>
                  <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">🐦</a>
                  <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">📸</a>
                </div>
              </div>
            )}
            {theme.globalComponents?.footer?.showNewsletter && (
              <div>
                <h4 className="font-bold mb-3 text-sm">Newsletter</h4>
                <p className="text-sm text-slate-400 mb-3">Subscribe for updates and exclusive offers</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <button className={`px-4 py-2 bg-${theme.colors.primary}-600 hover:bg-${theme.colors.primary}-700 text-white text-sm font-medium ${
                    theme.buttonStyle === 'square' ? 'rounded-none' : theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-lg'
                  } transition-colors`}>
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-800">
            © {new Date().getFullYear()} {theme.globalComponents?.footer?.companyName || 'ShopElite'}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
