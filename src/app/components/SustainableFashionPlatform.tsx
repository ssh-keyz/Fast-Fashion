import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Share2,
  Heart,
  ShoppingCart,
  Scale,
  Ruler,
  Clock,
  X,
  Leaf,
} from 'lucide-react';

// Enhanced Analytics Interfaces
interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ClickPosition {
  x: number;
  y: number;
  element: string;
}

interface NavigationEvent {
  page: string;
  timestamp: number;
}

interface InteractionGap {
  gap: number;
  previousAction: string;
  nextAction: string;
}

interface EnhancedAnalytics {
  mouseTracking: {
    heatmapData: MousePosition[];
    hoverDurations: Record<string, number>;
    clickPositions: ClickPosition[];
  };
  sessionContext: {
    entryPoint: string;
    exitPoint: string;
    navigationPath: NavigationEvent[];
    interactionGaps: InteractionGap[];
  };
  productInteractions: {
    imageViews: Record<string, number>;
    descriptionExpansions: Record<string, number>;
    optionToggles: Record<string, Array<{option: string, timestamp: number}>>;
  };
  comparativeData: {
    layoutVersion: string;
    pricePoints: Array<{price: number, action: string}>;
    sustainabilityCorrelations: Record<string, string[]>;
  };
}

// Size Guide Interface
interface SizeGuide {
  size: string;
  chest: number;
  waist: number;
  hips: number;
  views: number;
}

const SIZE_GUIDE: Record<string, SizeGuide> = {
  XS: { size: 'XS', chest: 32, waist: 24, hips: 34, views: 0 },
  S: { size: 'S', chest: 34, waist: 26, hips: 36, views: 0 },
  M: { size: 'M', chest: 36, waist: 28, hips: 38, views: 0 },
  L: { size: 'L', chest: 38, waist: 30, hips: 40, views: 0 },
  XL: { size: 'XL', chest: 40, waist: 32, hips: 42, views: 0 },
};

// Near the top where interfaces are defined
interface CartItem {
  id: number;
  name: string;
  basePrice: number;
  selectedOptions: string[];
  finalPrice: number;
  image: string;
}

// Update the existing PRODUCTS array
const PRODUCTS = [
  {
    id: 1,
    name: "Classic T-Shirt",
    basePrice: 20,
    category: "tops",
    image: "/api/placeholder/300/400",
    sustainableOptions: [
      { id: 'organic', name: 'Organic Cotton', price: 7 },
      { id: 'shipping', name: 'Carbon-Neutral Shipping', price: 5 },
      { id: 'fair-labor', name: 'Fair Labor Certified', price: 4 },
      { id: 'recycled', name: 'Recyclable Packaging', price: 2 }
    ]
  },
  {
    id: 2,
    name: "Slim-Fit Jeans",
    basePrice: 45,
    category: "bottoms",
    image: "/api/placeholder/300/400",
    sustainableOptions: [
      { id: 'organic', name: 'Organic Denim', price: 10 },
      { id: 'shipping', name: 'Carbon-Neutral Shipping', price: 5 },
      { id: 'fair-labor', name: 'Fair Labor Certified', price: 4 },
      { id: 'recycled', name: 'Recyclable Packaging', price: 2 }
    ]
  },
  {
    id: 3,
    name: "Cozy Hoodie",
    basePrice: 35,
    category: "tops",
    image: "/api/placeholder/300/400",
    sustainableOptions: [
      { id: 'organic', name: 'Organic Cotton Blend', price: 8 },
      { id: 'shipping', name: 'Carbon-Neutral Shipping', price: 5 },
      { id: 'fair-labor', name: 'Fair Labor Certified', price: 4 },
      { id: 'recycled', name: 'Recyclable Packaging', price: 2 }
    ]
  },
  {
    id: 4,
    name: "Summer Dress",
    basePrice: 55,
    category: "dresses",
    image: "/api/placeholder/300/400",
    sustainableOptions: [
      { id: 'organic', name: 'Organic Cotton', price: 12 },
      { id: 'shipping', name: 'Carbon-Neutral Shipping', price: 5 },
      { id: 'fair-labor', name: 'Fair Labor Certified', price: 4 },
      { id: 'recycled', name: 'Recyclable Packaging', price: 2 }
    ]
  },
  {
    id: 5,
    name: "Athletic Shorts",
    basePrice: 30,
    category: "bottoms",
    image: "/api/placeholder/300/400",
    sustainableOptions: [
      { id: 'organic', name: 'Recycled Polyester', price: 8 },
      { id: 'shipping', name: 'Carbon-Neutral Shipping', price: 5 },
      { id: 'fair-labor', name: 'Fair Labor Certified', price: 4 },
      { id: 'recycled', name: 'Recyclable Packaging', price: 2 }
    ]
  },
  {
    id: 6,
    name: "Evening Maxi Dress",
    basePrice: 75,
    category: "dresses",
    image: "/api/placeholder/300/400",
    sustainableOptions: [
      { id: 'organic', name: 'Organic Silk Blend', price: 15 },
      { id: 'shipping', name: 'Carbon-Neutral Shipping', price: 5 },
      { id: 'fair-labor', name: 'Fair Labor Certified', price: 4 },
      { id: 'recycled', name: 'Recyclable Packaging', price: 2 }
    ]
  }
  // Add more products here...
];

// Environmental Impact Calculator
const calculateEnvironmentalImpact = (options: string[]) => {
  const impacts = {
    water: 0,
    co2: 0,
    waste: 0
  };

  options.forEach(option => {
    switch (option) {
      case 'organic':
        impacts.water += 2700; // Liters saved
        impacts.co2 += 0.5; // kg reduced
        break;
      case 'recycled':
        impacts.waste += 0.5; // kg reduced
        impacts.co2 += 0.3;
        break;
      case 'fairLabor':
        impacts.co2 += 0.2;
        break;
      case 'shipping':
        impacts.co2 += 1.0;
        break;
    }
  });

  return impacts;
};

// Enhanced Product Card Component
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    basePrice: number;
    category: string;
    image: string;
    sustainableOptions: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
  onAddToCompare: (product: ProductCardProps['product']) => void;
  onAddToWishlist: (product: ProductCardProps['product']) => void;
  compareList: number[];
  wishlist: number[];
  analytics: EnhancedAnalytics;
  setAnalytics: React.Dispatch<React.SetStateAction<EnhancedAnalytics>>;
  batchAnalyticsUpdate: (update: (prev: EnhancedAnalytics) => EnhancedAnalytics) => void;
}

const ProductCard = React.memo(({
  product,
  onAddToCompare,
  onAddToWishlist,
  compareList,
  wishlist,
  analytics,
  setAnalytics,
  batchAnalyticsUpdate
}: ProductCardProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverStartTime = useRef<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [giftCardBalance, setGiftCardBalance] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mouse tracking
  useEffect(() => {
    const trackMouseMovement = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        setAnalytics(prev => ({
          ...prev,
          mouseTracking: {
            ...prev.mouseTracking,
            heatmapData: [
              ...prev.mouseTracking.heatmapData,
              {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                timestamp: Date.now()
              }
            ]
          }
        }));
      }
    };

    document.addEventListener('mousemove', trackMouseMovement);
    return () => document.removeEventListener('mousemove', trackMouseMovement);
  }, []);

  // Hover tracking
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      hoverStartTime.current = Date.now();
    };

    const handleMouseLeave = () => {
      const duration = Date.now() - hoverStartTime.current;
      setAnalytics(prev => ({
        ...prev,
        mouseTracking: {
          ...prev.mouseTracking,
          hoverDurations: {
            ...prev.mouseTracking.hoverDurations,
            [product.id]: (prev.mouseTracking.hoverDurations[product.id] || 0) + duration
          }
        }
      }));
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [product.id]);

  const impact = calculateEnvironmentalImpact(selectedOptions);

  // Add this helper function inside ProductCard
  const calculateTotalPrice = (selectedOpts: string[]) => {
    const optionsTotal = selectedOpts.reduce((sum, optionId) => {
      const option = product.sustainableOptions.find(opt => opt.id === optionId);
      return sum + (option?.price || 0);
    }, 0);
    return product.basePrice + optionsTotal;
  };

  return (
    <Card ref={cardRef} className="w-full relative">
      <CardHeader className="p-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-lg"
          onClick={() => {
            setAnalytics(prev => ({
              ...prev,
              productInteractions: {
                ...prev.productInteractions,
                imageViews: {
                  ...prev.productInteractions.imageViews,
                  [product.id]: (prev.productInteractions.imageViews[product.id] || 0) + 1
                }
              }
            }));
          }}
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddToWishlist(product)}
            className={wishlist.includes(product.id) ? "text-red-500" : "text-gray-500"}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddToCompare(product)}
            disabled={compareList.length >= 3 && !compareList.includes(product.id)}
          >
            <Scale className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-xl font-bold">${calculateTotalPrice(selectedOptions)}</p>
          </div>
          <Badge variant="secondary">
            {product.category}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {product.sustainableOptions.map(option => (
            <div key={option.id} className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => {
                    setSelectedOptions(prev => 
                      prev.includes(option.id)
                        ? prev.filter(id => id !== option.id)
                        : [...prev, option.id]
                    );
                    batchAnalyticsUpdate(prev => ({
                      ...prev,
                      productInteractions: {
                        ...prev.productInteractions,
                        optionToggles: {
                          ...prev.productInteractions.optionToggles,
                          [product.id]: [
                            ...(prev.productInteractions.optionToggles[product.id] || []),
                            { option: option.id, timestamp: Date.now() }
                          ]
                        }
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span>{option.name}</span>
              </label>
              <span>+${option.price}</span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full"
          onClick={() => {
            const totalPrice = calculateTotalPrice(selectedOptions);
            if (totalPrice <= giftCardBalance) {
              setCart(prev => [...prev, { 
                ...product, 
                selectedOptions,
                finalPrice: totalPrice 
              }]);
              setGiftCardBalance(prev => prev - totalPrice);
              batchAnalyticsUpdate(prev => ({
                ...prev,
                productInteractions: {
                  ...prev.productInteractions,
                  optionToggles: {
                    ...prev.productInteractions.optionToggles,
                    [product.id]: [
                      ...(prev.productInteractions.optionToggles[product.id] || []),
                      { option: 'purchase', timestamp: Date.now() }
                    ]
                  }
                }
              }));
            }
          }}
          disabled={calculateTotalPrice(selectedOptions) > giftCardBalance}
        >
          Add to Cart
        </Button>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold mb-2">Environmental Impact</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Water Saved:</span>
              <span>{impact.water.toLocaleString()}L</span>
            </div>
            <div className="flex justify-between">
              <span>CO2 Reduced:</span>
              <span>{impact.co2.toFixed(1)}kg</span>
            </div>
            <div className="flex justify-between">
              <span>Waste Reduced:</span>
              <span>{impact.waste.toFixed(1)}kg</span>
            </div>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setAnalytics(prev => ({
                  ...prev,
                  productInteractions: {
                    ...prev.productInteractions,
                    descriptionExpansions: {
                      ...prev.productInteractions.descriptionExpansions,
                      [product.id]: (prev.productInteractions.descriptionExpansions[product.id] || 0) + 1
                    }
                  }
                }));
              }}
            >
              <Ruler className="mr-2 h-4 w-4" />
              Size Guide
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Size Guide</SheetTitle>
              <SheetDescription>
                Measurements in inches
              </SheetDescription>
            </SheetHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Chest</TableHead>
                  <TableHead>Waist</TableHead>
                  <TableHead>Hips</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(SIZE_GUIDE).map((guide) => (
                  <TableRow key={guide.size}>
                    <TableCell>{guide.size}</TableCell>
                    <TableCell>{guide.chest}"</TableCell>
                    <TableCell>{guide.waist}"</TableCell>
                    <TableCell>{guide.hips}"</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
});

// Compare Drawer Component
interface CompareDrawerProps {
  products: ProductCardProps['product'][];
  onClose: () => void;
}

const CompareDrawer = React.memo(({ products, onClose }: CompareDrawerProps) => {
  return (
    <Sheet>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Compare Products</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {products.map(product => (
                  <TableHead key={product.id}>{product.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Price</TableCell>
                {products.map(product => (
                  <TableCell key={product.id}>${product.basePrice}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Sustainability Score</TableCell>
                {products.map(product => (
                  <TableCell key={product.id}>
                    {Object.keys(product.sustainableOptions).length * 25}%
                  </TableCell>
                ))}
              </TableRow>
              {/* Add more comparison rows */}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
});

// First, let's add proper types for the ErrorBoundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Update the ErrorBoundary class with proper typing
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert>
          <AlertDescription>
            Something went wrong. Please refresh the page.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Main Component
const SustainableFashionPlatform = () => {
  const [compareList, setCompareList] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [analytics, setAnalytics] = useState<EnhancedAnalytics>({
    mouseTracking: {
      heatmapData: [],
      hoverDurations: {},
      clickPositions: []
    },
    sessionContext: {
      entryPoint: '',
      exitPoint: '',
      navigationPath: [],
      interactionGaps: []
    },
    productInteractions: {
      imageViews: {},
      descriptionExpansions: {},
      optionToggles: {}
    },
    comparativeData: {
      layoutVersion: 'A',
      pricePoints: [],
      sustainabilityCorrelations: {}
    }
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [giftCardBalance, setGiftCardBalance] = useState(100);

  // Initialize session context after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnalytics(prev => ({
        ...prev,
        sessionContext: {
          ...prev.sessionContext,
          entryPoint: window.location.pathname,
          navigationPath: [{
            page: window.location.pathname,
            timestamp: Date.now()
          }]
        }
      }));
    }
  }, []);

  // Load wishlist from localStorage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          }
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage:', e);
        }
      }
    }
  }, []);

  // Batch analytics updates
  const analyticsQueue = useRef<Array<(prev: EnhancedAnalytics) => EnhancedAnalytics>>([]);
  const batchTimeout = useRef<NodeJS.Timeout | null>(null);

  const batchAnalyticsUpdate = useCallback((update: (prev: EnhancedAnalytics) => EnhancedAnalytics) => {
    analyticsQueue.current.push(update);

    if (!batchTimeout.current) {
      batchTimeout.current = setTimeout(() => {
        setAnalytics(prev => {
          const newState = analyticsQueue.current.reduce(
            (acc, update) => update(acc),
            prev
          );
          analyticsQueue.current = [];
          batchTimeout.current = null;
          return newState;
        });
      }, 1000);
    }
  }, []);

  // Session tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setAnalytics(prev => ({
            ...prev,
            sessionContext: {
              ...prev.sessionContext,
              exitPoint: window.location.pathname
            }
          }));
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, []);

  // Clean up batch timeout on unmount
  useEffect(() => {
    return () => {
      if (batchTimeout.current) {
        clearTimeout(batchTimeout.current);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Sustainable Fashion Platform</h1>
          <div className="flex items-center space-x-4">
            <div className="text-lg">
              Gift Card Balance: ${giftCardBalance}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                  <SheetDescription>
                    Your selected sustainable fashion items
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-500">${item.finalPrice}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCart(prev => prev.filter((_, i) => i !== index));
                          setGiftCardBalance(prev => prev + item.finalPrice);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="mb-6">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="bottoms">Bottoms</SelectItem>
              <SelectItem value="dresses">Dresses</SelectItem>
              {/* Add other categories as needed */}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.filter(product => 
            selectedCategory === 'all' || product.category === selectedCategory
          ).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCompare={(product) => {
                if (compareList.includes(product.id)) {
                  setCompareList(prev => prev.filter(id => id !== product.id));
                } else if (compareList.length < 3) {
                  setCompareList(prev => [...prev, product.id]);
                  batchAnalyticsUpdate(prev => ({
                    ...prev,
                    productInteractions: {
                      ...prev.productInteractions,
                      optionToggles: {
                        ...prev.productInteractions.optionToggles,
                        [product.id]: [
                          ...(prev.productInteractions.optionToggles[product.id] || []),
                          { option: 'compare', timestamp: Date.now() }
                        ]
                      }
                    }
                  }));
                }
              }}
              onAddToWishlist={(product) => {
                setWishlist(prev => {
                  const newWishlist = prev.includes(product.id)
                    ? prev.filter(id => id !== product.id)
                    : [...prev, product.id];
                  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                  return newWishlist;
                });

                batchAnalyticsUpdate(prev => ({
                  ...prev,
                  productInteractions: {
                    ...prev.productInteractions,
                    optionToggles: {
                      ...prev.productInteractions.optionToggles,
                      [product.id]: [
                        ...(prev.productInteractions.optionToggles[product.id] || []),
                        { option: 'wishlist', timestamp: Date.now() }
                      ]
                    }
                  }
                }));
              }}
              compareList={compareList}
              wishlist={wishlist}
              analytics={analytics}
              setAnalytics={setAnalytics}
              batchAnalyticsUpdate={batchAnalyticsUpdate}
            />
          ))}
        </div>

        {/* Wishlist Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="fixed bottom-4 right-4 z-10"
            >
              <Heart className="h-5 w-5 mr-2" />
              Wishlist ({wishlist.length})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Wishlist</SheetTitle>
              <SheetDescription>
                Save and share your favorite sustainable fashion items
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {wishlist.map(productId => {
                const product = Object.values(PRODUCTS)
                  .flat()
                  .find(p => p.id === productId);

                if (!product) return null;

                return (
                  <div key={productId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-500">${product.basePrice}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const url = `${window.location.origin}?product=${product.id}`;
                          navigator.clipboard.writeText(url);

                          batchAnalyticsUpdate(prev => ({
                            ...prev,
                            productInteractions: {
                              ...prev.productInteractions,
                              optionToggles: {
                                ...prev.productInteractions.optionToggles,
                                [product.id]: [
                                  ...(prev.productInteractions.optionToggles[product.id] || []),
                                  { option: 'share', timestamp: Date.now() }
                                ]
                              }
                            }
                          }));
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setWishlist(prev => {
                            const newWishlist = prev.filter(id => id !== product.id);
                            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                            return newWishlist;
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>

        {/* Compare Drawer */}
        {compareList.length > 0 && (
          <CompareDrawer
            products={compareList
              .map(id => PRODUCTS.find(p => p.id === id))
              .filter((p): p is ProductCardProps['product'] => p !== undefined)}
            onClose={() => setCompareList([])}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// Performance optimization with React.memo for child components
const MemoizedProductCard = React.memo(ProductCard);
const MemoizedCompareDrawer = React.memo(CompareDrawer);

export default SustainableFashionPlatform;
