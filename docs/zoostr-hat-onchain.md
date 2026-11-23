# Zoostr hat, made onchain (Optimism)

The Hats website can no longer save hats, so this is one transaction on the Hats contract itself.
It makes two hats at once under 226.1.1.11 (on chain it is still named "Future Project 3", the empty project slot you picked in the Hats app; rename it Zoostr after):

- **226.1.1.11.1 Zoostr Manager** (max 5)
- **226.1.1.11.1.1 Zoostr** (max 10,000, the free supporter hat)

Simulated from zaal.eth on 22 Nov 2026: it succeeds. zaal.eth is an admin of 226.1.1.11.

## Steps
1. Open https://optimistic.etherscan.io/address/0x3bc1A0Ad72417f2d411118085256fC53CBdDd137#writeContract
2. Connect to Web3 with the zaal.eth wallet, on Optimism.
3. Open **batchCreateHats** and paste each box exactly:

| Box | Paste |
|---|---|
| _admins (uint256[]) | `[6092948358158462079222326974471158082366409717431801882451992289214464,6092948358158462079223788476108488985284613402264518165471648221757440]` |
| _details (string[]) | `["Zoostr Manager","Zoostr"]` |
| _maxSupplies (uint32[]) | `[5,10000]` |
| _eligibilityModules (address[]) | `["0x0000000000000000000000000000000000004A75","0x0000000000000000000000000000000000004A75"]` |
| _toggleModules (address[]) | `["0x0000000000000000000000000000000000004A75","0x0000000000000000000000000000000000004A75"]` |
| _mutables (bool[]) | `[true,true]` |
| _imageURIs (string[]) | `["https://raw.githubusercontent.com/ZAODEVZ/zoostr-snap/main/assets/zoostr-logo.png","https://raw.githubusercontent.com/ZAODEVZ/zoostr-snap/main/assets/zoostr-logo.png"]` |

4. Write, sign in the wallet (gas is a few cents on Optimism).

`0x…4A75` is the same "no module" address the Hats app put on the ZAO hats. Both hats stay mutable, so the name can change later (Embers or whatever we pick).

## After it lands
- Hat ids: Zoostr Manager `0x000000e200010001000b0001…`, Zoostr `0x000000e200010001000b00010001…`.
- Next: make the Zoostr hat free to claim from the Zoostr Hearth (a claims module wearing the Manager hat). IMan wires that.
