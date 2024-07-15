import type { Address, Conversation as ConversationSdk, ReceivedMessage, TransactionHash } from '@4thtech-sdk/types';
import type { Pagination } from '~/types/pagination';

export type TmpMessageIndex = `tmp-${number}`;

export type TmpSentMessage = {
  sender: Address;
  content: string;
  sentAt: Date;
  index: TmpMessageIndex;
  transactionHash: TransactionHash;
};

export type Conversation = ConversationSdk & {
  members: Pagination<Address>;
  messages: Pagination<ReceivedMessage | TmpSentMessage>;
};

export type GroupConversationConfig = {
  name: string;
  isOnlyCreatorAllowedToAddMembers: boolean;
  isEncrypted: boolean;
  members: Address[];
};

// Utility function to check if index matches the TmpMessageIndex pattern
export function isTmpMessageIndex(index: bigint | string): boolean {
  return typeof index === 'string' && index.startsWith('tmp-');
}
