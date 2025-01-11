import React from 'react';

interface Seller {
    seller_id: number;
    name: string;
    email: string;
    phone: string;
}

interface SellerCardProps {
    seller: Seller;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
    return (
        <div className="seller-card">
            <h2>Seller Information</h2>
            <p><strong>ID:</strong> {seller.seller_id}</p>
            <p><strong>Name:</strong> {seller.name}</p>
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Phone:</strong> {seller.phone}</p>
        </div>
    );
};

export default SellerCard;