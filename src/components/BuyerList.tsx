import React, { useEffect, useState } from 'react';
import { Button, IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface Buyer {
    buyer_id: number;
    name: string;
    email: string;
    phone: string;
}

const BuyerList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newBuyer, setNewBuyer] = useState<Buyer>({
        buyer_id: 0,
        name: '',
        email: '',
        phone: ''
    });

    const handleOpen = () => {
        setOpen(true);
    };
    const handleOpenUpdate = (buyer : Buyer) => {
        setNewBuyer(buyer)
        setOpenUpdate(true);
    }

    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBuyer({
            ...newBuyer,
            [name]: value
        });
    };

    const handleSubmitAdd = () => {
        if (newBuyer.name && newBuyer.email && newBuyer.phone) {
            setBuyers([
                ...buyers,
                { ...newBuyer, buyer_id: Date.now() } // ID unique généré avec Date.now() pour l'exemple
            ]);
            addBuyer(); // Appel de la fonction pour ajouter le nouveau vendeur
            setNewBuyer({ buyer_id: 0, name: '', email: '', phone: '' }); // Réinitialisation du formulaire
            handleClose(); // Ferme la modale après soumission
        }
    }
    const handleSubmitUpdate = () => {
        if (newBuyer.name && newBuyer.email && newBuyer.phone) {
            setBuyers([
                ...buyers,
                { ...newBuyer, buyer_id: Date.now() } // ID unique généré avec Date.now() pour l'exemple
            ]);
            updateBuyer(newBuyer.buyer_id); // Appel de la fonction pour ajouter le nouveau vendeur
            setNewBuyer({ buyer_id: 0, name: '', email: '', phone: '' }); // Réinitialisation du formulaire
            handleCloseUpdate(); // Ferme la modale après soumission
        }
    }


    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/buyers/buyers');
                setBuyers(response.data);
            } catch (err) {
                setError('Failed to fetch buyers');
            } finally {
                setLoading(false);
            }
        };

        fetchBuyers();
    }, []);
    const addBuyer = async () => {
        if(newBuyer.name && newBuyer.email && newBuyer.phone) {
        try {
            const newBuyerId = buyers.length > 0 ? buyers[buyers.length - 1].buyer_id + 1 : 1;
            const response = await axios.post('http://localhost:3000/api/buyers/buyers', {
                buyer_id: newBuyerId,
                name: newBuyer.name,
                email: newBuyer.email,
                phone: newBuyer.phone
            });
            setBuyers([...buyers, response.data]);
        } catch (err) {
            setError('Failed to add buyer');
        }
    }
    }
   const updateBuyer = async (buyer_id: number) => {
        try {
            await axios.put(`http://localhost:3000/api/buyers/buyers/${buyer_id}`, {
                name: newBuyer.name,
                email: newBuyer.email,
                phone: newBuyer.phone
            });
            setBuyers(buyers.map((buyer) => buyer.buyer_id === buyer_id ? newBuyer : buyer));
        } catch (err) {
            setError('Failed to update buyer');
        }
    }
    const deleteBuyer = async (buyer_id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/buyers/buyers/${buyer_id}`);
            setBuyers(buyers.filter((buyer) => buyer.buyer_id !== buyer_id));
        } catch (err) {
            setError('Failed to delete buyer');
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-bold mb-4">Buyer List</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Add Buyer
            </Button>
            <ul className="space-y-4">
                {buyers.map((buyer : Buyer) => (
                    <li key={buyer.buyer_id} className="border p-4 rounded shadow-md w-full max-w-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{buyer.name}</h2>
                            <IconButton onClick={() => deleteBuyer(buyer.buyer_id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenUpdate(buyer)}>
                                <UpdateIcon />
                            </IconButton>
                        </div>
                        <p>Email: {buyer.email}</p>
                        <p>Phone: {buyer.phone}</p>
                    </li>
                ))}
            </ul>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Buyer
                    </Typography>
                    <TextField
                        id="name"
                        name="name"
                        label="Name"
                        value={newBuyer.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        value={newBuyer.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={newBuyer.phone}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleSubmitAdd}>
                        Add Buyer
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Update Buyer
                    </Typography>
                    <TextField
                        id="name"
                        name="name"
                        label="Name"
                        value={newBuyer.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        value={newBuyer.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={newBuyer.phone}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleSubmitUpdate}>
                        Update Buyer
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default BuyerList;