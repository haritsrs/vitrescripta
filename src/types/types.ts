export interface WritingQuote {
  text: string;
  author: string;
}

export interface FloatingLeafProps {
  count?: number;
  delay?: number;
}

export interface ScripturePost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface FirebasePost {
  key: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string | null;
  userId: string;
  username: string;
  profilePicture: string;
  likes: number;
  likedBy: string[];
  category: 'journal' | 'archive' | 'notes';
  status: 'published' | 'draft';
  excerpt?: string;
}

export interface NewPost {
  title: string;
  category: 'journal' | 'archive' | 'notes';
  content: string;
  excerpt: string;
  imageUrl?: string;
}

export type TabType = 'create' | 'manage' | 'journal' | 'archive';