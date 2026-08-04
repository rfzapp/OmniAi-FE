export interface Attachment {
  id: string;
  name: string;
  size: number;
}

export interface ComposerState {
  webSearchEnabled: boolean;
  reasoningEnabled: boolean;
  attachments: Attachment[];
}
