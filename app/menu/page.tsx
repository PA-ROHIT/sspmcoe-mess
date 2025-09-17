&apos;use client&apos;

import { useState, useEffect, memo, useCallback, useMemo } from &apos;react&apos;
import { motion } from &apos;framer-motion&apos;
import { Card, CardHeader } from &apos;@/components/ui/Card&apos;
import Image from &apos;next/image&apos;
import { useDebounce } from &apos;@/hooks/useDebounce&apos;

type MenuItem = {
  id: string
  name: string
  description: string | null
  ingredients: string | null
  portionSizes: string | null
  dietTags: string | null
  image: string | null
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] } }
}

// Memoized menu item component for better performance
const MenuItemCard = memo(({ menuItem }: { menuItem: MenuItem }) => {
  const [imageError, setImageError] = useState(false)
  // Generate placeholder image based on menu item name
  const getPlaceholderImage = useCallback(() => {
    const colors = [&apos;4f46e5&apos;, &apos;0891b2&apos;, &apos;059669&apos;, &apos;d97706&apos;, &apos;dc2626&apos;, &apos;7c3aed&apos;];
    const colorIndex = menuItem.name.length % colors.length;
    const bgColor = colors[colorIndex];
    const initials = menuItem.name.split(&apos; &apos;)
      .map(word => word[0])
      .join(&apos;&apos;)
      .substring(0, 2)
      .toUpperCase();
    
    return `https://placehold.co/600x400/${bgColor}/ffffff/png?text=${initials}`;
  }, [menuItem.name]);

  return (
    <motion.div 
      variants={item}
      className="menu-card relative group"
    >
      <div className="menu-card-image">
        <Image 
          src={imageError ? getPlaceholderImage() : (menuItem.image || getPlaceholderImage())}
          alt={menuItem.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          priority={false}
          onError={() => setImageError(true)}
        />
        {typeof menuItem.price !== &apos;undefined&apos; && (
          <div className="absolute top-4 right-4 glass-effect px-4 py-2 rounded-full text-sm font-medium">
            ₹{menuItem.price}
          </div>
        )}
      </div>
      <div className="menu-card-content">
        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {menuItem.name}
        </h3>
        {menuItem.description && (
          <p className="text-muted-foreground mb-4">{menuItem.description}</p>
        )}
        
        {menuItem.ingredients && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Ingredients: </span>
            <span className="text-sm text-muted-foreground">{menuItem.ingredients}</span>
          </div>
        )}
        
        {menuItem.portionSizes && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Portions: </span>
            <span className="text-sm text-muted-foreground">{menuItem.portionSizes}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          {menuItem.dietTags && (
            <div className="flex flex-wrap gap-2">
              {menuItem.dietTags.split(&apos;,&apos;).map((tag, i) => (
                <span 
                  key={i} 
                  className={`px-3 py-1 text-xs font-medium rounded-full glass-effect ${tag.trim() === &apos;vegetarian&apos; 
                    ? &apos;text-green-500&apos; 
                    : tag.trim() === &apos;vegan&apos; 
                      ? &apos;text-emerald-500&apos; 
                      : &apos;text-amber-500&apos;}`}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          
          <button className="btn-primary bg-gradient-to-r from-blue-500 to-purple-500">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
});

MenuItemCard.displayName = &apos;MenuItemCard&apos;;

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(&apos;all&apos;)
  const [searchQuery, setSearchQuery] = useState(&apos;&apos;)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(&apos;/api/menus&apos;, {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.statusText}`)
        }
        const data = await response.json()
        
        // If no items returned from API, use sample items
        if (data.length === 0) {
          const sampleItems = [
            {
              id: &apos;1&apos;,
              name: &apos;Veg Thali&apos;,
              description: &apos;A complete vegetarian meal with rice, dal, sabzi, roti, and dessert&apos;,
              ingredients: &apos;Rice, Dal, Mixed Vegetables, Roti, Raita, Sweet&apos;,
              portionSizes: &apos;Regular (1 person), Large (2 persons)&apos;,
              dietTags: &apos;vegetarian&apos;,
              category: &apos;main&apos;,
              price: 120
            },
            {
              id: &apos;2&apos;,
              name: &apos;Paneer Butter Masala&apos;,
              description: &apos;Cottage cheese cubes in rich tomato and butter gravy&apos;,
              ingredients: &apos;Paneer, Tomatoes, Butter, Cream, Spices&apos;,
              portionSizes: &apos;Regular (250g), Large (400g)&apos;,
              dietTags: &apos;vegetarian&apos;,
              category: &apos;main&apos;,
              price: 150
            },
            {
              id: &apos;3&apos;,
              name: &apos;Chicken Biryani&apos;,
              description: &apos;Fragrant rice cooked with chicken and aromatic spices&apos;,
              ingredients: &apos;Basmati Rice, Chicken, Onions, Spices, Saffron&apos;,
              portionSizes: &apos;Regular (1 person), Family (3 persons)&apos;,
              dietTags: &apos;non-vegetarian&apos;,
              category: &apos;main&apos;,
              price: 180
            },
            {
              id: &apos;4&apos;,
              name: &apos;Masala Dosa&apos;,
              description: &apos;Crispy rice crepe filled with spiced potato filling&apos;,
              ingredients: &apos;Rice Batter, Potatoes, Onions, Spices&apos;,
              portionSizes: &apos;Regular (1 piece), Jumbo (1 large piece)&apos;,
              dietTags: &apos;vegetarian, south-indian&apos;,
              category: &apos;breakfast&apos;,
              price: 90
            },
            {
              id: &apos;5&apos;,
              name: &apos;Vegan Buddha Bowl&apos;,
              description: &apos;Nutritious bowl with grains, legumes, and fresh vegetables&apos;,
              ingredients: &apos;Quinoa, Chickpeas, Avocado, Kale, Tahini Dressing&apos;,
              portionSizes: &apos;Regular (400g)&apos;,
              dietTags: &apos;vegan, healthy&apos;,
              category: &apos;main&apos;,
              price: 200
            },
            {
              id: &apos;6&apos;,
              name: &apos;Mango Lassi&apos;,
              description: &apos;Sweet yogurt drink with mango pulp&apos;,
              ingredients: &apos;Yogurt, Mango Pulp, Sugar, Cardamom&apos;,
              portionSizes: &apos;Regular (300ml), Large (500ml)&apos;,
              dietTags: &apos;vegetarian, beverage&apos;,
              category: &apos;beverage&apos;,
              price: 60
            },
            {
              id: &apos;7&apos;,
              name: &apos;Gulab Jamun&apos;,
              description: &apos;Sweet milk solids balls soaked in sugar syrup&apos;,
              ingredients: &apos;Milk Powder, Flour, Sugar, Cardamom, Rose Water&apos;,
              portionSizes: &apos;2 pieces, 4 pieces&apos;,
              dietTags: &apos;vegetarian, dessert&apos;,
              category: &apos;dessert&apos;,
              price: 50
            },
            {
              id: &apos;8&apos;,
              name: &apos;Aloo Paratha&apos;,
              description: &apos;Whole wheat flatbread stuffed with spiced potatoes&apos;,
              ingredients: &apos;Whole Wheat Flour, Potatoes, Spices, Ghee&apos;,
              portionSizes: &apos;2 pieces, 3 pieces&apos;,
              dietTags: &apos;vegetarian, breakfast&apos;,
              category: &apos;breakfast&apos;,
              price: 70
            },
            {
              id: &apos;9&apos;,
              name: &apos;Chole Bhature&apos;,
              description: &apos;Spiced chickpea curry with deep-fried bread&apos;,
              ingredients: &apos;Chickpeas, Flour, Spices, Oil&apos;,
              portionSizes: &apos;2 bhature with chole&apos;,
              dietTags: &apos;vegetarian&apos;,
              category: &apos;main&apos;,
              price: 110
            }
          ];
          setMenuItems(sampleItems);
        } else {
          setMenuItems(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : &apos;Failed to load menu items&apos;
        setError(`${errorMessage}. Please try again later.`)
        console.error(&apos;Menu fetch error:&apos;, err)
        
        // Fallback to sample items on error
        const sampleItems = [
          {
            id: &apos;1&apos;,
            name: &apos;Veg Thali&apos;,
            description: &apos;A complete vegetarian meal with rice, dal, sabzi, roti, and dessert&apos;,
            ingredients: &apos;Rice, Dal, Mixed Vegetables, Roti, Raita, Sweet&apos;,
            portionSizes: &apos;Regular (1 person), Large (2 persons)&apos;,
            dietTags: &apos;vegetarian&apos;,
            category: &apos;main&apos;,
            price: 120
          },
          // More sample items...
        ];
        setMenuItems(sampleItems);
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  // Get unique categories from menu items
   const categories = [&apos;all&apos;, ...new Set(menuItems.map(item => item.category).filter(Boolean))]

   // Filter menu items based on selected category and search query
   const displayItems = useMemo(() => {
    if (!menuItems.length) return [];
    
    const query = debouncedSearchQuery.toLowerCase().trim();
    const filteredItems = menuItems.filter(item => {
      const matchesCategory = category === &apos;all&apos; || item.category === category;
      
      if (!query) return matchesCategory;
      
      const searchableFields = [
        item.name,
        item.description,
        item.ingredients,
        item.dietTags
      ].filter(Boolean).map(field => field.toLowerCase());
      
      return matchesCategory && searchableFields.some(field => field.includes(query));
    });
    
    return filteredItems.length > 0 ? filteredItems : menuItems;
  }, [menuItems, category, debouncedSearchQuery])

  return (
    <section className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animated-bg opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12 relative z-10"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4 text-gradient floating">
          Weekly Menu
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-center text-muted-foreground mb-8">
          Explore our delicious offerings for the week
        </p>
        
        {/* Search Bar */}
        <div className="glass-search relative mb-8">
          <svg
            className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-12 pr-10 outline-none placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery(&apos;&apos;)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="glass-effect flex flex-wrap gap-3 justify-center p-2 rounded-full mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${category === cat 
                ? &apos;bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105&apos; 
                : &apos;hover:bg-white/20 dark:hover:bg-black/20&apos;}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="menu-card animate-pulse">
              <div className="menu-card-image bg-gray-200/20"></div>
              <div className="menu-card-content">
                <div className="h-6 bg-gray-200/20 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200/20 rounded w-full"></div>
                <div className="h-4 bg-gray-200/20 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center text-red-500">{error}</div>
      ) : displayItems.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-2xl font-medium mb-3">No menu items found</p>
          <p className="text-muted-foreground text-lg">
            {searchQuery ? `No results for "${searchQuery}"` : &apos;Try selecting a different category&apos;}
          </p>
        </div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems.map((menuItem) => (
            <MenuItemCard key={menuItem.id} menuItem={menuItem} />
          ))}
        </motion.div>
      )}
    </section>
  )
}


