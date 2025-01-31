import React from 'react';
import { Seller } from '../../types';
import { IconButton } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

interface SellerCardProps {
    seller: Seller;
    onUpdate: (seller: Seller) => void;
    onDelete: (seller_id: number) => void;
    onViewDetails: (seller: Seller) => void;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller, onUpdate, onDelete, onViewDetails }) => {
    return (
        <div
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => onViewDetails(seller)}
        >
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{seller.name}</h3>
            <p className="text-gray-600"><strong>Email:</strong> {seller.email}</p>
            <p className="text-gray-600"><strong>Téléphone:</strong> {seller.phone}</p>
            <div className="mt-4 flex justify-end space-x-2">
                <IconButton
                    aria-label="update"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(seller);
                    }}
                >
                    <UpdateIcon className="text-blue-500" />
                </IconButton>
                <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(seller.seller_id);
                    }}
                >
                    <DeleteIcon className="text-red-500" />
                </IconButton>
            </div>
        </div>
    );
};

export default SellerCard;