
# BalikBayan
OFW conditional remittance and NFT legacy platform, built on Stellar.

## Problem
A Filipino OFW working in Riyadh sends PHP 20,000 home every month for tuition, electricity, and medicine. Once the money hits the family's GCash — he loses all control. He has no way to ensure funds reach their intended purpose, no tamper-proof record of five years of consistent remittances to show banks or PAG-IBIG, and no rewards for being one of the 10 million OFWs collectively sending PHP 1.6 trillion home every year — nearly 9% of Philippine GDP. Every sacrifice is invisible.

## Solution
BalikBayan lets the OFW lock USDC in a Soroban smart contract escrow tagged to a specific bill — tuition, Meralco, Maynilad, PLDT, hospital, rent, or groceries. Funds are held on-chain and released only when the family submits verified proof of payment, checked by an AI layer powered by the Anthropic API. Every fulfilled promise automatically mints a collectible BalikBayan Box NFT to the OFW's wallet — a permanent, tamper-proof record of sacrifice. As boxes accumulate, the OFW advances through tiers (Common → Silver → Gold → Diamond → Legend) that unlock real merchant discounts for the family back home. Settlement happens in under 5 seconds with fees under PHP 1.

## Demo Flow (2 minutes)
1. Connect Freighter wallet (testnet) as OFW
2. Enter family's Stellar wallet address and bill details (e.g. Meralco, PHP 2,200)
3. Submit — contract locks USDC on-chain, Promise NFT mints to OFW wallet
4. Switch to family wallet — submit receipt photo as proof
5. AI verifies receipt — USDC releases to family wallet instantly
6. BalikBayan Box NFT mints — tier updates in OFW dashboard

<img width="1114" height="722" alt="Screenshot 2026-04-19 at 7 49 49 AM" src="https://github.com/user-attachments/assets/d3c1cc58-c76c-47d6-a26f-757625f5f840" />
<img width="1119" height="732" alt="Screenshot 2026-04-19 at 7 50 25 AM" src="https://github.com/user-attachments/assets/4dfd3af8-5924-46c7-937f-ca11e479ce95" />
<img width="1117" height="722" alt="Screenshot 2026-04-19 at 7 50 43 AM" src="https://github.com/user-attachments/assets/0f9cfe1e-9c89-4184-8d01-b29771eebbb7" />
<img width="1113" height="722" alt="Screenshot 2026-04-19 at 7 52 30 AM" src="https://github.com/user-attachments/assets/d9563b8d-e49d-4211-b9a9-e981469299f4" />
<img width="1115" height="736" alt="Screenshot 2026-04-19 at 7 51 35 AM" src="https://github.com/user-attachments/assets/7d8426f9-f68d-49a0-a769-bfe10a086fb5" />
<img width="1119" height="689" alt="Screenshot 2026-04-19 at 7 53 19 AM" src="https://github.com/user-attachments/assets/4928b580-f28d-4ce2-970f-3e93245f10fd" />
<img width="1119" height="735" alt="Screenshot 2026-04-19 at 7 53 38 AM" src="https://github.com/user-attachments/assets/e3d0bcf8-e666-4fd3-8d61-af231d7ad42d" />
<img width="1117" height="714" alt="Screenshot 2026-04-19 at 7 53 53 AM" src="https://github.com/user-attachments/assets/0687526e-d1a7-49a9-adfa-20c9e8955dda" />
<img width="1118" height="724" alt="Screenshot 2026-04-19 at 7 54 12 AM" src="https://github.com/user-attachments/assets/138b369d-6da8-4e81-bb23-287ae1791064" />

<img width="1244" height="724" alt="Screenshot 2026-04-19 at 8 02 21 AM" src="https://github.com/user-attachments/assets/644b193a-40c7-4453-83ae-3292f9dbfda5" />




## Architecture
```
Browser (React + Vite + TypeScript)
  |-- Freighter Wallet API        (signing and wallet connection)
  |-- @stellar/stellar-sdk        (transaction building, RPC)
  |-- Anthropic API               (AI receipt verification via Claude)
  |-- Soroban RPC                 (on-chain reads and writes)

Stellar Testnet
  |-- BalikBayan Soroban Contract (escrow + NFT box minting logic)
  |-- USDC Token Contract         (SEP-41 token, Circle testnet)
```
No backend server. All escrow and NFT state lives on-chain. The Anthropic API is called from a Vercel serverless function to verify receipt photos before releasing funds.

## Project Structure
```
balikbayan2_stellar/
├── contract/
│   └── contracts/
│       └── hello-world/
│           ├── src/
│           │   ├── lib.rs          # Soroban escrow + NFT contract
│           │   └── test.rs         # Contract tests
│           └── Cargo.toml
├── frontend/
│   ├── api/
│   │   └── verify-receipt.ts       # Vercel serverless — Anthropic receipt check
│   ├── src/
│   │   └── app/
│   │       ├── context/
│   │       │   └── AppContext.tsx  # Global state, wallet, escrow actions
│   │       ├── pages/              # OFWDashboard, FamilyDashboard, SendMoneyWizard
│   │       ├── components/         # NFTBoxCard, TierBadge, BillTypeIcon, etc.
│   │       └── utils/
│   │           ├── contractService.ts  # Contract invocations
│   │           └── sorobanConfig.ts    # RPC + contract IDs
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
└── README.md
```

## Stellar Features Used

| Feature | Usage |
|---|---|
| Soroban smart contracts | Escrow logic — lock, release, dispute, refund + NFT box minting |
| USDC on Stellar | Stablecoin settlement, no XLM volatility for OFW remittances |
| Stellar SDK | Transaction building, address validation, RPC queries |
| Freighter Wallet | OFW and family wallet signing on testnet |
| Soroban RPC | Simulate and submit transactions, read on-chain escrow state |

## Smart Contract

Deployed on Stellar testnet:

```
CDTZLW3TJCJDFJYJST7W74HSI5T57O5WW7XYMTRRWJIGRQSG4U5PMXLP
```

> Explorer: [https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMCTCWSGJQPHGA
](https://stellar.expert/explorer/testnet/contract/CDTZLW3TJCJDFJYJST7W74HSI5T57O5WW7XYMTRRWJIGRQSG4U5PMXLP)
### Contract Functions

| Function | Caller | Description |
|---|---|---|
| `create_escrow(ofw, family, token, amount, bill_type, deadline)` | OFW | Locks USDC in escrow, returns escrow ID |
| `confirm_payment(escrow_id)` | Family | Releases USDC to family wallet, mints BalikBayan Box NFT |
| `claim_refund(escrow_id)` | OFW | Returns USDC to OFW after deadline expires |
| `raise_dispute(escrow_id, caller)` | OFW or Family | Freezes escrow for arbitration |
| `get_escrow(escrow_id)` | Anyone | Read-only escrow state |
| `get_box_count(ofw)` | Anyone | Total NFT boxes minted for an OFW |
| `get_box(ofw, box_number)` | Anyone | Read individual BalikBayan Box metadata |
| `get_tier(ofw)` | Anyone | OFW tier based on box count |

### Escrow Status Lifecycle
```
Active --> Fulfilled  (family calls confirm_payment → NFT mints)
       --> Expired    (OFW calls claim_refund after deadline)
       --> Disputed   (either party calls raise_dispute)
```

### NFT Tier System

| Tier | Boxes Required |
|---|---|
| Common | 0–4 |
| Silver | 5–14 |
| Gold | 15–29 |
| Diamond | 30–49 |
| Legend | 50+ |

## Prerequisites

**For the smart contract:**
- Rust (latest stable)
- Soroban CLI v25+
- Stellar testnet account funded via Friendbot

**For the frontend:**
- Node.js 18+
- Freighter browser extension set to Testnet
- Testnet XLM (for gas) and testnet USDC

## Setup

### Smart Contract
```bash
# Build
soroban contract build

# Test
cargo test

# Deploy to testnet
soroban keys generate --global deployer --network testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source deployer \
  --network testnet
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173.

**Environment variables (`.env`):**
```
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CONTRACT_ID=<deployed contract ID>
VITE_TOKEN_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
ANTHROPIC_API_KEY=<your Anthropic API key>
```

## Sample CLI Invocations

```bash
# Create escrow: OFW locks USDC for family, tagged as tuition
soroban contract invoke \
  --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMCTCWSGJQPHGA \
  --source ofw \
  --network testnet \
  -- create_escrow \
  --ofw <OFW_ADDRESS> \
  --family <FAMILY_ADDRESS> \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 357142857 \
  --bill_type '{"Tuition": []}' \
  --deadline 1717200000

# Family confirms payment (releases USDC + mints NFT box)
soroban contract invoke \
  --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMCTCWSGJQPHGA \
  --source family \
  --network testnet \
  -- confirm_payment \
  --escrow_id 1

# Check escrow state
soroban contract invoke \
  --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMCTCWSGJQPHGA \
  --network testnet \
  -- get_escrow \
  --escrow_id 1

# Check OFW tier
soroban contract invoke \
  --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMCTCWSGJQPHGA \
  --network testnet \
  -- get_tier \
  --ofw <OFW_ADDRESS>
```

## Target Users
Filipino OFWs (10 million strong) sending PHP 1.6 trillion home annually — working in Saudi Arabia, UAE, Hong Kong, Singapore, and beyond. They earn PHP 40,000–120,000/month abroad and send 60–80% home. They have no way to earmark funds, no proof of their remittance history for loan applications, and receive zero recognition for years of sacrifice. BalikBayan gives them control, proof, and rewards — all in one wallet.

## Why Stellar
No other chain gives sub-cent fees with native USDC support at the speed OFW remittances demand. Stellar's 3–5 second finality and sub-PHP-1 fees make this directly competitive against Remitly, Western Union, and GCash padala. The escrow contract is composable — the same pattern works for any conditional payment use case beyond remittances.
