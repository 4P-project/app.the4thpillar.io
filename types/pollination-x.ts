type Contract = {
  address: string;
};

type OpenSea = {
  lastIngestedAt: string;
};

type ContractMetadata = {
  contractDeployer: string;
  deployedBlockNumber: number;
  name: string;
  openSea: OpenSea;
  symbol: string;
  tokenType: string;
};

type TokenMetadata = {
  tokenType: string;
};

type Token = {
  tokenId: string;
  tokenMetadata: TokenMetadata;
};

type Media = {
  bytes: number;
  format: string;
  gateway: string;
  raw: string;
  thumbnail: string;
};

type MetadataAttribute = {
  display_type?: string;
  trait_type: string;
  value: string | number;
};

type Metadata = {
  attributes: MetadataAttribute[];
  description: string;
  image: string;
  name: string;
};

type TokenUri = {
  gateway: string;
  raw: string;
};

export type Nft = {
  balance: string;
  contract: Contract;
  contractMetadata: ContractMetadata;
  description: string;
  endpoint: string;
  id: Token;
  jwt: string;
  media?: Media[];
  metadata: Metadata;
  timeLastUpdated: string;
  title: string;
  tokenUri: TokenUri;
  secret?: string;
  cid?: string;
  synced?: boolean;
};

export type NftPackage = {
  id: number;
  bandwidthLimit: number;
  size: number;
  price: bigint;
  storageUnit: string;
};

export type GetNft = {
  nfts?: Nft[];
  packages: NftPackage[];
  success?: boolean;
  error?: any;
  totalCount?: number;
  contractAddress?: string;
  symbol?: string;
};

export type PollinationXConfig = {
  url: string;
  authMessage: string;
};
