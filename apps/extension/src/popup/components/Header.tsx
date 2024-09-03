import { TokenScriptWebsite } from '../../constant';
import CircleInfoIcon from '../icons/CircleInfoIcon';

export const Header = () => {
  return (
    <div className="flex justify-center items-center py-[18px]">
      <h1 className="text-highlight font-bold mb-2">TLinks</h1>
      <button
        className="absolute right-4 top-4 text-icon-secondary hover:text-icon-primary"
        onClick={() => chrome.tabs.create({ url: TokenScriptWebsite })}
      >
        <CircleInfoIcon />
      </button>
    </div>
  );
};
