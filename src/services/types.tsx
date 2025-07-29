export interface User {
    id: string;
    name: string;
    tier: string;
    points: number;
}

export interface DashboardData {
    totalOrders: number;
    totalSpent: number;
    points: number;
    tier: string;
    user?: User;
}

export interface Order {
    id: string;
    date?: string;
    created_at?: string;
    items?: Array<{
      product_id: string;
      quantity: number;
      price: number;
}>;
    total: number;
}

export interface Message {
    id: string;
    title: string;
    body: string;
    date?: string;
    created_at?: string;
    readFlag?: boolean;
    read_flag?: boolean;
}

export interface Product {
    id: string;
    product_id?: string;
    name: string;
    price: number;
    imageUrl?: string;
    image_url?: string;
    rationale?: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    message: string;
    timestamp: Date;
}

export interface LoadingStates {
    dashboard: boolean;
    orders: boolean;
    inbox: boolean;
    recommendations: boolean;
    chat: boolean;
}

export interface ErrorStates {
    dashboard: Error | null;
    orders: Error | null;
    inbox: Error | null;
    recommendations: Error | null;
    chat: Error | null;
}
