import crypto from 'crypto';

export interface VaultEntry {
  evidenceId: string;
  hash: string;
  algorithm: 'sha256';
  timestamp: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  metadata: Record<string, unknown>;
  chainIndex: number;
  previousHash: string | null;
}

export interface VaultChain {
  entries: VaultEntry[];
  chainHash: string;
  createdAt: string;
  lastUpdated: string;
}

export interface VerificationResult {
  valid: boolean;
  evidenceId: string;
  originalHash: string;
  currentHash: string;
  tampered: boolean;
  chainIntegrity: boolean;
  timestamp: string;
}

const VAULT_STORE = new Map<string, VaultEntry>();
let chainIndex = 0;
let previousHash: string | null = null;

export class EvidenceVault {
  /**
   * Ingest a file into the chain-of-custody vault.
   * Returns an immutable evidence receipt.
   */
  async ingest(
    file: Buffer,
    metadata: { fileName: string; fileType: string; uploadedBy?: string; caseId?: string; [key: string]: unknown }
  ): Promise<VaultEntry> {
    const hash = crypto.createHash('sha256').update(file).digest('hex');
    const evidenceId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const entry: VaultEntry = {
      evidenceId,
      hash,
      algorithm: 'sha256',
      timestamp,
      fileName: metadata.fileName,
      fileSize: file.length,
      fileType: metadata.fileType,
      metadata: { ...metadata },
      chainIndex: chainIndex++,
      previousHash,
    };

    VAULT_STORE.set(evidenceId, entry);
    previousHash = this.computeChainHash(entry);

    return entry;
  }

  /**
   * Verify a file against the original vault entry.
   */
  async verify(evidenceId: string, file: Buffer): Promise<VerificationResult> {
    const original = VAULT_STORE.get(evidenceId);
    if (!original) {
      throw new Error(`Evidence ID ${evidenceId} not found in vault`);
    }

    const currentHash = crypto.createHash('sha256').update(file).digest('hex');
    const tampered = original.hash !== currentHash;

    return {
      valid: !tampered,
      evidenceId,
      originalHash: original.hash,
      currentHash,
      tampered,
      chainIntegrity: this.verifyChainIntegrity(),
      timestamp: original.timestamp,
    };
  }

  /**
   * Retrieve evidence metadata by ID (does not return the file itself).
   */
  getEntry(evidenceId: string): VaultEntry | null {
    return VAULT_STORE.get(evidenceId) ?? null;
  }

  /**
   * List all vault entries (chain view).
   */
  listChain(): VaultChain {
    const entries = Array.from(VAULT_STORE.values()).sort((a, b) => a.chainIndex - b.chainIndex);
    return {
      entries,
      chainHash: previousHash ?? '',
      createdAt: entries[0]?.timestamp ?? new Date().toISOString(),
      lastUpdated: entries[entries.length - 1]?.timestamp ?? new Date().toISOString(),
    };
  }

  /**
   * Generate a court-admissible custody receipt for a single evidence item.
   */
  generateCustodyReceipt(evidenceId: string): string {
    const entry = VAULT_STORE.get(evidenceId);
    if (!entry) throw new Error(`Evidence ID ${evidenceId} not found`);

    return [
      '═══════════════════════════════════════════════════════════',
      '           UJRIS EVIDENCE CHAIN OF CUSTODY RECEIPT          ',
      '═══════════════════════════════════════════════════════════',
      `Evidence ID    : ${entry.evidenceId}`,
      `File Name      : ${entry.fileName}`,
      `File Type      : ${entry.fileType}`,
      `File Size      : ${(entry.fileSize / 1024).toFixed(2)} KB`,
      `SHA-256 Hash   : ${entry.hash}`,
      `Ingested At    : ${entry.timestamp}`,
      `Chain Position : #${entry.chainIndex + 1}`,
      `Previous Hash  : ${entry.previousHash ?? 'GENESIS (first entry)'}`,
      `Case ID        : ${entry.metadata.caseId ?? 'Not specified'}`,
      `Uploaded By    : ${entry.metadata.uploadedBy ?? 'Not specified'}`,
      '───────────────────────────────────────────────────────────',
      'This receipt confirms the file was ingested into the UJRIS',
      'Evidence Vault at the timestamp shown. The SHA-256 hash',
      'provides cryptographic proof that the file has not been',
      'altered since ingestion. This receipt may be presented to',
      'a Tribunal or Court as evidence of chain of custody.',
      '═══════════════════════════════════════════════════════════',
      `Generated      : ${new Date().toISOString()}`,
      'System         : UJRIS Autonomous Litigation Intelligence',
    ].join('\n');
  }

  private computeChainHash(entry: VaultEntry): string {
    const data = `${entry.evidenceId}:${entry.hash}:${entry.timestamp}:${entry.previousHash ?? ''}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private verifyChainIntegrity(): boolean {
    const entries = Array.from(VAULT_STORE.values()).sort((a, b) => a.chainIndex - b.chainIndex);
    let expectedPrev: string | null = null;
    for (const entry of entries) {
      if (entry.previousHash !== expectedPrev) return false;
      expectedPrev = this.computeChainHash(entry);
    }
    return true;
  }
}

export const evidenceVault = new EvidenceVault();

export function hashFile(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
