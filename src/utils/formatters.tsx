export const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  export const formatCurrency = (amount: number | undefined): string => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  export const formatDateTime = (date: Date): string => {
    return date.toLocaleString();
  };
