import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ComparisonProduct {
  id: number;
  name: string;
  price: string;
  rating: string;
  category: string;
  image: string;
}

interface ComparisonContextType {
  selectedProducts: ComparisonProduct[];
  addToComparison: (product: ComparisonProduct) => void;
  removeFromComparison: (productId: number) => void;
  clearComparison: () => void;
  isInComparison: (productId: number) => boolean;
  canAddMore: () => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);

  const addToComparison = (product: ComparisonProduct) => {
    if (selectedProducts.length < 4 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeFromComparison = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setSelectedProducts([]);
  };

  const isInComparison = (productId: number) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const canAddMore = () => {
    return selectedProducts.length < 4;
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}
