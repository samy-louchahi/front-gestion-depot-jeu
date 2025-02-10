// src/services/statisticService.ts
import { api } from './api';

// Importez éventuellement vos interfaces si vous les avez mises ailleurs
// import { VendorShare, GlobalBalance } from '../types/statistics'; 
// ou vous pouvez les déclarer directement ici :

export interface VendorShare {
  seller_id: number;
  sellerName: string;
  total: number;
}

export interface GlobalBalance {
  session_id: number;
  totalDepositFees: number;
  totalSales: number;
  totalCommission: number;
  totalBenef: number;
}

/**
 * getVendorShares
 * Récupère la répartition des ventes par vendeur (camembert) pour une session donnée.
 * Correspond à l'endpoint GET /api/statistics/session/:id/vendorshares (par ex.)
 */
export const getVendorShares = async (sessionId: number): Promise<VendorShare[]> => {
  // On suppose que vous avez la route `/statistics/session/{sessionId}/vendorshares`
  const response = await api.get(`/statistics/sessions/vendorshares/${sessionId}`);
  return response.data;
};

/**
 * getGlobalBalanceBySession
 * Récupère le bilan financier global d'une session.
 * Correspond à un endpoint type GET /api/finance/sessions/:sessionId/globalBalance (exemple)
 */
export const getGlobalBalanceBySession = async (sessionId: number): Promise<GlobalBalance> => {
  // Adaptez le chemin selon votre route backend
  const response = await api.get(`/finance/sessions/${sessionId}/globalBalance`);
  return response.data;
};

/**
 * (Facultatif) getVendorBalanceBySession
 * S'il existe un endpoint pour récupérer le bilan d'un vendeur dans une session
 * ex: GET /api/finance/sessions/:sessionId/vendor/:sellerId
 */
// export const getVendorBalanceBySession = async (sessionId: number, sellerId: number): Promise<Balance> => {
//   const response = await api.get(`/finance/sessions/${sessionId}/vendor/${sellerId}`);
//   return response.data;
// };

export interface SalesOverTimeData {
    date: string;   // ex: "2025-02-10"
    total: number;  // total ventes ce jour
  }
  
  // ...
  export const getSalesOverTime = async (sessionId: number): Promise<SalesOverTimeData[]> => {
    const response = await api.get(`/statistics/session/${sessionId}/salesovertime`);
    return response.data;
  };

export interface SalesCountResponse {
  salesCount: number;
}

// ...

export const getSalesCount = async (sessionId: number): Promise<number> => {
  const response = await api.get(`/statistics/session/${sessionId}/salescount`);
  // reponse.data = { salesCount: 123 }
  return response.data.salesCount;
};

export interface StocksDataResponse {
    totalInitialStocks: number;
    totalSoldStocks: number;
    remainingStocks: number;
  }
  
  export const getStocksData = async (sessionId: number): Promise<StocksDataResponse> => {
    const response = await api.get(`/statistics/session/${sessionId}/stocks`);
    return response.data;
  };

  export interface GlobalBalanceResponse {
    session_id: number;
    totalSales: number;
    totalDepositFees: number;
    totalCommission: number;
    totalBenef: number;
  }
  

export interface TopGame {
  gameName: string;
  publisher: string;
  totalQuantity: number;
  totalAmount: number;
}

export const getTopGamesBySession = async (sessionId: number): Promise<TopGame[]> => {
  const response = await api.get(`/statistics/session/${sessionId}/top-games`);
  return response.data;
};

export interface VendorStatsResponse {
    totalVendors: number;
    topVendor: {
      sellerName: string;
      totalSales: number;
    };
  }
  
  export const getVendorStats = async (sessionId: number): Promise<VendorStatsResponse> => {
    const response = await api.get(`/statistics/session/${sessionId}/vendor-stats`);
    return response.data;
  };