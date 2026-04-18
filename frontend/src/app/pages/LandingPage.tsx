import { Package, Lock, FileCheck, ArrowRight, Users, DollarSign, Store } from 'lucide-react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function LandingPage() {
  const { connectWallet, setUserRole } = useApp();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleConnect = () => {
    setShowConnectModal(true);
  };

  const confirmConnect = () => {
    connectWallet();
    setShowConnectModal(false);
    setShowRoleModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-to-br from-white via-[#F0F6FF] to-white py-20 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-[#1E293B]">
                Send money home with purpose.
              </h1>
              <p className="text-xl text-[#64748B]">
                Lock funds for tuition, bills, and essentials. Earn collectible BalikBayan boxes. Unlock real rewards for your family.
              </p>
              <div className="flex gap-4">
                <Button onClick={handleConnect}>
                  Connect Wallet
                </Button>
                <Button variant="ghost" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  See How It Works
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-[#2563A0] to-[#60A5FA] rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                  <Package size={128} className="text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold shadow-lg">
                  #001
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1E293B] mb-12">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock size={40} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B]">Lock funds for a purpose</h3>
                <p className="text-[#64748B]">
                  Specify the exact bill or expense. Set conditions for release. Your family knows exactly what it's for.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <FileCheck size={40} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B]">Family proves bill paid</h3>
                <p className="text-[#64748B]">
                  They upload a receipt or proof of payment. Our system verifies it automatically.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                  <ArrowRight size={40} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B]">Money releases automatically</h3>
                <p className="text-[#64748B]">
                  Once verified, funds are released instantly. A collectible BalikBayan box is minted to your wallet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#F0F6FF]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1E293B] mb-12">Built For</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Users size={48} className="text-blue-600" />
                  <h3 className="text-xl font-semibold text-[#1E293B]">OFW Senders</h3>
                  <p className="text-[#64748B]">
                    Send money with confidence knowing it goes exactly where it's needed. Build your legacy with every box.
                  </p>
                  <Button variant="secondary" onClick={handleConnect}>
                    I'm sending money
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <DollarSign size={48} className="text-green-600" />
                  <h3 className="text-xl font-semibold text-[#1E293B]">Family Receivers</h3>
                  <p className="text-[#64748B]">
                    Receive funds for bills and essentials. Unlock tier-based perks and discounts from partner merchants.
                  </p>
                  <Button variant="secondary" onClick={handleConnect}>
                    I'm receiving money
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Store size={48} className="text-purple-600" />
                  <h3 className="text-xl font-semibold text-[#1E293B]">Merchant Partners</h3>
                  <p className="text-[#64748B]">
                    Reach OFW families with exclusive offers. Verify tier status and provide meaningful discounts.
                  </p>
                  <Button variant="secondary" onClick={handleConnect}>
                    Partner with us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#1A3A5C] text-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Every remittance earns a box. Every box builds your legacy.</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold">Common (0-4 boxes)</h4>
                    <p className="text-sm text-gray-300">Start your collection</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold">Silver (5+ boxes)</h4>
                    <p className="text-sm text-gray-300">5% off at partner stores</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold">Gold (12+ boxes)</h4>
                    <p className="text-sm text-gray-300">10% off + priority support</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold">Diamond (24+ boxes)</h4>
                    <p className="text-sm text-gray-300">15% off + exclusive perks</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold">Legend (60+ boxes)</h4>
                    <p className="text-sm text-gray-300">20% off + VIP benefits</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                    <Package size={40} className="text-white/50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#2563A0] mb-2">12,547</div>
              <div className="text-[#64748B]">OFWs Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#2563A0] mb-2">₱2.8B</div>
              <div className="text-[#64748B]">Total Remittances Locked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#2563A0] mb-2">348</div>
              <div className="text-[#64748B]">Partner Merchants</div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 bg-[#F0F6FF] border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Package size={24} className="text-[#2563A0]" />
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E293B]">
                    <span className="text-[#1A3A5C]">Balik</span>
                    <span className="text-[#2563A0]">Bayan</span>
                  </span>
                  <span className="text-xs text-[#64748B]">Every peso sent. Every sacrifice remembered.</span>
                </div>
              </div>

              <div className="flex gap-6 text-sm text-[#64748B]">
                <a href="#" className="hover:text-[#2563A0]">About</a>
                <a href="#" className="hover:text-[#2563A0]">How It Works</a>
                <a href="#" className="hover:text-[#2563A0]">For Merchants</a>
                <a href="#" className="hover:text-[#2563A0]">Privacy</a>
              </div>

              <div className="text-sm text-[#64748B]">
                Built on Stellar
              </div>
            </div>

            <div className="text-center text-sm text-[#64748B] mt-4">
              © 2026 BalikBayan. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-4">Connect your Freighter Wallet</h2>

            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-20 h-20 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <Package size={40} className="text-[#2563A0]" />
              </div>
              <p className="text-center text-[#64748B]">
                Click below to connect your Freighter wallet and start using BalikBayan
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={confirmConnect}>
                Connect
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowConnectModal(false)}>
                Cancel
              </Button>
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-[#2563A0] hover:underline"
              >
                Install Freighter
              </a>
            </div>

            <p className="text-xs text-[#64748B] text-center mt-4">
              Make sure Freighter is set to Testnet
            </p>
          </div>
        </div>
      )}

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
                    <Users size={32} className="text-blue-600" />
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
                    <Users size={32} className="text-green-600" />
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
                    <Store size={32} className="text-purple-600" />
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
