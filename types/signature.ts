export interface Signature {
  id: string;
  contractId: string;
  signerName: string;
  signerDocument: string;
  signatureImageUrl: string;
  ip: string;
  userAgent: string;
  language: string;
  timezone: string;
  documentHashAtSigning: string;
  contractVersionAtSigning: number;
  signedAt: Date;
}
