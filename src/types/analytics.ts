export interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

export interface ClickPosition {
  x: number;
  y: number;
  element: string;
}

export interface NavigationEvent {
  page: string;
  timestamp: number;
}

export interface InteractionGap {
  gap: number;
  previousAction: string;
  nextAction: string;
}

export interface EnhancedAnalytics {
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
