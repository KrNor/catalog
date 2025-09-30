export interface ImageUploadSignatureObject {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface ImageUploadInfo {
  apiKey: string;
  cloudName: string;
}
