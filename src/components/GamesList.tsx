import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface Game {
    game_id: number;
    name: string;
    publisher: string;
    price: number;
    seller_id: number;
    stock_id: number;
    deposit_id: number;
}

const GamesList: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [newGame, setNewGame] = useState<Game>({
        game_id: 0,
        name: '',
        publisher: '',
        price: 0,
        seller_id: 0,
        stock_id: 0,
        deposit_id: 0,
    });
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewGame({
          ...newGame,
          [name]: value
        });
    };

    const handleSubmit = () => {
        if (newGame.name && newGame.publisher && newGame.price) {
          setGames([
            ...games,
            { ...newGame, seller_id: Date.now() } // ID unique généré avec Date.now() pour l'exemple
          ]);
          addGame(); // Appel de la fonction pour ajouter le nouveau vendeur
          setNewGame({ game_id: 0, name: '', publisher: '',price:0,  seller_id: 1 ,stock_id:1,deposit_id:1 }); // Réinitialisation du formulaire
          handleClose(); // Ferme la modale après soumission
        }
      };


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/games/games');
                setGames(response.data);
            } catch (err) {
                setError('Failed to fetch games');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);
        const addGame = async () => {
            if(newGame.name && newGame.publisher && newGame.price){
        try {
            const newGameId = games.length > 0 ? games[games.length - 1].game_id + 1 : 1;
            const response = await axios.post('http://localhost:3000/api/games/games', {
                game_id: newGameId,
                name: newGame.name,
                publisher: newGame.publisher,
                price: newGame.price,
                seller_id: 1,
                stock_id: 1,
                deposit_id: 1,
            });
            setGames([...games, response.data]);
        } catch (err) {
            setError('Failed to add game');
        }
    }
    }
    const deleteGame = async (game_id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/games/games/${game_id}`);
            setGames(games.filter((game) => game.game_id !== game_id));
        } catch (err) {
            setError('Failed to delete game');
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
            <h1 className="text-3xl font-bold mb-4">Games List</h1>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                Add Game
            </Button>
            <ul className="space-y-4">
                {games.map((game) => (
                    <li key={game.game_id}  className="border p-4 rounded shadow-md w-full max-w-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{game.name}</h2>
                            <IconButton aria-label="delete" size="small" onClick={() => deleteGame(game.game_id)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <p>Publisher: {game.publisher}</p>
                        <p>Price: ${game.price}</p>
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
            value={newGame.name}
            onChange={handleInputChange}
            className="mb-4"
          />

          <TextField
            label="Éditeur"
            variant="outlined"
            fullWidth
            name="publisher"
            value={newGame.publisher}
            onChange={handleInputChange}
            className="mb-4"
          />

          <TextField
            label="prix"
            variant="outlined"
            fullWidth
            name="price"
            value={newGame.price}
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
              onClick={handleSubmit}
              className="flex-1"
            >
              Ajouter
            </Button>
          </div>
        </Box>
      </Modal>
        </div>
    );
};

export default GamesList;