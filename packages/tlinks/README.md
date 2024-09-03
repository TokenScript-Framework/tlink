- [ ] DEFAULT_SUPPORTED_BLOCKCHAIN_IDS
- [ ] https://proxy.dial.to
- [ ] isInterstitial
- [ ] // TODO: search https://

## Usage

### Style Presets & Overriding Theme

#### Style Presets

`Tlink` component contains a `stylePreset` prop that accepts the following values:

- `default` - [dial.to](https://dial.to)-styled tlink (light)
- `x-dark` - [X](https://x.com/)-styled tlink (dark)
- `x-light` - [X](https://x.com/)-styled tlink (light)
- `custom` - clean slate, no colors, radii at all, use CSS Variables to style. See [Overriding Theme](#overriding-theme).

```tsx
import '@repo/tlinks/index.css';
import { Tlink } from "@repo/tlinks";

<Tlink stylePreset="x-dark" ... />
```

#### Overriding Theme

In your CSS, you can override the following CSS Variables to customize the look of the tlink:

```css
/* x-dark */
.tlink.x-dark {
  --tlink-bg-primary: #202327;
  --tlink-button: #1d9bf0;
  --tlink-button-disabled: #2f3336;
  --tlink-button-hover: #3087da;
  --tlink-button-success: #00ae661a;
  --tlink-icon-error: #ff6565;
  --tlink-icon-error-hover: #ff7a7a;
  --tlink-icon-primary: #6e767d;
  --tlink-icon-primary-hover: #949ca4;
  --tlink-icon-warning: #ffb545;
  --tlink-icon-warning-hover: #ffc875;
  --tlink-input-bg: #202327;
  --tlink-input-stroke: #3d4144;
  --tlink-input-stroke-disabled: #2f3336;
  --tlink-input-stroke-error: #ff6565;
  --tlink-input-stroke-hover: #6e767d;
  --tlink-input-stroke-selected: #1d9bf0;
  --tlink-stroke-error: #ff6565;
  --tlink-stroke-primary: #1d9bf0;
  --tlink-stroke-secondary: #3d4144;
  --tlink-stroke-warning: #ffb545;
  --tlink-text-brand: #35aeff;
  --tlink-text-button: #ffffff;
  --tlink-text-button-disabled: #768088;
  --tlink-text-button-success: #12dc88;
  --tlink-text-error: #ff6565;
  --tlink-text-error-hover: #ff7a7a;
  --tlink-text-input: #ffffff;
  --tlink-text-input-disabled: #566470;
  --tlink-text-input-placeholder: #6e767d;
  --tlink-text-link: #6e767d;
  --tlink-text-link-hover: #949ca4;
  --tlink-text-primary: #ffffff;
  --tlink-text-secondary: #949ca4;
  --tlink-text-success: #12dc88;
  --tlink-text-warning: #ffb545;
  --tlink-text-warning-hover: #ffc875;
  --tlink-transparent-error: #aa00001a;
  --tlink-transparent-grey: #6e767d1a;
  --tlink-transparent-warning: #a966001a;

  --tlink-border-radius-rounded-lg: 0.25rem;
  --tlink-border-radius-rounded-xl: 0.5rem;
  --tlink-border-radius-rounded-2xl: 1.125rem;
  --tlink-border-radius-rounded-button: 624.9375rem;
  --tlink-border-radius-rounded-input: 624.9375rem;

  /* box-shadow */
  --tlink-shadow-container: 0px 2px 8px 0px rgba(59, 176, 255, 0.22),
    0px 1px 48px 0px rgba(29, 155, 240, 0.24);
}
```

> be sure to import these overrides after @repo/tlinks styles (or by [CSS Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) as suggested above)

### Chrome Extension

Package provides an entrypoint function with styled for X Tlink components

```ts
// contentScript.ts
import { setupTwitterObserver } from "@repo/tlinks/ext/twitter";
import { ActionConfig } from "@repo/tlinks";

setupTwitterObserver(new ActionConfig({
  metadata: {
    supportedBlockchainIds: [BlockchainIds.SOLANA_MAINNET]
  },
  connect: async () => { ... },
  signTransaction: async (payload: TransactionPayload) => { ... }
}))

// or

import { type ActionAdapter } from "@repo/tlinks";

class MyActionAdapter implements ActionAdapter {
  async connect() { ... }
  async signTransaction(payload: TransactionPayload) { ... }
  get metadata(): ActionAdapterMetadata {
    return {
      supportedBlockchainIds: [BlockchainIds.SOLANA_MAINNET],
    };
  }
}

setupTwitterObserver(new MyActionAdapter());
```

#### Manifest

```json
  "content_scripts": [
    {
      "matches": ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"],
      "js": ["src/contentScript.ts"],
    }
  ]
```

## Learn More:

- [Join our Discord](https://discord.gg/saydialect) - join the community and ask us a question
