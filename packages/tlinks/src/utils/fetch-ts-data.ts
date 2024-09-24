// Input type
type FetchTsDataInput = {
  chainId: number;
  contract: string;
  tokenId: string;
  entry?: string;
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
    actions: string[];
  };
};

export async function fetchTsData(
  input: FetchTsDataInput,
): Promise<FetchTsDataOutput> {
  let url = `https://doobtvjcpb8dc.cloudfront.net/token-view/${input.chainId}/${input.contract}/${input.tokenId}`;

  // Add entry as query string if it's defined
  if (input.entry !== undefined) {
    url += `?entry=${encodeURIComponent(input.entry)}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-stl-key':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoibXVsdGktY2hhbm5lbC1yZW5kZXJpbmciLCJpYXQiOjE3MjcwNzkzODd9.n625mO2j-AyeK0qPIN9izgRVIzC8ERFJ35_DLdtFLBY',
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
    icon: tokenMetadata?.image || tsMetadata.meta.imageUrl || '',
    label: tsMetadata?.name,
    title: tsMetadata?.name,
    description: tsMetadata.meta.description || '',
    links: {
      actions: (tsMetadata.actions || []).map((actionName: string) => ({
        label: camelCaseToWords(actionName),
        href: `/api/tokenscript/${input.chainId}/${input.contract}/${input.tokenId}/${actionName}`,
      })),
    },
  };
}

function camelCaseToWords(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}
