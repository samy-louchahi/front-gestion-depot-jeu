import React from 'react';
import { Buyer } from '../../types';
import { IconButton } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

interface BuyerCardProps {
    buyer: Buyer;
    onUpdate: (buyer: Buyer) => void;
    onDelete: (buyer_id: number) => void;
}

const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, onUpdate, onDelete }) => {
    return (
        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">{buyer.name}</h3>
                <div className="flex space-x-2">
                    <IconButton onClick={() => onUpdate(buyer)}>
                        <UpdateIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton onClick={() => onDelete(buyer.buyer_id!)}>
                        <DeleteIcon className="text-red-500" />
                    </IconButton>
                </div>
            </div>
            <p className="text-gray-600"><strong>Email:</strong> {buyer.email}</p>
            <p className="text-gray-600"><strong>Téléphone:</strong> {buyer.phone}</p>
            <p className="text-gray-600"><strong>Adresse:</strong> {buyer.address}</p>
        </div>
    );
};

export default BuyerCard;