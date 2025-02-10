import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getStocksData } from '../../services/statisticService';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StocksDonutChartProps {
  sessionId?: number;
}

const StocksDonutChart: React.FC<StocksDonutChartProps> = ({ sessionId }) => {
  const [data, setData] = useState<{ sold: number; remaining: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStocksData = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        const stocksData = await getStocksData(sessionId);
        setData({
          sold: stocksData.totalSoldStocks,
          remaining: stocksData.remainingStocks,
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les données des stocks.');
      } finally {
        setLoading(false);
      }
    };
    fetchStocksData();
  }, [sessionId]);

  if (!sessionId) {
    return <p className="text-gray-600">Veuillez sélectionner une session.</p>;
  }
  if (loading) {
    return <p className="text-center text-indigo-500">Chargement des données...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="text-center text-gray-500">Aucune donnée disponible.</p>;
  }

  // Préparer les données pour le Donut Chart
  const chartData = {
    labels: ['Vendu', 'Restant'],
    datasets: [
      {
        label: 'Jeux (quantité)',
        data: [data.sold, data.remaining],
        backgroundColor: ['#748DA6', '#B0C4B1'], // Couleurs douces
        borderColor: '#ffffff',
        hoverBackgroundColor: ['#607D8B', '#9FAF97'], // Couleurs légèrement plus sombres au hover
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#374151', // Couleur de la légende en gris foncé
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw || 0;
            const total = data.sold + data.remaining;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} jeux (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
      <h3 className="text-center font-semibold text-xl text-gray-800 mb-4">
        Répartition des stocks : Vendu vs Restant
      </h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default StocksDonutChart;