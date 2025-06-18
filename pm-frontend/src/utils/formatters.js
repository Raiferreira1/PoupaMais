export const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('pt-BR');
};

export const parseCurrency = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  
  // Remove R$, espaços e pontos de milhar
  const cleanValue = value.replace(/[R$\s.]/g, '');
  // Substitui vírgula por ponto para parseFloat
  const numericValue = cleanValue.replace(',', '.');
  
  return parseFloat(numericValue) || 0;
}; 