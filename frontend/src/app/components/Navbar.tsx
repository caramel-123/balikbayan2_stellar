import { Package, User, Bell, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function Navbar() {
  const { walletConnected, walletAddress, walletError, connectWallet, disconnectWallet, userRole, setUserRole } = useApp();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await connectWallet();
    setConnecting(false);
    if (walletAddress) {
      setShowRoleModal(true);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Package size={32} className="text-[#2563A0]" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold">
                  <span className="text-[#1A3A5C]">Balik</span>
                  <span className="text-[#2563A0]">Bayan</span>
                </span>
                <span className="text-xs text-[#64748B] italic">Every peso sent. Every sacrifice remembered.</span>
              </div>
            </div>

            {walletConnected && userRole && (
              <div className="flex items-center gap-2 bg-[#F0F6FF] rounded-lg p-1">
                <button
                  onClick={() => setUserRole('ofw')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'ofw' ? 'bg-[#1A3A5C] text-white' : 'text-[#1E293B] hover:bg-white'
                  }`}
                >
                  OFW View
                </button>
                <button
                  onClick={() => setUserRole('family')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'family' ? 'bg-[#1A3A5C] text-white' : 'text-[#1E293B] hover:bg-white'
                  }`}
                >
                  Family View
                </button>
                <button
                  onClick={() => setUserRole('merchant')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'merchant' ? 'bg-[#1A3A5C] text-white' : 'text-[#1E293B] hover:bg-white'
                  }`}
                >
                  Merchant View
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              {walletConnected && (
                <button className="p-2 hover:bg-[#F0F6FF] rounded-lg transition-colors relative">
                  <Bell size={20} className="text-[#64748B]" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
                </button>
              )}

              {walletConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#2563A0] transition-colors"
                  >
                    <User size={16} />
                    <span className="font-mono text-sm">{walletAddress}</span>
                    <ChevronDown size={16} />
                  </button>

                  {showWalletMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(walletAddress);
                          setShowWalletMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F0F6FF] text-[#1E293B]"
                      >
                        Copy Address
                      </button>
                      <button
                        onClick={() => {
                          setShowRoleModal(true);
                          setShowWalletMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F0F6FF] text-[#1E293B]"
                      >
                        Switch Role
                      </button>
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setShowWalletMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F0F6FF] text-[#EF4444]"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <Button onClick={handleConnect} disabled={connecting}>
                    {connecting ? 'Connecting...' : 'Connect Freighter Wallet'}
                  </Button>
                  {walletError && (
                    <span className="text-xs text-red-500 max-w-xs text-right">{walletError}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-6 text-center">Who are you?</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setUserRole('ofw');
                  setShowRoleModal(false);
                }}
                className="p-6 border-2 border-[#E2E8F0] rounded-lg hover:border-[#2563A0] hover:bg-[#F0F6FF] transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User size={32} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-[#1E293B]">OFW Sender</h3>
                  <p className="text-sm text-[#64748B] text-center">I send money home</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setUserRole('family');
                  setShowRoleModal(false);
                }}
                className="p-6 border-2 border-[#E2E8F0] rounded-lg hover:border-[#2563A0] hover:bg-[#F0F6FF] transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-[#1E293B]">Family Receiver</h3>
                  <p className="text-sm text-[#64748B] text-center">I receive money from abroad</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setUserRole('merchant');
                  setShowRoleModal(false);
                }}
                className="p-6 border-2 border-[#E2E8F0] rounded-lg hover:border-[#2563A0] hover:bg-[#F0F6FF] transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package size={32} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-[#1E293B]">Merchant Partner</h3>
                  <p className="text-sm text-[#64748B] text-center">I offer perks to OFW families</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              className="mt-6 w-full py-2 text-[#64748B] hover:text-[#1E293B]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
