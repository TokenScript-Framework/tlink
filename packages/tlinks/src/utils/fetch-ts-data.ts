import { buildTsIframeUrl } from './build-ts-ifram-url';

// Input type
type FetchTsDataInput = {
  chainId: number;
  contract: string;
  tokenId?: string;
  entry?: string;
  scriptId?: string;
  hash?: string;
};

// Output type
type FetchTsDataOutput = {
  tokenMetadata: {
    image: string;
    description: string;
    name: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  } | null;
  tsMetadata: {
    name: string;
    meta: {
      description: string | null;
      aboutUrl: string | null;
      iconUrl: string | null;
      imageUrl: string | null;
      backgroundImageUrl: string | null;
    };
    actions: Array<{
      name: string;
      label: string;
      fullScreen: boolean;
    }>;
  };
};

export interface TokenscriptCardMetadata {
  fullScreen: boolean
}

export async function fetchTsData(
  input: FetchTsDataInput,
): Promise<FetchTsDataOutput> {
  const baseUrl = `https://api.smarttokenlabs.com/token-view/${input.chainId}/${input.contract}`;
  const url = new URL(baseUrl);

  if (input.tokenId !== undefined) {
    url.searchParams.append('tokenId', input.tokenId);
  }

  if (input.entry !== undefined) {
    url.searchParams.append('entry', input.entry);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-stl-key':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoibXVsdGktY2hhbm5lbC1yZW5kZXJpbmctdGxpbmsiLCJpYXQiOjE3MjcxNzE1MDl9.9864en0XJbVgzACE_gHrQ00mr6fgctNRXWZ0Nex3DcQ',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export async function fetchTlinkData(input: FetchTsDataInput) {
  const { tokenMetadata, tsMetadata } = await fetchTsData(input);

  return {
    type: 'action',
    icon:
      tokenMetadata?.image ||
      tsMetadata.meta.imageUrl ||
      tsMetadata.meta.iconUrl ||
      '',
    label: tsMetadata?.name,
    title: tsMetadata?.name,
    description: tsMetadata.meta.description || '',
    links: {
      actions: (tsMetadata.actions || []).map(({ name, label, fullScreen }) => ({
        label: label,
        tsMetadata: {
          fullScreen
        },
        href: buildTsIframeUrl({
          chainId: input.chainId.toString(),
          contract: input.contract,
          card: name,
          tokenId: input.tokenId,
          scriptId: input.scriptId,
          hash: input.hash,
        }),
      })),
    },
  };
}

export async function fetchScriptURI(
  input: FetchTsDataInput,
): Promise<string> {
  const baseUrl = `https://api.smarttokenlabs.com/token-view/${input.chainId}/${input.contract}/script-uri`;
  const url = new URL(baseUrl);

  if (input.entry !== undefined) {
    url.searchParams.append('entry', input.entry);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-stl-key':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoibXVsdGktY2hhbm5lbC1yZW5kZXJpbmctdGxpbmsiLCJpYXQiOjE3MjcxNzE1MDl9.9864en0XJbVgzACE_gHrQ00mr6fgctNRXWZ0Nex3DcQ',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.scriptURI;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}
