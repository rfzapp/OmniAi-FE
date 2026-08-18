import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Folder {
  id: string;
  name: string;
  chatIds: string[];
  collapsed: boolean;
  createdAt: string;
}

interface FolderState {
  folders: Folder[];
  createFolder: (name: string) => string;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  toggleFolderCollapsed: (id: string) => void;
  addChatToFolder: (folderId: string, chatId: string) => void;
  removeChatFromFolder: (folderId: string, chatId: string) => void;
  removeChatFromAllFolders: (chatId: string) => void;
  getFolderForChat: (chatId: string) => Folder | undefined;
}

export const useFolderStore = create<FolderState>()(
  persist(
    (set, get) => ({
      folders: [],

      createFolder: (name) => {
        const id = `folder-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((state) => ({
          folders: [
            ...state.folders,
            { id, name, chatIds: [], collapsed: false, createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },

      renameFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        })),

      deleteFolder: (id) =>
        set((state) => ({ folders: state.folders.filter((f) => f.id !== id) })),

      toggleFolderCollapsed: (id) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, collapsed: !f.collapsed } : f
          ),
        })),

      addChatToFolder: (folderId, chatId) =>
        set((state) => ({
          folders: state.folders.map((f) => {
            // Remove from other folders first
            if (f.id !== folderId) return { ...f, chatIds: f.chatIds.filter((id) => id !== chatId) };
            if (f.chatIds.includes(chatId)) return f;
            return { ...f, chatIds: [...f.chatIds, chatId] };
          }),
        })),

      removeChatFromFolder: (folderId, chatId) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId ? { ...f, chatIds: f.chatIds.filter((id) => id !== chatId) } : f
          ),
        })),

      removeChatFromAllFolders: (chatId) =>
        set((state) => ({
          folders: state.folders.map((f) => ({
            ...f,
            chatIds: f.chatIds.filter((id) => id !== chatId),
          })),
        })),

      getFolderForChat: (chatId) =>
        get().folders.find((f) => f.chatIds.includes(chatId)),
    }),
    { name: "omniai-folders" },
  ),
);
