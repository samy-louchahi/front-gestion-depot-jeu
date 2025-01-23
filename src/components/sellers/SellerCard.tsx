// src/components/sellers/SellerCard.tsx

import React from 'react';
import { Seller } from '../../types';
import { IconButton, Typography } from '@mui/material';
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
            className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => onViewDetails(seller)}
        >
            <div>
                <Typography variant="h6" className="mb-2">
                    {seller.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                    <strong>Email:</strong> {seller.email}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                    <strong>Téléphone:</strong> {seller.phone}
                </Typography>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <IconButton
                    aria-label="update"
                    onClick={(e) => {
                        e.stopPropagation(); // Empêche l'ouverture de la modal de détail
                        onUpdate(seller);
                    }}
                >
                    <UpdateIcon className="text-blue-500" />
                </IconButton>
                <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                        e.stopPropagation(); // Empêche l'ouverture de la modal de détail
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