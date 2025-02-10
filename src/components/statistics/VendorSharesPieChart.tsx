import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';
import { getVendorShares, VendorShare } from '../../services/statisticService';

ChartJS.register(ArcElement, Tooltip, Legend);

interface VendorSharesPieChartProps {
  sessionId?: number;  // on accepte "undefined" si pas encore choisi
}

const VendorSharesPieChart: React.FC<VendorSharesPieChartProps> = ({ sessionId }) => {
  const [vendorShares, setVendorShares] = useState<VendorShare[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVendorShares = async () => {
      if (!sessionId) return;
      try {
        setLoading(true);
        const data = await getVendorShares(sessionId);
        setVendorShares(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError('Impossible de charger les stats par vendeur.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorShares();
  }, [sessionId]);

  if (!sessionId) {
    return <p className="text-gray-600">Veuillez sélectionner une session.</p>;
  }

  if (loading) {
    return <p className="text-center text-indigo-500">Chargement des données...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!vendorShares.length) {
    return <p className="text-center text-gray-500">Aucune vente finalisée pour cette session.</p>;
  }

  // Préparer les données du Pie
  const labels = vendorShares.map((v) => v.sellerName);
  const values = vendorShares.map((v) => v.total);
  const totalAll = values.reduce((acc, val) => acc + val, 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ventes (€)',
        data: values,
        backgroundColor: [
          '#BFD7EA',
          '#A5C4D4',
          '#F2D7D9',
          '#E4C1C1',
          '#C9D8B6',
          '#F6E8C3',
        ],
        hoverBackgroundColor: [
          '#A6C1D1',
          '#8FB0BE',
          '#E0BFC1',
          '#D1A9A9',
          '#B0C3A1',
          '#E3D1A8',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label(context: any) {
            const label = context.label || '';
            const rawValue = context.raw || 0;
            const perc = totalAll > 0 ? ((rawValue / totalAll) * 100).toFixed(1) : '0';
            return `${label}: ${formatCurrency(rawValue)} (${perc}%)`;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-center font-semibold text-xl text-gray-800 mb-4">
        Répartition des ventes par vendeur
      </h3>
      <div className="w-full max-w-md mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default VendorSharesPieChart;