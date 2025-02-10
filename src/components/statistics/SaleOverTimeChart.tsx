import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { getSalesOverTime, SalesOverTimeData } from '../../services/statisticService';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface SalesOverTimeChartProps {
  sessionId?: number;
}

const SalesOverTimeChart: React.FC<SalesOverTimeChartProps> = ({ sessionId }) => {
  const [dataPoints, setDataPoints] = useState<SalesOverTimeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) return;
      try {
        const result = await getSalesOverTime(sessionId);
        setDataPoints(result);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des ventes dans le temps.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  if (!sessionId) {
    return <p className="text-gray-600">Veuillez sélectionner une session.</p>;
  }
  if (loading) {
    return <p className="text-indigo-500 text-center">Chargement des données...</p>;
  }
  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }
  if (!dataPoints.length) {
    return <p className="text-gray-500 text-center">Aucune vente finalisée pour cette session.</p>;
  }

  // Préparer les labels (dates) et les values (totaux)
  const labels = dataPoints.map((d) => d.date);
  const values = dataPoints.map((d) => d.total);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ventes par Jour',
        data: values,
        borderColor: '#4B5563', // Gris foncé Tailwind
        backgroundColor: '#9CA3AF', // Gris doux en arrière-plan
        fill: false,
        tension: 0.3,
        pointBackgroundColor: '#3B82F6', // Bleu clair pour les points
        pointBorderColor: '#3B82F6'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true 
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const val = context.parsed.y;
            return formatCurrency(val);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#374151' 
        },
        title: {
          display: true,
          text: 'Montant (€)',
          color: '#4B5563', 
          font: {
            size: 14
          }
        }
      },
      x: {
        ticks: {
          color: '#374151'
        },
        title: {
          display: true,
          text: 'Date',
          color: '#4B5563',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-center font-semibold text-xl text-gray-800 mb-6">
        Évolution du total des ventes dans le temps
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesOverTimeChart;