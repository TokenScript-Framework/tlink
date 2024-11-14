export const isFarcasterFrameUrl = (actionUrl: URL | string) => {
    return (
      actionUrl.toString().startsWith('https://ff-frame.autographnft.io/') 
    );
  };
