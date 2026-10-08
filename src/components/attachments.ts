export type Attachment = {
  key: string;
  name: string;
  mime: string;
  url: string;
  blob: Blob;
  existingId?: string;
};
