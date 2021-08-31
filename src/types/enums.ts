export enum ToastType {
  SUCCESS = 'success',
  FAILED = 'failed',
  LOADING = 'loading',
  WARNING = 'warning',
  DEFAULT = 'default'
}

export enum ToastColor {
  'success' = '#d6f8d1',
  'failed' = '#f8d1d6',
  'loading' = '#998fe7',
  'warning' = '#f8f3d1',
  'default' = '#d1eaf8'
}

export enum TransactionStatus {
  PENDING, FAILED, SUCCESS
}

export enum ETHChainName {
  ETHEREUM = 'Ethereum',
  ROPSTEN = 'Ropsten',
  RINKEBY = 'Rinkeby',
  GOERLI = 'Goerli',
  KOVAN = 'Kovan'
}
