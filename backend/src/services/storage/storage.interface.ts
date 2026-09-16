export interface IStorageService {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrlOrKey: string): Promise<boolean>;
}
