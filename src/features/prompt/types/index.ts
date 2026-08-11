export interface Attachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  file?: File;
}

export interface ComposerState {
  webSearchEnabled: boolean;
  reasoningEnabled: boolean;
  attachments: Attachment[];
}
