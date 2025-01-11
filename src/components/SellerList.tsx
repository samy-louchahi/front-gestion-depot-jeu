import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';


interface Seller {
    seller_id: number;
    name: string;
    email: string;
    phone: string;
}

const SellerList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newSeller, setNewSeller] = useState<Seller>({
        seller_id: 0,
        name: '',
        email: '',
        phone: ''
      });

    const handleOpen = () => {
        setOpen(true);
    };
    const handleOpenUpdate = (seller : Seller) => {
        setNewSeller(seller)
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
        setNewSeller({
          ...newSeller,
          [name]: value
        });
    };

    const handleSubmitAdd = () => {
        if (newSeller.name && newSeller.email && newSeller.phone) {
          setSellers([
            ...sellers,
            { ...newSeller, seller_id: Date.now() } // ID unique généré avec Date.now() pour l'exemple
          ]);
          addSeller(); // Appel de la fonction pour ajouter le nouveau vendeur
          setNewSeller({ seller_id: 0, name: '', email: '', phone: '' }); // Réinitialisation du formulaire
          handleClose(); // Ferme la modale après soumission
        }
      };
      const handleSubmitUpdate = (seller_id : number) => {
        if (newSeller.name && newSeller.email && newSeller.phone) {
            setSellers([
                ...sellers.map((seller) => {
                    if (seller.seller_id === newSeller.seller_id) {
                        return newSeller;
                    }
                    return seller;
                })
            ]);
            updateSeller(seller_id); // Appel de la fonction pour ajouter le nouveau vendeur
            setNewSeller({ seller_id: 0, name: '', email: '', phone: '' }); // Réinitialisation du formulaire
            handleCloseUpdate(); // Ferme la modale après soumission
        }
    }

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sellers/sellers');
                setSellers(response.data);
            } catch (err) {
                setError('Failed to fetch sellers');
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);

        const addSeller = async () => {
        if(newSeller.name && newSeller.email && newSeller.phone) {
        try {
            const newSellerId = sellers.length > 0 ? sellers[sellers.length - 1].seller_id + 1 : 1;
            const response = await axios.post('http://localhost:3000/api/sellers/sellers', {
                seller_id: newSellerId,
                name: newSeller.name,
                email: newSeller.email,
                phone: newSeller.phone,
            });
            setSellers([...sellers, response.data]);
        } catch (err) {
            setError('Failed to add seller');
        }
    }
}   
    const updateSeller = async (seller_id : number) => {
        try {
            await axios.put(`http://localhost:3000/api/sellers/sellers/${seller_id}`, {
                name: newSeller.name,
                email: newSeller.email,
                phone: newSeller.phone
            });
            setSellers(sellers.map((seller) => seller.seller_id === seller_id ? newSeller : seller));
        } catch (err) {
            setError('Failed to update seller')
    };
}
    const deleteSeller = async (seller_id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/sellers/sellers/${seller_id}`);
            setSellers(sellers.filter((seller) => seller.seller_id !== seller_id));
        } catch (err) {
            setError('Failed to delete seller');
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
            <h1 className="text-3xl font-bold mb-4">Seller List</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Add Seller
            </Button>
            <ul className="space-y-4">
                {sellers.map((seller) => (
                    <li key={seller.seller_id} className="border p-4 rounded shadow-md w-full max-w-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{seller.name}</h2>
                            <IconButton aria-label="delete" size="small" onClick={() => deleteSeller(seller.seller_id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton aria-label="update" size="small" onClick={() => handleOpenUpdate(seller)}>
                                <UpdateIcon />
                            </IconButton>
                        </div>
                        <p>Email: {seller.email}</p>
                        <p>Phone: {seller.phone}</p>
                    </li>
                ))}
            </ul>
            <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-seller-modal"
        aria-describedby="modal-to-add-seller"
      >
        <Box
          className="bg-white p-6 rounded-lg w-1/3 mx-auto mt-16 shadow-lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" id="add-seller-modal">
            Ajouter un nouveau vendeur
          </Typography>

          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            name="name"
            value={newSeller.name}
            onChange={handleInputChange}
            className="mb-4"
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={newSeller.email}
            onChange={handleInputChange}
            className="mb-4"
          />

          <TextField
            label="Téléphone"
            variant="outlined"
            fullWidth
            name="phone"
            value={newSeller.phone}
            onChange={handleInputChange}
            className="mb-4"
          />

          <div className="flex gap-4 w-full">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAdd}
              className="flex-1"
            >
              Ajouter
            </Button>
          </div>
        </Box>
        </Modal>
        <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="add-seller-modal"
        aria-describedby="modal-to-add-seller"
        >
        <Box
          className="bg-white p-6 rounded-lg w-1/3 mx-auto mt-16 shadow-lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center'
          }}
        >
            <Typography variant="h6" id="add-seller-modal">
                Modifier un vendeur
            </Typography>
    
            <TextField
                label="Nom"
                variant="outlined"
                fullWidth
                name="name"
                value={newSeller.name}
                onChange={handleInputChange}
                className="mb-4"
            />
    
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={newSeller.email}
                onChange={handleInputChange}
                className="mb-4"
            />
    
            <TextField
                label="Téléphone"
                variant="outlined"
                fullWidth
                name="phone"
                value={newSeller.phone}
                onChange={handleInputChange}
                className="mb-4"
            />
    
            <div className="flex gap-4 w-full">
                <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseUpdate}
                className="flex-1"
                >
                Annuler
                </Button>
                <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmitUpdate(newSeller.seller_id)}
                className="flex-1"
                >
                Modifier
                </Button>
            </div>
        </Box>
        </Modal>
        </div>
    );
};


export default SellerList;