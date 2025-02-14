export interface Seller {
    seller_id: number;
    name: string;
    email: string;
    phone: string;
}

export interface Buyer {
    buyer_id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface Game {
    game_id: number;
    name: string;
    publisher: string;
    description: string;
    picture: string;
}

export interface Exemplaire {
    price: number;
    state: string;
  }
  
  export interface DepositGame {
    deposit_game_id?: number; // Optionnel
    deposit_id: number;
    game_id: number;
    fees: number;
    exemplaires: { [key: string]: Exemplaire }; // Un dictionnaire d'exemplaires
    Game?: Game; // Association avec Game
  }
  
  export interface Deposit {
    deposit_id?: number;
    deposit_date: string;
    seller_id: number;
    session_id: number;
    discount_fees?: number;
    Seller?: Seller;
    Session?: Session;
    DepositGames?: DepositGame[];
    tag: string;
  }
  
export interface Session {
    session_id?: number;
    name: string;
    start_date: string;
    end_date: string;
    status: boolean;
    fees: number;
    commission: number;
}
export interface SaleDetail {
    sale_detail_id?: number;
    sale_id: number;
    seller_id: number;
    deposit_game_id: number;
    quantity: number;
    Sale?: Sale;
    DepositGame?: DepositGame;
    Seller?: Seller;
}

export interface SalesOperation {
    sales_op_id?: number;
    sale_id: number;
    commission: number;
    sale_date: string; // Format ISO
    sale_status: 'en cours' | 'finalisé' | 'annulé';
    Sale?: Sale;
}

export interface Sale {
    sale_id?: number;
    buyer_id?: number | null;
    session_id: number;
    sale_date: string; // Format ISO
    sale_status?: 'en cours' | 'finalisé' | 'annulé';
    Buyer?: Buyer;
    Session?: Session;
    SaleDetails?: SaleDetail[];
    SalesOperation?: SalesOperation;
}

export interface Balance {
    session_id: number;
    seller_id: number;
    totalDepositFees: number;
    totalSales: number;
    totalCommission: number;
    totalBenef: number;
}

export interface Stock {
    stock_id: number;
    session_id: number;
    seller_id: number;
    game_id: number;
    initial_quantity: number;
    current_quantity: number;
    // Associations
    Session?: Session;
    Seller?: Seller;
    Game?: Game;
}

export interface VendorShare {
    seller_id: number;
    sellerName: string;
    total: number;  // total en euros des ventes
}
  
  export interface GlobalBalance {
    session_id: number;
    totalDepositFees: number;
    totalSales: number;
    totalCommission: number;
    totalBenef: number;
  }
  export interface Invoice {
    
  }
  export interface Gestionnaire {
    id: number;
    username: string;
    email: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
  }