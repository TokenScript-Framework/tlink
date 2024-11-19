import { isUrlSameOrigin } from '../../shared/index.ts';
import { handleGetTokenScriptAction } from '../../utils/handle-tokenscript.ts';
import { isTokenScriptViewerUrl } from '../../utils/is-tokenscript-viewer-url.ts';
import { proxify, proxifyImage } from '../../utils/proxify.ts';
import type { ActionAdapter } from '../ActionConfig.ts';
import type {
  ActionGetResponse,
  ActionParameterType,
  NextAction,
  NextActionLink,
  NextActionPostRequest,
  PostNextActionLink,
  TypedActionParameter,
} from '../actions-spec.ts';
import {
  type AbstractActionComponent,
  ButtonActionComponent,
  FormActionComponent,
  MultiValueActionComponent,
  SingleValueActionComponent,
} from './action-components/index.ts';
import {
  type ActionSupportStrategy,
  BASELINE_ACTION_VERSION,
  defaultActionSupportStrategy,
} from './action-supportability.ts';
import type {TokenscriptCardMetadata} from "../../utils/fetch-ts-data.ts";

const MULTI_VALUE_TYPES: ActionParameterType[] = ['checkbox'];

interface ActionMetadata {
  version?: string;
}

type ActionChainMetadata =
  | {
      isChained: true;
      isInline: boolean;
    }
  | {
      isChained: false;
    };

export class Action {
  private readonly _actions: AbstractActionComponent[];

  private constructor(
    private readonly _url: string,
    private readonly _data: NextAction,
    private readonly _metadata: ActionMetadata,
    private readonly _supportStrategy: ActionSupportStrategy,
    private _adapter?: ActionAdapter,
    private readonly _chainMetadata: ActionChainMetadata = { isChained: false },
  ) {
    // if no links present or completed, fallback
    if (_data.type === 'completed' || !_data.links?.actions) {
      this._actions = [new ButtonActionComponent(this, _data.label, _url)];
      return;
    }

    const urlObj = new URL(_url);
    this._actions = _data.links.actions.map((action) => {
      const href = action.href.startsWith('http')
        ? action.href
        : urlObj.origin + action.href;

      return componentFactory(this, action.label, href, action.parameters, action.tsMetadata);
    });
  }

  public get isChained() {
    return this._chainMetadata.isChained;
  }

  public get isInline() {
    return this._chainMetadata.isChained ? this._chainMetadata.isInline : false;
  }

  public get type() {
    return this._data.type;
  }

  public get url() {
    return this._url;
  }

  public get icon() {
    if (this._data.icon.startsWith('data:')) {
      return this._data.icon;
    }
    if (this._data.icon.trim() === '') {
      return '';
    }
    return proxifyImage(this._data.icon).toString();
  }

  public get title() {
    return this._data.title;
  }

  public get description() {
    return this._data.description;
  }

  public get disabled() {
    return this._data.disabled ?? false;
  }

  public get actions() {
    return this._actions;
  }

  public get error() {
    return this._data.error?.message ?? null;
  }

  public get metadata(): ActionMetadata {
    return {
      version: this._metadata.version ?? BASELINE_ACTION_VERSION,
    };
  }

  public get adapterUnsafe() {
    return this._adapter;
  }

  public get adapter() {
    if (!this._adapter) {
      throw new Error('No adapter provided');
    }

    return this._adapter;
  }

  public setAdapter(adapter: ActionAdapter) {
    this._adapter = adapter;
  }

  public async isSupported() {
    try {
      return await this._supportStrategy(this);
    } catch (e) {
      console.error(
        `[@tokenscript/tlinks] Failed to check supportability for action ${this.url}`,
      );
      return {
        isSupported: false,
        message:
          'Failed to check supportability, please contact your Tlink client provider.',
      };
    }
  }

  public async chain<N extends NextActionLink>(
    next: N,
    chainData?: N extends PostNextActionLink ? NextActionPostRequest : never,
  ): Promise<Action | null> {
    if (next.type === 'inline') {
      return new Action(
        this.url,
        next.action,
        this.metadata,
        this._supportStrategy,
        this.adapter,
        {
          isChained: true,
          isInline: true,
        },
      );
    }

    const baseUrlObj = new URL(this.url);

    if (!isUrlSameOrigin(baseUrlObj.origin, next.href)) {
      console.error(
        `Chained action is not the same origin as the current action. Original: ${this.url}, chained: ${next.href}`,
      );
      return null;
    }

    const href = next.href.startsWith('http')
      ? next.href
      : baseUrlObj.origin + next.href;

    const proxyUrl = proxify(href);
    const response = await fetch(proxyUrl, {
      method: 'POST',
      body: JSON.stringify(chainData),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch chained action ${proxyUrl}, action url: ${next.href}`,
      );
      return null;
    }

    const data = (await response.json()) as NextAction;
    const metadata = getActionMetadata(response);

    return new Action(
      href,
      data,
      metadata,
      this._supportStrategy,
      this.adapter,
      {
        isChained: true,
        isInline: false,
      },
    );
  }

  // be sure to use this only if the action is valid
  static hydrate(
    url: string,
    data: NextAction,
    metadata: ActionMetadata,
    supportStrategy: ActionSupportStrategy,
    adapter?: ActionAdapter,
  ) {
    return new Action(url, data, metadata, supportStrategy, adapter);
  }

  static async fetch(
    apiUrl: string,
    adapter?: ActionAdapter,
    supportStrategy: ActionSupportStrategy = defaultActionSupportStrategy,
  ) {
    if (isTokenScriptViewerUrl(new URL(apiUrl))) {
      const data = await handleGetTokenScriptAction(new URL(apiUrl));

      return new Action(
        apiUrl,
        { ...data, type: 'action' },
        { version: undefined },
        supportStrategy,
        adapter,
      );
    }

    const proxyUrl = proxify(apiUrl);
    const response = await fetch(proxyUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch action ${proxyUrl}, action url: ${apiUrl}`,
      );
    }

    const data = (await response.json()) as ActionGetResponse;
    const metadata = getActionMetadata(response);

    return new Action(
      apiUrl,
      { ...data, type: 'action' },
      metadata,
      supportStrategy,
      adapter,
    );
  }
}

const getActionMetadata = (response: Response): ActionMetadata => {
  const version = response.headers.get('x-action-version')?.trim();

  return {
    version,
  };
};

const componentFactory = (
  parent: Action,
  label: string,
  href: string,
  parameters?: TypedActionParameter[],
  tsMetadata?: TokenscriptCardMetadata
): AbstractActionComponent => {
  if (!parameters?.length) {
    return new ButtonActionComponent(parent, label, href, undefined, undefined, tsMetadata);
  }

  if (parameters.length > 1) {
    return new FormActionComponent(parent, label, href, parameters);
  }

  const [parameter] = parameters;

  if (!parameter.type) {
    return new SingleValueActionComponent(parent, label, href, parameters);
  }

  if (MULTI_VALUE_TYPES.includes(parameter.type)) {
    return new MultiValueActionComponent(parent, label, href, parameters);
  }

  return new SingleValueActionComponent(parent, label, href, parameters);
};
