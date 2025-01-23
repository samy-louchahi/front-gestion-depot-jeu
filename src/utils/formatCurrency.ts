export const formatCurrency = (amount: number, locale: string = 'fr-FR', currency: string = 'EUR'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};