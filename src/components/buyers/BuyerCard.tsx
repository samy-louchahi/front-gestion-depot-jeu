import React from 'react';
import { Buyer } from '../../types';
import { IconButton, Typography } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

interface BuyerCardProps {
    buyer: Buyer;
    onUpdate: (buyer: Buyer) => void;
    onDelete: (buyer_id: number) => void;
    onViewDetails: (buyer: Buyer) => void;
}

const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, onUpdate, onDelete, onViewDetails }) => {
    return (
        <li
            className="border p-4 rounded shadow-md w-full max-w-md cursor-pointer hover:bg-gray-100"
            onClick={() => onViewDetails(buyer)}
        >
            <div className="flex justify-between items-center">
                <Typography variant="h6">{buyer.name}</Typography>
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => onUpdate(buyer)}>
                        <UpdateIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton onClick={() => onDelete(buyer.buyer_id!)}>
                        <DeleteIcon className="text-red-500" />
                    </IconButton>
                </div>
            </div>
            <Typography>Email: {buyer.email}</Typography>
            <Typography>Téléphone: {buyer.phone}</Typography>
            <Typography>Addresse: {buyer.address}</Typography>
        </li>
    );
};

export default BuyerCard;