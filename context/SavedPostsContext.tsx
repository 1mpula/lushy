import { createContext, ReactNode, useContext, useState } from 'react';

interface SavedPost {
    id: string;
    imageUrl: string;
    title: string;
    providerName: string;
    providerAvatar: string;
    providerId?: string;
    price?: string;
}

interface SavedPostsContextType {
    savedPosts: SavedPost[];
    savePost: (post: SavedPost) => void;
    unsavePost: (postId: string) => void;
    isPostSaved: (postId: string) => boolean;
    toggleSavePost: (post: SavedPost) => void;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export function SavedPostsProvider({ children }: { children: ReactNode }) {
    const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

    const savePost = (post: SavedPost) => {
        setSavedPosts(prev => {
            if (prev.some(p => p.id === post.id)) return prev;
            return [...prev, post];
        });
    };

    const unsavePost = (postId: string) => {
        setSavedPosts(prev => prev.filter(p => p.id !== postId));
    };

    const isPostSaved = (postId: string) => {
        return savedPosts.some(p => p.id === postId);
    };

    const toggleSavePost = (post: SavedPost) => {
        if (isPostSaved(post.id)) {
            unsavePost(post.id);
        } else {
            savePost(post);
        }
    };

    return (
        <SavedPostsContext.Provider value={{ savedPosts, savePost, unsavePost, isPostSaved, toggleSavePost }}>
            {children}
        </SavedPostsContext.Provider>
    );
}

export function useSavedPosts() {
    const context = useContext(SavedPostsContext);
    if (!context) {
        throw new Error('useSavedPosts must be used within a SavedPostsProvider');
    }
    return context;
}
