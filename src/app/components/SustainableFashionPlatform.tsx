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
const ProductCard = ({ 
  product, 
  onAddToCompare, 
  onAddToWishlist,
  compareList,
  wishlist,
  analytics,
  setAnalytics 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverStartTime = useRef<number>(0);

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
        {/* ... existing product content ... */}

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
};

// Compare Drawer Component
const CompareDrawer = ({ products, onClose }) => {
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
};

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
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
  const [compareList, setCompareList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [analytics, setAnalytics] = useState<EnhancedAnalytics>({
    mouseTracking: {
      heatmapData: [],
      hoverDurations: {},
      clickPositions: []
    },
    sessionContext: {
      entryPoint: window.location.pathname,
      exitPoint: '',
      navigationPath: [{
        page: window.location.pathname,
        timestamp: Date.now()
      }],
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

  // Batch analytics updates
  const analyticsQueue = useRef([]);
  const batchTimeout = useRef(null);

  const batchAnalyticsUpdate = useCallback((update) => {
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
  }, []);

  // ... rest of the existing component code ...

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto p-6">
        {/* ... existing layout ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols