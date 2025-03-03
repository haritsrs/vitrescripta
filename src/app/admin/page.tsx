"use client";

import React, { useState, useEffect } from 'react';
import { Wind, Feather, Book, Archive, FileText, Plus, Save, Eye, Edit, Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// Define TypeScript interfaces
interface Post {
  id: number;
  title: string;
  category: 'journal' | 'archive' | 'notes';
  status: 'published' | 'draft';
  date: string;
  content?: string;
  excerpt?: string;
}

interface NewPost {
  title: string;
  category: 'journal' | 'archive' | 'notes';
  content: string;
  excerpt: string;
}

type TabType = 'create' | 'manage' | 'journal' | 'archive';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: "The Art of Mindful Writing", category: "journal", status: "published", date: "2024-02-15" },
    { id: 2, title: "Finding Inspiration in Everyday Life", category: "notes", status: "draft", date: "2024-02-28" },
    { id: 3, title: "My Journey as a Writer", category: "archive", status: "published", date: "2024-01-10" },
  ]);
  
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    category: 'journal',
    content: '',
    excerpt: ''
  });
  
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPost({ 
      ...newPost, 
      [name]: value as string 
    });
  };

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost ? 
        { ...post, ...newPost, status: 'published' as const } : post));
      setEditingPost(null);
    } else {
      const newId = Math.max(...posts.map(post => post.id), 0) + 1;
      setPosts([...posts, { 
        id: newId, 
        ...newPost, 
        status: 'published' as const, 
        date: new Date().toISOString().split('T')[0] 
      }]);
    }
    
    setNewPost({
      title: '',
      category: 'journal',
      content: '',
      excerpt: ''
    });
  };
  
  const handleSaveDraft = () => {
    const newId = Math.max(...posts.map(post => post.id), 0) + 1;
    setPosts([...posts, { 
      id: newId, 
      ...newPost, 
      status: 'draft' as const, 
      date: new Date().toISOString().split('T')[0] 
    }]);
    
    setNewPost({
      title: '',
      category: 'journal',
      content: '',
      excerpt: ''
    });
  };
  
  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };
  
  const handleEditPost = (post: Post) => {
    setActiveTab('create');
    setNewPost({
      title: post.title,
      category: post.category,
      content: post.content || '',
      excerpt: post.excerpt || ''
    });
    setEditingPost(post.id);
  };

  // Create the floating leaves elements
  const renderFloatingLeaves = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <div 
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          animationName: 'float',
          animationDuration: `${15 + Math.random() * 10}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDelay: `${i * 1.5}s`,
          top: '-24px'
        }}
      >
        <Feather 
          size={16 + Math.random() * 16} 
          className="text-gold-600/40 animate-spin-slow transform"
        />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative overflow-hidden">
      {/* CSS for Animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(-5vh) translateX(-10px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) translateX(10px);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-50"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2M4YjA3MCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Floating Leaves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {renderFloatingLeaves()}
      </div>

      {/* Gold Banners */}
      <div className="fixed top-0 right-0 w-full h-16 bg-gradient-to-r from-gold-600/5 via-gold-600/10 to-transparent transform -skew-y-6"></div>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-l from-gold-600/5 via-gold-600/10 to-transparent transform skew-y-6"></div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gold-600/10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-light text-gray-900">
              <span className="text-gold-600">Vīgintī Trēs</span> Admin
            </h1>
            <div className="flex gap-4">
              <Link href="/">
                <div className="flex items-center gap-2 text-gray-800 hover:text-gold-600 transition-colors duration-300">
                  <ChevronLeft size={16} />
                  <span>Back to Site</span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-sm border-l-2 border-gold-600/30 sticky top-28">
                <h2 className="text-xl text-gray-800 mb-6 flex items-center gap-2">
                  <Wind className="text-gold-600" size={18} />
                  <span>Admin Panel</span>
                </h2>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === 'create' 
                      ? 'bg-gold-600/10 text-gold-600' 
                      : 'text-gray-700 hover:bg-gold-600/5'}`}
                  >
                    <Plus size={16} />
                    <span>Create New</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === 'manage' 
                      ? 'bg-gold-600/10 text-gold-600' 
                      : 'text-gray-700 hover:bg-gold-600/5'}`}
                  >
                    <FileText size={16} />
                    <span>Manage Posts</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('journal')}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === 'journal' 
                      ? 'bg-gold-600/10 text-gold-600' 
                      : 'text-gray-700 hover:bg-gold-600/5'}`}
                  >
                    <Book size={16} />
                    <span>Journal Entries</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('archive')}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === 'archive' 
                      ? 'bg-gold-600/10 text-gold-600' 
                      : 'text-gray-700 hover:bg-gold-600/5'}`}
                  >
                    <Archive size={16} />
                    <span>Archives</span>
                  </button>
                </nav>
                
                <div className="mt-12 text-sm text-gray-600">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  <p className="mt-2">Total entries: {posts.length}</p>
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="col-span-9">
              {activeTab === 'create' && (
                <div className="bg-white/70 backdrop-blur-sm p-6 border-t border-gold-600/10 rounded-sm shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-4 py-2 flex items-center gap-2 text-gold-600 hover:bg-gold-600/5 transition-colors"
                      >
                        <Eye size={16} />
                        <span>{previewMode ? 'Edit' : 'Preview'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {previewMode ? (
                    <div className="bg-white p-6 rounded-sm border border-gold-600/10">
                      <h1 className="text-3xl font-light text-gray-900 mb-4">{newPost.title || 'Untitled Post'}</h1>
                      <div className="flex gap-4 text-sm text-gray-600 mb-6">
                        <span>Category: {newPost.category}</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="prose max-w-none">
                        {newPost.content || 'No content yet...'}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePostSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={newPost.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gold-600/20 focus:border-gold-600/50 focus:ring-0 bg-white/50 outline-none"
                          placeholder="Enter post title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Category</label>
                        <select
                          name="category"
                          value={newPost.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gold-600/20 focus:border-gold-600/50 focus:ring-0 bg-white/50 outline-none"
                        >
                          <option value="journal">Journal</option>
                          <option value="archive">Archive</option>
                          <option value="notes">Notes</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Excerpt</label>
                        <textarea
                          name="excerpt"
                          value={newPost.excerpt}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gold-600/20 focus:border-gold-600/50 focus:ring-0 bg-white/50 outline-none"
                          placeholder="Brief excerpt or summary"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Content</label>
                        <textarea
                          name="content"
                          value={newPost.content}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gold-600/20 focus:border-gold-600/50 focus:ring-0 bg-white/50 outline-none font-mono"
                          placeholder="Write your content here..."
                          rows={10}
                          required
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gold-600/10 text-gold-600 hover:bg-gold-600/20 transition-colors flex items-center gap-2"
                        >
                          <Save size={16} />
                          <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
                        </button>
                        
                        {!editingPost && (
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            Save as Draft
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}
              
              {activeTab === 'manage' && (
                <div className="bg-white/70 backdrop-blur-sm p-6 border-t border-gold-600/10 rounded-sm shadow-sm">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Manage Posts</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold-600/10">
                          <th className="py-3 px-4 text-left text-sm text-gray-700">Title</th>
                          <th className="py-3 px-4 text-left text-sm text-gray-700">Category</th>
                          <th className="py-3 px-4 text-left text-sm text-gray-700">Date</th>
                          <th className="py-3 px-4 text-left text-sm text-gray-700">Status</th>
                          <th className="py-3 px-4 text-right text-sm text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr key={post.id} className="border-b border-gold-600/5 hover:bg-gold-600/5">
                            <td className="py-3 px-4 text-gray-800">{post.title}</td>
                            <td className="py-3 px-4 text-gray-600">{post.category}</td>
                            <td className="py-3 px-4 text-gray-600">{post.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs ${
                                post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEditPost(post)}
                                  className="p-1 text-gray-600 hover:text-gold-600 transition-colors"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {(activeTab === 'journal' || activeTab === 'archive') && (
                <div className="bg-white/70 backdrop-blur-sm p-6 border-t border-gold-600/10 rounded-sm shadow-sm">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">
                    {activeTab === 'journal' ? 'Journal Entries' : 'Archives'}
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {posts
                      .filter(post => post.category === activeTab)
                      .map(post => (
                        <div key={post.id} className="p-4 border-l-2 border-gold-600/30 hover:bg-gold-600/5">
                          <h3 className="text-xl text-gray-800 mb-2">{post.title}</h3>
                          <div className="flex gap-4 text-sm text-gray-600 mb-3">
                            <span>Date: {post.date}</span>
                            <span>Status: {post.status}</span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            {post.excerpt || 'No excerpt available.'}
                          </p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditPost(post)}
                              className="px-3 py-1 text-sm text-gold-600 hover:bg-gold-600/10 transition-colors flex items-center gap-1"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    
                    {posts.filter(post => post.category === activeTab).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No {activeTab} entries found.</p>
                        <button
                          onClick={() => setActiveTab('create')}
                          className="mt-4 px-4 py-2 bg-gold-600/10 text-gold-600 hover:bg-gold-600/20 transition-colors inline-flex items-center gap-2"
                        >
                          <Plus size={16} />
                          <span>Create New Entry</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-gray-600 text-sm bg-white/50 backdrop-blur-sm mt-12">
          <p>© 2024 · <span className="text-gold-600">Vīgintī Trēs Admin Panel</span></p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;