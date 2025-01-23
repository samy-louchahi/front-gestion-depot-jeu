// src/components/common/ModalForm.tsx

import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ModalForm: React.FC<ModalFormProps> = ({ open, onClose, title, children }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                className="bg-white p-6 rounded-lg w-full max-w-md mx-auto mt-20 shadow-lg"
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center'
                }}
            >
                <Typography variant="h6" id="modal-title">
                    {title}
                </Typography>
                {children}
            </Box>
        </Modal>
    );
};

export default ModalForm;