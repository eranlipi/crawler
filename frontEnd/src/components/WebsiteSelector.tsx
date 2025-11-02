import type { Website } from '../types';

interface Props {
  websites: Website[];
  selectedWebsite: string;
  onSelect: (websiteId: string) => void;
}

export const WebsiteSelector = ({ websites, selectedWebsite, onSelect }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="website" className="block font-semibold text-gray-700 text-sm">
        Select Website
      </label>
      <select
        id="website"
        value={selectedWebsite}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 bg-white cursor-pointer"
      >
        <option value="">-- Choose a website --</option>
        {websites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>
    </div>
  );
};
