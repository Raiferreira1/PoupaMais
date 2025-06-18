export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Receita',
  [TRANSACTION_TYPES.EXPENSE]: 'Despesa',
};

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
};

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'BRL',
};

export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/transactions',
  CATEGORIES: '/api/categories',
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_DATE: 'Data inválida',
  INVALID_AMOUNT: 'Valor inválido',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente.',
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Registro criado com sucesso!',
  UPDATED: 'Registro atualizado com sucesso!',
  DELETED: 'Registro excluído com sucesso!',
}; 