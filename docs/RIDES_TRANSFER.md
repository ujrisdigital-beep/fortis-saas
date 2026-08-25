# Car hailing + interim bank/wallet transfer

**Awaiting:** SBN-COMCACHE SLA. This path is **not** card capture and **not** FORTIS escrow.

## Assessment of the legacy module

| Issue | Status |
|---|---|
| Hard-coded demo fleet on `/services/car-hire` | Still marketing UI; live path is `/rides` |
| Bookings accepted `renterId` from the client | Replaced by session on `/api/v2/rides/*` |
| Fake “booking confirmed” with no payment | Replaced: AWAITING_TRANSFER → evidence → PROVISIONAL |
| Escrow claimed without a licensed custodian | Not used on the v2 path |
| Production deny-list on old `/api/car-hire` POSTs | Unchanged (legacy stays blocked) |

## Usable path

1. Owner signs in → `/rides/owner` (profile + vehicle).
2. Client → `/rides`, books a listed vehicle.
3. Server returns amount + unique `FTS-YEAR-######` + operator bank/Wave details.
4. Client transfers, submits evidence (`payer`, channel, txn note, matching amount).
5. Service unlocks as **provisional**. Finance can revoke if the credit never lands.

Same transfer instruction works for GROW/Academy catalogue prices at `/pay/transfer`.

Set `FORTIS_TRANSFER_BANK`, `FORTIS_TRANSFER_ACCOUNT_NAME`, `FORTIS_TRANSFER_ACCOUNT_NUMBER`.
