import { FormEvent, useState } from 'react';
import { WebsiteSelector } from './WebsiteSelector';
import type { Website } from '../types';

interface Props {
  onLogin: (website: string, email: string, password: string) => void;
  loading: boolean;
}

const WEBSITES: Website[] = [
  { 
    id: 'fo1', 
    name: 'fo1.altius.finance', 
    defaultEmail: 'fo1_test_user@whatever.com', 
    defaultPassword: 'Test123!' 
  },
  { 
    id: 'fo2', 
    name: 'fo2.altius.finance', 
    defaultEmail: 'fo2_test_user@whatever.com', 
    defaultPassword: 'Test223!' 
  },
];

export const LoginForm = ({ onLogin, loading }: Props) => {
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleWebsiteChange = (websiteId: string) => {
    setWebsite(websiteId);
    const site = WEBSITES.find(w => w.id === websiteId);
    if (site) {
      setEmail(site.defaultEmail);
      setPassword(site.defaultPassword);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (website && email && password) {
      onLogin(website, email, password);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl p-10 shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h1>
      <p className="text-center text-gray-500 mb-8 text-sm">Sign in to access your deals</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <WebsiteSelector
          websites={WEBSITES}
          selectedWebsite={website}
          onSelect={handleWebsiteChange}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block font-semibold text-gray-700 text-sm">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email"
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="block font-semibold text-gray-700 text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your password"
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !website}
          className="w-full py-3 px-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all mt-2 hover:-translate-y-0.5 hover:shadow-[0_0.3125rem_0.9375rem_rgba(102,126,234,0.4)] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
