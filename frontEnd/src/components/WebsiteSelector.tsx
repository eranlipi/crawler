import type { Website } from '../types';

interface Props {
  websites: Website[];
  selectedWebsite: string;
  onSelect: (websiteId: string) => void;
}

export const WebsiteSelector = ({ websites, selectedWebsite, onSelect }: Props) => {
  return (
    <div className="website-selector">
      <label htmlFor="website">Select Website:</label>
      <select
        id="website"
        value={selectedWebsite}
        onChange={(e) => onSelect(e.target.value)}
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