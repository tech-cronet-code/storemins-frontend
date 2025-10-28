export interface UploadedFileResponse {
  id: string;
  token: string;
  diskName: string; 
}

export interface UploadImagePayload {
  formData: FormData;
}
