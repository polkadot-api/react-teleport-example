import React from 'react';
import SmartLink from '../common/SmartLink';
import Logo from '../Logo/index';
import Socials from '../Socials/index';
import { KRAKEN_LINK, GATE_LINK, BASILISK_LINK, COIN_MARKET_LINK, COIN_GECKO_LINK, TRADING_LINK, GOVERNANCE_FOOTER_LINK, SUBSCAN_LINK, INTEGRITEE_NETWORK_LINK, BUGBOUNTY_LINK, TOKENOMICS_LINK, DOCS_LINK, LIGHTPAPER_LINK, HELP_CENTER_LINK, LINKEDIN_LINK, MEDIUM_LINK, REDDIT_LINK, YOUTUBE_LINK, DISCORD_LINK, TWITTER_LINK, TELEGRAM_LINK } from '../../configs/app.config';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0f] pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-12 mb-6 lg:gap-6">
          {/* About Column */}
          <div className="w-full md:w-1/4 flex flex-col">
            <SmartLink to="/" className="block w-48 mb-5">
              <Logo />
            </SmartLink>
            <p className="text-white/70 mb-5 max-w-xs">
              The fastest, most scalable and secure Web3 network bringing the
              vision of a trustless, decentralized future for all.
            </p>
            <Socials />
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-1 flex-wrap gap-8 lg:justify-between">
            {/* TEER Token Column */}
            <div className="min-w-[140px]">
              <h3 className="text-gray-500 mb-6 font-medium">TEER Token</h3>
              <div className="flex flex-col gap-3.5">
                <a href={KRAKEN_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Kraken
                </a>
                <a href={GATE_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Gate.io
                </a>
                <a href={BASILISK_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Basilisk
                </a>
                <a href={COIN_MARKET_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  CoinMarketCap
                </a>
                <a href={COIN_GECKO_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  CoinGecko
                </a>
                <a href={TRADING_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  TradingView
                </a>
              </div>
            </div>

            {/* Network Column */}
            <div className="min-w-[140px]">
              <h3 className="text-gray-500 mb-6 font-medium">Network</h3>
              <div className="flex flex-col gap-3.5">
                <a href={GOVERNANCE_FOOTER_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Governance
                </a>
                <a href={SUBSCAN_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Integritee Subscan
                </a>
                <a href={INTEGRITEE_NETWORK_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Integritee Network
                </a>
                <a href={BUGBOUNTY_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Bug Bounty
                </a>
              </div>
            </div>

            {/* Resources Column */}
            <div className="min-w-[140px]">
              <h3 className="text-gray-500 mb-6 font-medium">Resources</h3>
              <div className="flex flex-col gap-3.5">
                <a href={TOKENOMICS_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Tokenomics
                </a>
                <a href={DOCS_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Documentation
                </a>
                <a href={LIGHTPAPER_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Lightpaper
                </a>
                <a href={HELP_CENTER_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Help Center
                </a>
              </div>
            </div>

            {/* Community Column */}
            <div className="min-w-[140px]">
              <h3 className="text-gray-500 mb-6 font-medium">Community</h3>
              <div className="flex flex-col gap-3.5">
                <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Telegram
                </a>
                <a href={TWITTER_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Twitter
                </a>
                <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Discord
                </a>
                <a href={YOUTUBE_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  YouTube
                </a>
                <a href={MEDIUM_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Medium
                </a>
                <a href={REDDIT_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Reddit
                </a>
              </div>
            </div>

            {/* Company Column */}
            <div className="min-w-[140px]">
              <h3 className="text-gray-500 mb-6 font-medium">Company</h3>
              <div className="flex flex-col gap-3.5">
                <SmartLink to="/about#join" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Jobs
                </SmartLink>
                <SmartLink to="/about#roadmap" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  Roadmap
                </SmartLink>
                <SmartLink to={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#5B92FF] transition-colors">
                  LinkedIn
                </SmartLink>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/20">
          <span className="text-white/70">©{new Date().getFullYear()} Integritee, Inc.</span>
          <SmartLink to="/privacy-policy" className="text-[#5B92FF] hover:text-[#7ca8ff] transition-colors">
            Imprint and Privacy Policy
          </SmartLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
