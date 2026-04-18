import { createContext, useContext, useState, ReactNode } from 'react';
import { isConnected, isAllowed, requestAccess, getAddress } from '@stellar/freighter-api';
import { TierType } from '../components/NFTBoxCard';
import { BillType } from '../components/BillTypeIcon';

export type UserRole = 'ofw' | 'family' | 'merchant' | null;

export interface Escrow {
  id: string;
  recipientAddress: string;
  recipientName: string;
  amount: number;
  billType: BillType;
  billDetails: Record<string, string>;
  status: 'locked' | 'pending' | 'fulfilled' | 'expired' | 'disputed';
  deadline: string;
  createdAt: string;
  proofImage?: string;
}

export interface NFTBox {
  id: string;
  boxNumber: number;
  amount: number;
  date: string;
  tier: TierType;
  billType: BillType;
  transactionHash: string;
  countryFlag: string;
}

interface AppContextValue {
  walletConnected: boolean;
  walletAddress: string;
  walletError: string | null;
  userRole: UserRole;
  connectWallet: () => globalThis.Promise<void>;
  disconnectWallet: () => void;
  setUserRole: (role: UserRole) => void;
  escrows: Escrow[];
  addEscrow: (escrow: Escrow) => void;
  updateEscrow: (id: string, updates: Partial<Escrow>) => void;
  nftBoxes: NFTBox[];
  addNFTBox: (box: NFTBox) => void;
  currentTier: TierType;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [nftBoxes, setNFTBoxes] = useState<NFTBox[]>([]);

  const connectWallet = async () => {
    setWalletError(null);
    try {
      const connected = await isConnected();
      if (!connected) {
        setWalletError('Freighter wallet not found. Please install the Freighter extension.');
        return;
      }
      const allowed = await isAllowed();
      if (!allowed) {
        await requestAccess();
      }
      const addressResult = await getAddress();
      if (addressResult.error) {
        setWalletError(addressResult.error.message ?? 'Failed to get wallet address.');
        return;
      }
      setWalletAddress(addressResult.address);
      setWalletConnected(true);
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Failed to connect wallet.');
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletError(null);
    setUserRole(null);
  };

  const addEscrow = (escrow: Escrow) => {
    setEscrows(prev => [...prev, escrow]);
  };

  const updateEscrow = (id: string, updates: Partial<Escrow>) => {
    setEscrows(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const addNFTBox = (box: NFTBox) => {
    setNFTBoxes(prev => [...prev, box]);
  };

  const getCurrentTier = (): TierType => {
    const count = nftBoxes.length;
    if (count >= 60) return 'legend';
    if (count >= 24) return 'diamond';
    if (count >= 12) return 'gold';
    if (count >= 5) return 'silver';
    return 'common';
  };

  return (
    <AppContext.Provider value={{
      walletConnected,
      walletAddress,
      walletError,
      userRole,
      connectWallet,
      disconnectWallet,
      setUserRole,
      escrows,
      addEscrow,
      updateEscrow,
      nftBoxes,
      addNFTBox,
      currentTier: getCurrentTier()
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
