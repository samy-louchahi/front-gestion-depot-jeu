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
}

export interface Deposit {
    deposit_id?: number; // Optionnel car généré par le backend
    seller_id: number;
    buyer_id: number;
    date: string; // Format ISO, ex: "2025-01-22"
    quantity: number;
    games: number[]; // Liste des game_id inclus dans le dépôt
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
export interface Sale {
    sale_id: number;
    buyer_id: number | null;
    session_id: number;
    sale_date: string; // ISO Date string
    // Associations
    Buyer?: Buyer;
    Session?: Session;
    SaleDetail?: SaleDetail[];
}

export interface SaleDetail {
    sale_detail_id: number;
    sale_id: number;
    seller_id: number;
    deposit_game_id: number;
    quantity: number;
    // Associations
    Sale?: Sale;
    DepositGame?: DepositGame;
}

export interface Balance {
    session_id: number;
    seller_id: number;
    totalDepositFees: number;
    totalSales: number;
    totalCommission: number;
    totalBenef: number;
}
export interface DepositGame {
    deposit_game_id: number;
    label: string;
    fees: number;
    price: number;
    deposit_id: number;
    game_id: number;
    // Associations
    Deposit?: Deposit;
    Game?: Game;
}
export interface SalesOperation {
    sales_op_id: number;
    sale_id: number;
    commission: number;
    sale_date: string;
    sale_status: 'en cours' | 'finalisé' | 'annulé';
    // Associations
    Sale?: Sale;
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
