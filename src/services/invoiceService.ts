import { api } from './api';

export const downloadInvoice = async (saleId: number, buyerId?: number) => {
  try {
    const response = await api.post(`/invoices/${saleId}`, {
      sale_id: saleId,
      buyer_id: buyerId,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob', // Important pour télécharger un fichier binaire
    });

    // Vérifie si la réponse est correcte
    if (response.status !== 200) {
      throw new Error('Erreur lors de la génération de la facture.');
    }

    // Créer une URL à partir de la réponse binaire
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Créer un lien pour télécharger la facture
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${saleId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Libérer l'URL une fois le téléchargement terminé
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors du téléchargement de la facture :', error);
    throw error;
  }
};