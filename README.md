```markdown
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

## Architecture
```
Browser (React + Vite + TypeScript)
  |-- Freighter Wallet API       (signing and wallet connection)
  |-- @stellar/stellar-sdk       (transaction building, RPC)
  |-- Anthropic API (Claude)     (AI receipt verification)
  |-- Convex                     (real-time off-chain state sync)
  |-- Soroban RPC                (on-chain reads and writes)

Stellar Testnet
  |-- BalikBayan Soroban Contract (escrow logic, NFT minting, tier system)
  |-- USDC Token Contract         (SEP-41 token)
```
No backend server. All escrow and NFT state lives on-chain. Convex mirrors it for real-time UI updates and activity logs. Anthropic API handles receipt photo verification off-chain and triggers contract release.

## Project Structure
```
balikbayan/
├── contract/
│   └── contracts/
│       └── hello-world/
│           ├── src/
│           │   ├── lib.rs        # Soroban escrow + NFT + tier contract
│           │   └── test.rs       # 5 contract tests
│           └── Cargo.toml
├── BalikBayan_stellar/           # React + Vite frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── stellar.ts        # Contract invocations, balance reads
│   │   │   ├── freighter.ts      # Wallet connect and signing
│   │   │   └── config.ts         # Environment constants
│   │   ├── views/                # Page-level components
│   │   ├── components/           # Shared UI components
│   │   ├── types/                # TypeScript interfaces
│   │   └── styles/               # Global CSS design system
│   └── .env                      # Environment variables
└── README.md
```

## Stellar Features Used

| Feature | Usage |
|---|---|
| Soroban smart contracts | Escrow logic — lock, release, refund, dispute, NFT minting, tier system |
| USDC on Stellar | Stablecoin settlement, no volatility risk during escrow period |
| Trustlines | Family wallet must trust USDC before receiving funds |
| Clawback | Anchor can reverse funds during dispute grace period |
| SEP-24 | Interactive PHP-to-USDC on-ramp via local anchor |
| SEP-10 | Wallet-based authentication with Stellar anchors |

## Smart Contract
Deployed on Stellar testnet:

```
CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743
```

Explorer: https://stellar.expert/explorer/testnet/contract/CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743

## Contract Functions

| Function | Caller | Description |
|---|---|---|
| `create_escrow(ofw, family, token, amount, bill_type, deadline)` | OFW | Locks USDC, returns escrow ID |
| `confirm_payment(escrow_id)` | Family | Releases USDC to family wallet and mints BalikBayan Box NFT |
| `claim_refund(escrow_id)` | OFW | Refunds USDC after deadline passes unfulfilled |
| `raise_dispute(escrow_id, caller)` | OFW or Family | Freezes escrow for arbitration |
| `get_escrow(escrow_id)` | Anyone | Read-only escrow state |
| `get_box_count(ofw)` | Anyone | Returns total NFT boxes collected by OFW |
| `get_box(ofw, box_number)` | Anyone | Returns specific BalikBayan Box NFT metadata |
| `get_tier(ofw)` | Anyone | Returns current tier: Common / Silver / Gold / Diamond / Legend |

## Escrow Status Lifecycle

```
Created --> Fulfilled  (family calls confirm_payment — USDC released, NFT minted)
        --> Expired    (OFW calls claim_refund after deadline)
        --> Disputed   (either party calls raise_dispute — funds frozen)
```

## NFT Tier System

| Tier | Boxes Required | Key Perk |
|---|---|---|
| Common | 1 to 4 | Building remittance history |
| Silver | 5 to 11 | 5% discount at partner pharmacies |
| Gold | 12 to 23 | 10% discount at SM and Robinsons, free family insurance |
| Diamond | 24 to 59 | 15% hospital discount, OWWA priority processing |
| Legend | 60 and above | PAG-IBIG housing loan priority, physical balikbayan box shipped home |

## Supported Bill Types

| Bill Type | Provider Examples |
|---|---|
| Tuition | Any school — UST, PUP, DLSU, UP, Ateneo |
| Electricity | Meralco, VECO, CEPALCO |
| Water | Maynilad, Manila Water |
| Internet and Cable | PLDT, Globe, Converge, Sky |
| Medical | Any hospital or clinic |
| Rent | Any landlord wallet |
| Grocery | Supermarkets and palengke |
| Medicine | Pharmacies |
| Savings | Any bank or GCash savings goal |
| Custom | OFW-defined condition |

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
# Navigate to contract
cd contract/contracts/hello-world

# Run tests
cargo test

# Build
cargo build --target wasm32v1-none --release

# Generate and fund key
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet

# Deploy to testnet
stellar contract deploy \
  --wasm ../../target/wasm32v1-none/release/hello_world.wasm \
  --source my-key \
  --network testnet
```

### Frontend
```bash
cd BalikBayan_stellar
npm install
npm run dev
```
<img width="1248" height="694" alt="Screenshot 2026-04-18 at 1 50 09 PM" src="https://github.com/user-attachments/assets/71a0d5bd-f492-400f-8f32-bba828842e83" />
<img width="1239" height="718" alt="Screenshot 2026-04-18 at 1 50 23 PM" src="https://github.com/user-attachments/assets/b09fa6ae-73d9-4f1a-93ca-173804d8fe47" />
<img width="1251" height="732" alt="Screenshot 2026-04-18 at 1 50 52 PM" src="https://github.com/user-attachments/assets/581048db-ba30-4076-bdae-c5a45dbd4167" />
<img width="812" height="644" alt="Screenshot 2026-04-18 at 1 51 28 PM" src="https://github.com/user-attachments/assets/4e1fbf5d-fcd1-4f26-aa88-e4663bf6f7d6" />
<img width="813" height="590" alt="Screenshot 2026-04-18 at 1 51 46 PM" src="https://github.com/user-attachments/assets/0505d144-4d63-423e-86b9-23ce8019b292" />
<img width="402" height="601" alt="Screenshot 2026-04-18 at 1 52 32 PM" src="https://github.com/user-attachments/assets/bd675386-f156-46ea-8dbd-9443d2055716" />
<img width="553" height="607" alt="Screenshot 2026-04-18 at 1 52 46 PM" src="https://github.com/user-attachments/assets/92c9f3ed-7a5b-4c79-87fa-3c4ad41730e7" />
<img width="466" height="316" alt="Screenshot 2026-04-18 at 1 53 04 PM" src="https://github.com/user-attachments/assets/8118afc0-b71c-4ceb-b620-e16e995c6cc4" />
<img width="902" height="605" alt="Screenshot 2026-04-18 at 1 53 19 PM" src="https://github.com/user-attachments/assets/f2cb14e0-0d23-4877-984c-9243329f121f" />
<img width="478" height="518" alt="Screenshot 2026-04-18 at 1 53 44 PM" src="https://github.com/user-attachments/assets/92109cbf-9aba-4826-aa01-269d8d18ae44" />







App runs at https://balikbayan-26xp25x1q-caramel-123s-projects.vercel.app/

### Environment Variables (.env)
```
VITE_CONTRACT_ID=CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743
VITE_USDC_CONTRACT_ID=<testnet USDC contract ID>
VITE_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_ANTHROPIC_API_KEY=<your Anthropic API key>
```

## Sample CLI Invocations

```bash
# Create escrow: OFW locks USDC for Meralco bill
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --source my-key \
  --network testnet \
  -- create_escrow \
  --ofw <OFW_ADDRESS> \
  --family <FAMILY_ADDRESS> \
  --token <USDC_CONTRACT_ADDRESS> \
  --amount 385000000 \
  --bill_type '{"Electricity": null}' \
  --deadline 1745500000

# Confirm payment (family submits proof, releases USDC, mints NFT box)
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --source family-key \
  --network testnet \
  -- confirm_payment \
  --escrow_id 1

# Claim refund after deadline
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --source my-key \
  --network testnet \
  -- claim_refund \
  --escrow_id 1

# Raise dispute
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --source my-key \
  --network testnet \
  -- raise_dispute \
  --escrow_id 1 \
  --caller <OFW_ADDRESS>

# Check escrow state
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --network testnet \
  -- get_escrow \
  --escrow_id 1

# Check OFW tier
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --network testnet \
  -- get_tier \
  --ofw <OFW_ADDRESS>

# Check box count
stellar contract invoke \
  --id CACPU3QWS5OKFJCFJMNRBLSIMQOA4G3ZPZYPKQMVPLZ6C76TZI5Y6743 \
  --network testnet \
  -- get_box_count \
  --ofw <OFW_ADDRESS>
```
<img width="1251" height="742" alt="Screenshot 2026-04-18 at 1 49 45 PM" src="https://github.com/user-attachments/assets/18037635-2807-4d07-ad5b-5dc3c02d4c9e" />


## Target Users
Filipino Overseas Workers earning PHP 30,000 to 150,000 per month abroad who regularly send money home for essential household expenses. They lose hundreds of pesos per transaction in bank fees, have zero visibility on how funds are used, and have no verifiable proof of their financial consistency to show institutions. Every peso saved on fees is a bill that gets paid. Every box minted is a sacrifice that gets remembered.

## Why Stellar
No other chain gives sub-cent fees with native USDC support and built-in compliance controls that anchors and regulators care about. Stellar's speed of 3 to 5 second finality and cost of less than PHP 1 per transaction makes this directly competitive against bank wire and GCash alternatives. The escrow contract is composable — it can be reused for any conditional payment use case beyond OFW remittance.

## About
Built for the Stellar Philippines UniTour Bootcamp 2026.

## Contributors
- Melfred Bernabe — Polytechnic University of the Philippines — BS Computer Science

## Languages
- Rust — Smart Contract
- TypeScript — Frontend
- CSS — Styling
```
