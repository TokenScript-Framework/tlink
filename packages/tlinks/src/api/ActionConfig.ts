import { AbstractActionComponent } from './Action/action-components/index.ts';
import { type Action } from './Action/index.ts';
import type { TransactionPayload } from './actions-spec.ts';

export interface ActionContext {
  originalUrl: string;
  action: Action;
  actionType: 'trusted' | 'malicious' | 'unknown';
  triggeredLinkedAction: AbstractActionComponent;
}

export interface IncomingActionConfig {
  adapter: Pick<
    ActionAdapter,
    | 'connect'
    | 'signTransaction'
    | 'getConnectedAccount'
    | 'interceptHandlePost'
  > &
    Partial<Pick<ActionAdapter, 'metadata'>>;
}

/**
 * Metadata for an action adapter.
 *
 *
 */
export interface ActionAdapterMetadata {}

export interface ActionAdapter {
  metadata: ActionAdapterMetadata;
  connect: (context: ActionContext) => Promise<string | null>;
  getConnectedAccount: () => Promise<string | null>;
  signTransaction: (
    payload: TransactionPayload,
    context: ActionContext,
  ) => Promise<{ signature: string } | { error: string }>;
  interceptHandlePost?: (href: string) => boolean;
}

export class ActionConfig implements ActionAdapter {
  private static readonly DEFAULT_METADATA: ActionAdapterMetadata = {};

  constructor(private adapter: IncomingActionConfig['adapter']) {
    this.adapter = adapter;
  }

  get metadata() {
    return this.adapter.metadata ?? ActionConfig.DEFAULT_METADATA;
  }

  signTransaction(payload: TransactionPayload, context: ActionContext) {
    return this.adapter.signTransaction(payload, context);
  }

  async connect(context: ActionContext) {
    try {
      return await this.adapter.connect(context);
    } catch {
      return null;
    }
  }

  async getConnectedAccount() {
    try {
      return await this.adapter.getConnectedAccount();
    } catch {
      return null;
    }
  }

  interceptHandlePost(href: string) {
    return this.adapter.interceptHandlePost?.(href) ?? false;
  }
}
