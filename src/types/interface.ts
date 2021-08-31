import { ToastType } from '@type/enums';

export interface IToastOption {
  readonly title: string;
  readonly description?: string;
  readonly type?: ToastType;
  readonly timeout?: number;
}

export interface IReceipt {
  readonly blockHash: string;
  readonly blockNumber: number;
  readonly contractAddress: string;
  readonly cumulativeGasUsed: number;
  readonly effectiveGasPrice: string;
  readonly from: string;
  readonly gasUsed: number;
  readonly logs: Array<string>;
  readonly logsBloom: string;
  readonly status: boolean;
  readonly to: string;
  readonly transactionHash: string;
  readonly transactionIndex: number;
  readonly type: string;
}

interface ITokenAttribute{
  // eslint-disable-next-line camelcase
  readonly trait_type: string;
  readonly value: string;
}

export interface ITokenMetadata{
  readonly attributes: ITokenAttribute[];
  readonly description: string;
  readonly image: string;
  readonly name: string;
}
