import { Upload, Camera, Type, QrCode, Store, X, Copy, ExternalLink } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusChip } from '../components/StatusChip';
import { BillTypeIcon, getBillTypeLabel } from '../components/BillTypeIcon';
import { TierBadge } from '../components/TierBadge';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { useToast } from '../components/Toast';
import { copyToClipboard } from '../utils/clipboard';

export function FamilyDashboard() {
  const { escrows: promises, updateEscrow: updatePromise, addNFTBox, nftBoxes, currentTier, walletAddress } = useApp();
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedPromiseId, setSelectedPromiseId] = useState<string | null>(null);
  const [selectedPromiseForDetails, setSelectedPromiseForDetails] = useState<typeof promises[0] | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'photo' | 'qr' | 'manual'>('photo');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTierQR, setShowTierQR] = useState(false);
  const { showToast } = useToast();

  const familyPromises = promises.filter(p => p.status !== 'fulfilled');

  const handleSubmitProof = (promiseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPromiseId(promiseId);
    setShowProofModal(true);
  };

  const handleViewDetails = (promise: typeof promises[0]) => {
    setSelectedPromiseForDetails(promise);
  };

  const handleCopyAddress = async (address: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      showToast('success', 'Copied to clipboard');
    } else {
      showToast('error', 'Failed to copy. Please select and copy manually.');
    }
  };

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    return `${days} ${days === 1 ? 'day' : 'days'} left`;
  };

  const handleVerifyProof = () => {
    setIsVerifying(true);

    setTimeout(() => {
      if (selectedPromiseId) {
        updatePromise(selectedPromiseId, { status: 'fulfilled' });

        const promise = promises.find(p => p.id === selectedPromiseId);
        if (promise) {
          const newBox = {
            id: Math.random().toString(36).substr(2, 9),
            boxNumber: nftBoxes.length + 1,
            amount: promise.amount,
            date: new Date().toLocaleDateString(),
            tier: 'common' as const,
            billType: promise.billType,
            transactionHash: 'TX' + Math.random().toString(36).substr(2, 16).toUpperCase(),
            countryFlag: '🇵🇭'
          };
          addNFTBox(newBox);
        }

        showToast('success', 'Receipt verified! Funds are being released to your account.');
      }

      setIsVerifying(false);
      setShowProofModal(false);
      setSelectedPromiseId(null);
    }, 2000);
  };

  const tierPerks = [
    { merchant: 'SM Supermarket', discount: '5% off on all purchases', tier: 'silver', locked: currentTier === 'common' },
    { merchant: 'Jollibee', discount: '10% off on family meals', tier: 'gold', locked: currentTier === 'common' || currentTier === 'silver' },
    { merchant: 'Mercury Drug', discount: '15% off on medicines', tier: 'diamond', locked: currentTier !== 'diamond' && currentTier !== 'legend' },
    { merchant: 'National Bookstore', discount: '20% off on school supplies', tier: 'legend', locked: currentTier !== 'legend' }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">Family Dashboard</h1>

        <div className={`
          rounded-lg p-6 text-white
          ${currentTier === 'legend' ? 'bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500' :
            currentTier === 'diamond' ? 'bg-blue-500' :
            currentTier === 'gold' ? 'bg-yellow-500' :
            currentTier === 'silver' ? 'bg-gray-400' :
            'bg-gray-500'}
        `}>
          <div className="flex justify-between items-center">
            <div>
              <TierBadge tier={currentTier} />
              <p className="mt-2 text-lg">
                {currentTier === 'legend' ? 'You\'ve reached Legend status! Enjoy VIP benefits!' :
                 currentTier === 'diamond' ? 'Show this at partner merchants for 15% off' :
                 currentTier === 'gold' ? 'Show this at partner merchants for 10% off' :
                 currentTier === 'silver' ? 'Show this at partner merchants for 5% off' :
                 'Complete 5 promises to reach Silver Tier'}
              </p>
            </div>
            {currentTier !== 'common' && (
              <Button
                onClick={() => setShowTierQR(true)}
                className="bg-white text-[#1A3A5C] hover:bg-gray-100"
              >
                <QrCode size={20} className="mr-2" />
                Show My Tier
              </Button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Bills to Confirm</h2>

          {familyPromises.length === 0 ? (
            <Card>
              <EmptyState
                title="No bills to confirm"
                description="When your family sends money, bills will appear here for you to confirm"
              />
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {familyPromises.map(promise => (
                <Card key={promise.id} hoverable onClick={() => handleViewDetails(promise)}>
                  <div className="flex items-start gap-4">
                    <BillTypeIcon type={promise.billType} />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#1E293B]">
                            {getBillTypeLabel(promise.billType)}
                            {promise.billDetails.provider && ` - ${promise.billDetails.provider}`}
                          </h3>
                          <p className="text-sm text-[#64748B]">{getDaysLeft(promise.deadline)}</p>
                        </div>
                        <StatusChip status={promise.status} />
                      </div>
                      <p className="text-2xl font-mono font-bold text-[#1E293B]">
                        ₱{promise.amount.toLocaleString()}
                      </p>

                      {promise.status === 'locked' && (
                        <Button
                          onClick={(e) => handleSubmitProof(promise.id, e)}
                          className="w-full mt-3"
                        >
                          Submit Proof
                        </Button>
                      )}

                      {promise.status === 'pending' && (
                        <div className="flex items-center gap-2 text-[#60A5FA] mt-3">
                          <div className="w-4 h-4 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Verification in progress...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Your Current Perks</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {tierPerks.map((perk, idx) => (
              <Card key={idx} className={perk.locked ? 'opacity-50' : ''} hoverable={!perk.locked}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Store size={32} className="text-gray-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-[#1E293B]">{perk.merchant}</h3>
                    <p className="text-[#64748B]">{perk.discount}</p>
                    {perk.locked ? (
                      <p className="text-sm text-[#F59E0B]">Reach {perk.tier.charAt(0).toUpperCase() + perk.tier.slice(1)} Tier to unlock</p>
                    ) : (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setShowTierQR(true)}
                      >
                        Show QR Code
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedPromiseForDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedPromiseForDetails(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <BillTypeIcon type={selectedPromiseForDetails.billType} size={32} />
                <div>
                  <h2 className="text-2xl font-bold text-[#1E293B]">{getBillTypeLabel(selectedPromiseForDetails.billType)} Promise</h2>
                  <p className="text-[#64748B]">From OFW Sender</p>
                </div>
              </div>
              <button onClick={() => setSelectedPromiseForDetails(null)} className="text-[#64748B] hover:text-[#1E293B]">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#F0F6FF] rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Amount</span>
                  <span className="text-3xl font-mono font-bold text-[#1E293B]">₱{selectedPromiseForDetails.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Status</span>
                  <StatusChip status={selectedPromiseForDetails.status} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Deadline</p>
                  <p className="font-semibold text-[#1E293B]">{new Date(selectedPromiseForDetails.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Created</p>
                  <p className="font-semibold text-[#1E293B]">{new Date(selectedPromiseForDetails.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Time Left</p>
                  <p className="font-semibold text-[#1E293B]">{getDaysLeft(selectedPromiseForDetails.deadline)}</p>
                </div>
              </div>

              {Object.keys(selectedPromiseForDetails.billDetails).length > 0 && (
                <div>
                  <p className="text-sm text-[#64748B] mb-2">Bill Details</p>
                  <div className="bg-[#F0F6FF] p-4 rounded-lg space-y-2">
                    {Object.entries(selectedPromiseForDetails.billDetails).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[#64748B] capitalize">{key}</span>
                        <span className="font-semibold text-[#1E293B]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPromiseForDetails.status === 'locked' && (
                <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                  <Button
                    onClick={(e) => {
                      setSelectedPromiseForDetails(null);
                      handleSubmitProof(selectedPromiseForDetails.id, e);
                    }}
                    className="flex-1"
                  >
                    Submit Proof
                  </Button>
                </div>
              )}

              {selectedPromiseForDetails.status === 'pending' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-[#60A5FA] mb-2">
                    <div className="w-4 h-4 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold">Verification in progress...</span>
                  </div>
                  <p className="text-sm text-[#64748B]">Your receipt is being verified. Funds will be released once verification is complete.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-6">
              Prove {selectedPromiseId && promises.find(p => p.id === selectedPromiseId)?.billType} was paid
            </h2>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setUploadMethod('photo')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  uploadMethod === 'photo' ? 'border-[#2563A0] bg-[#F0F6FF]' : 'border-[#E2E8F0]'
                }`}
              >
                <Upload size={20} className="mx-auto mb-1" />
                <span className="text-sm">Upload Receipt Photo</span>
              </button>
              <button
                onClick={() => setUploadMethod('qr')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  uploadMethod === 'qr' ? 'border-[#2563A0] bg-[#F0F6FF]' : 'border-[#E2E8F0]'
                }`}
              >
                <QrCode size={20} className="mx-auto mb-1" />
                <span className="text-sm">Scan QR Code</span>
              </button>
              <button
                onClick={() => setUploadMethod('manual')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  uploadMethod === 'manual' ? 'border-[#2563A0] bg-[#F0F6FF]' : 'border-[#E2E8F0]'
                }`}
              >
                <Type size={20} className="mx-auto mb-1" />
                <span className="text-sm">Type Details</span>
              </button>
            </div>

            {uploadMethod === 'photo' && (
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-12 text-center hover:border-[#2563A0] transition-colors cursor-pointer">
                <Upload size={48} className="mx-auto text-[#64748B] mb-4" />
                <p className="text-[#1E293B] font-medium mb-2">Drop receipt photo here or click to upload</p>
                <p className="text-sm text-[#64748B]">PNG, JPG up to 10MB</p>
              </div>
            )}

            {uploadMethod === 'qr' && (
              <div className="border-2 border-[#E2E8F0] rounded-lg p-12 text-center">
                <Camera size={48} className="mx-auto text-[#64748B] mb-4" />
                <p className="text-[#1E293B] font-medium mb-2">Open camera to scan QR code</p>
                <Button>Open Camera</Button>
              </div>
            )}

            {uploadMethod === 'manual' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Account Number"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Amount Paid"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleVerifyProof}
                loading={isVerifying}
                className="flex-1"
              >
                Submit Proof
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowProofModal(false);
                  setSelectedPromiseId(null);
                }}
                disabled={isVerifying}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTierQR && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowTierQR(false)}>
          <div className="bg-white rounded-lg max-w-md w-full p-8 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#1E293B]">My Tier Badge</h2>
              <button onClick={() => setShowTierQR(false)} className="text-[#64748B] hover:text-[#1E293B]">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[#64748B] mb-4">Show this QR code at partner merchants to get your discount</p>

                <div className={`
                  mx-auto w-64 h-64 rounded-2xl flex flex-col items-center justify-center
                  ${currentTier === 'legend' ? 'bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200' :
                    currentTier === 'diamond' ? 'bg-blue-100' :
                    currentTier === 'gold' ? 'bg-yellow-100' :
                    'bg-gray-200'}
                `}>
                  <QrCode size={120} className="text-[#1A3A5C] mb-4" />
                  <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                    <TierBadge tier={currentTier} />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#F0F6FF] rounded-lg">
                  <p className="text-sm text-[#64748B] mb-1">Wallet Address</p>
                  <p className="font-mono text-sm text-[#1E293B] break-all">{walletAddress}</p>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-800">
                    {currentTier === 'legend' ? '20% Discount' :
                     currentTier === 'diamond' ? '15% Discount' :
                     currentTier === 'gold' ? '10% Discount' :
                     '5% Discount'}
                  </p>
                  <p className="text-sm text-green-700">Valid at all partner merchants</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    showToast('success', 'QR code saved to your device!');
                  }}
                  className="flex-1"
                >
                  Save QR Code
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowTierQR(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>

              <p className="text-xs text-center text-[#64748B]">
                This QR code contains your wallet address and tier information for merchant verification
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
