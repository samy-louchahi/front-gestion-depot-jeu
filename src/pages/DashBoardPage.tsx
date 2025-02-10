import React from 'react';
import { Link } from 'react-router-dom';
import { iconClasses, Typography } from '@mui/material';

// Icônes Heroicons ou personnalisées
const icons = {
    seller: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-blue-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m9 0h1.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-13.5A1.5 1.5 0 013 18v-7.5A1.5 1.5 0 014.5 9H6m9 0V5.25m-6 0V9m6 0h-6"
            />
        </svg>
    ),
    session: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-green-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10l1.664-5.992A1 1 0 015.629 3h12.742a1 1 0 01.965.765L21 10m-6 9H9m12-9h-4.5M3 10h4.5M12 18V9m0 9h3m-3 0H9"
            />
        </svg>
    ),
    game: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-red-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75v10.5m-7.5-10.5v10.5m-6 3h18m-18-17.25h18"
            />
        </svg>
    ),
    buyer: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-purple-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m9 0h1.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-13.5A1.5 1.5 0 013 18v-7.5A1.5 1.5 0 014.5 9H6m9 0V5.25m-6 0V9m6 0h-6"
            />
        </svg>
    ),
    sale: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-yellow-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9V5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25V9m-1.5 10.5h-15a1.5 1.5 0 01-1.5-1.5v-5.25h18v5.25a1.5 1.5 0 01-1.5 1.5z"
            />
        </svg>
    ),
    deposit: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-teal-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3.75h18M3 10.5h18m-18 6.75h18M10.5 3.75l.75 4.5m0 0l-.75-4.5m6 18l.75-4.5m-.75 4.5l-.75-4.5m-12.75 0h6.75m4.5-13.5h5.25"
            />
        </svg>
    ),
    statistics: (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-12 h-12 text-indigo-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 3v18h18M13 9v7m4-11v11m-8-5v5m-4-7v7"
        />
      </svg>
    ),
};

const DashboardPage: React.FC = () => {
    const menuItems = [
        { title: 'Vendeurs', path: '/sellers', icon: icons.seller },
        { title: 'Sessions', path: '/sessions', icon: icons.session },
        { title: 'Dépôts', path: '/deposits', icon: icons.deposit },
        { title: 'Ventes', path: '/sales', icon: icons.sale },
        { title: 'Jeux', path: '/games', icon: icons.game },
        { title: 'Acheteurs', path: '/buyers', icon: icons.buyer },
        { title: 'Statistiques', path: '/statistics', icon: icons.statistics },
    ];

    return (
        <div className="p-8">
            <Typography 
                variant="h4" 
                className="text-gray-800 font-bold mb-8 text-center" 
                style={{ fontFamily: 'Press Start 2P, cursive' }}
            >
                Bienvenue sur le Dashboard
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.title}
                        to={item.path}
                        className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                    >
                        {item.icon}
                        <Typography 
                            variant="h6" 
                            className="mt-4 text-gray-800 font-semibold" 
                            style={{ fontFamily: 'Press Start 2P, cursive' }}
                        >
                            {item.title}
                        </Typography>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;