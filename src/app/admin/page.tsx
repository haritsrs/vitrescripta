"use client";

import React, { useState, useEffect } from 'react';
import { Wind, Feather, Book, Archive, FileText, Plus, Save, Eye, Edit, Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from "next/legacy/image";
import { getDatabase, ref as databaseRef, push, serverTimestamp, get, update, remove } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { FirebasePost, NewPost, TabType  } from '../../types/types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [posts, setPosts] = useState<FirebasePost[]>([]);
  const [newPost, setNewPost] = useState<NewPost>({ title: '', category: 'journal', content: '', excerpt: '' });
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const storage = getStorage();
  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPostsRef = databaseRef(database, 'blog-posts');
        const snapshot = await get(blogPostsRef);
        
        if (snapshot.exists()) {
          const postsData: FirebasePost[] = [];
          snapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            postsData.push({
              key: childSnapshot.key || '',
              ...post,
              category: post.category || 'journal',
              status: post.status || 'published'
            });
          });
          
          postsData.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    };

    fetchPosts();
  }, [database]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setError('You must be logged in to upload images.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      
      if (allowedMimeTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setSelectedImage(file);
        setImageUrl(URL.createObjectURL(file));
      } else {
        setError("Please upload a valid image file (JPG, JPEG, PNG, GIF, SVG).");
        e.target.value = '';
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setImageUrl('');
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!user) return '';

    const imageRef = storageRef(storage, `blog-images/${Date.now()}-${file.name}`);

    try {
      let fileToUpload = file;
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/sharp', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const optimizedImageBlob = await response.blob();
          fileToUpload = new File([optimizedImageBlob], file.name, { type: 'image/jpeg' });
        }
      } catch (error) {
        console.warn('Image optimization failed, uploading original:', error);
      }

      const snapshot = await uploadBytes(imageRef, fileToUpload);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload image. Please try again.');
      setTimeout(() => setError(''), 3000);
      return '';
    }
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>, status: 'published' | 'draft' = 'published'): Promise<void> => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create or edit posts.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Please enter both a title and content for your post.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = '';
      
      if (selectedImage) {
        uploadedImageUrl = await uploadImage(selectedImage);
        if (!uploadedImageUrl) {
          setLoading(false);
          return;
        }
      }

      const blogPostsRef = databaseRef(database, 'blog-posts');
      
      if (editingPost) {
        const postRef = databaseRef(database, `blog-posts/${editingPost}`);
        const existingPost = posts.find(post => post.key === editingPost);
        
        if (existingPost?.imageUrl && uploadedImageUrl) {
          try {
            const oldImageRef = storageRef(storage, existingPost.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.warn('Could not delete old image:', error);
          }
        }
        
        await update(postRef, {
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          excerpt: newPost.excerpt.trim(),
          category: newPost.category,
          status,
          imageUrl: uploadedImageUrl || existingPost?.imageUrl || '',
          updatedAt: serverTimestamp()
        });
        
        setPosts(posts.map(post => post.key === editingPost ? {
          ...post,
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          excerpt: newPost.excerpt.trim(),
          category: newPost.category,
          status,
          imageUrl: uploadedImageUrl || post.imageUrl
        } : post));
      } else {
        const newBlogPost = {
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          excerpt: newPost.excerpt.trim(),
          imageUrl: uploadedImageUrl,
          createdAt: serverTimestamp(),
          userId: user.uid,
          username: user.displayName || user.email || 'Anonymous',
          profilePicture: user.photoURL || '/img/placehold.png',
          category: newPost.category,
          status,
          likes: 0,
          likedBy: []
        };

        const newPostRef = await push(blogPostsRef, newBlogPost);
        
        setPosts([{ key: newPostRef.key || '', ...newBlogPost, createdAt: new Date().toISOString() }, ...posts]);
      }

      setNewPost({ title: '', category: 'journal', content: '', excerpt: '' });
      setEditingPost(null);
      handleDeleteImage();
      
      setError(`Post successfully ${status === 'published' ? 'published' : 'saved as draft'}!`);
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error creating/updating post:', error);
      setError('Failed to save post. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveDraft = async () => {
    await handlePostSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>, 'draft');
  };

  const handleDeletePost = async (key: string) => {
    if (!user) {
      setError('You must be logged in to delete posts.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (confirm('Are you sure you want to delete this post?')) {
      setLoading(true);
      
      try {
        const postToDelete = posts.find(post => post.key === key);
        
        const postRef = databaseRef(database, `blog-posts/${key}`);
        await remove(postRef);
        
        if (postToDelete?.imageUrl) {
          try {
            const imageRef = storageRef(storage, postToDelete.imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.warn('Could not delete image:', error);
          }
        }
        
        setPosts(posts.filter(post => post.key !== key));
        
        setError('Post deleted successfully.');
        setTimeout(() => setError(''), 3000);
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post. Please try again.');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleEditPost = (post: FirebasePost) => {
    setActiveTab('create');
    setNewPost({
      title: post.title,
      category: post.category,
      content: post.content || '',
      excerpt: post.excerpt || ''
    });
    setEditingPost(post.key);
    
    if (post.imageUrl) {
      setImageUrl(post.imageUrl);
    } else {
      setImageUrl('');
    }
  };

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
          0% { transform: translateY(-5vh) translateX(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(105vh) translateX(10px); opacity: 0; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
            <div className="flex gap-4 items-center">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <Image 
                      src={user.photoURL} 
                      width={32} 
                      height={32} 
                      className="rounded-full" 
                      alt="Profile" 
                    />
                  )}
                  <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
                </div>
              ) : (
                <div className="text-sm text-red-500">Not logged in</div>
              )}
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
          {error && (
            <div className={`mb-4 p-3 rounded ${error.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3">
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
                  <p className="mt-2">Published: {posts.filter(p => p.status === 'published').length}</p>
                  <p className="mt-2">Drafts: {posts.filter(p => p.status === 'draft').length}</p>
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="col-span-12 md:col-span-9">
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
                  
                  {!user && (
                    <div className="bg-yellow-50 p-4 mb-6 border-l-4 border-yellow-500 text-yellow-700">
                      You need to be logged in to create or edit posts.
                    </div>
                  )}
                  
                  {previewMode ? (
                    <div className="bg-white p-6 rounded-sm border border-gold-600/10">
                      <h1 className="text-3xl font-light text-gray-900 mb-4">{newPost.title || 'Untitled Post'}</h1>
                      <div className="flex gap-4 text-sm text-gray-600 mb-6">
                        <span>Category: {newPost.category}</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                      
                      {imageUrl && (
                        <div className="mb-6">
                          <Image
                            src={imageUrl}
                            alt={newPost.title}
                            width={600}
                            height={400}
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      
                      <div className="prose max-w-none">
                        {newPost.content || 'No content yet...'}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handlePostSubmit(e, 'published')} className="space-y-6">
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
                          disabled={!user}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Category</label>
                        <select
                          name="category"
                          value={newPost.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gold-600/20 focus:border-gold-600/50 focus:ring-0 bg-white/50 outline-none"
                          disabled={!user}
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
                          disabled={!user}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Featured Image</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gold-600/20 p-2 w-full"
                            disabled={!user}
                          />
                          
                          {imageUrl && (
                            <button
                              type="button"
                              onClick={handleDeleteImage}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded"
                              disabled={!user}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        {imageUrl && (
                          <div className="mt-4">
                            <Image
                              src={imageUrl}
                              alt="Selected"
                              width={300}
                              height={200}
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
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
                          disabled={!user}
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className={`px-6 py-3 flex items-center gap-2 ${user 
                            ? 'bg-gold-600/10 text-gold-600 hover:bg-gold-600/20' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`}
                          disabled={loading || !user}
                        >
                          <Save size={16} />
                          <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
                        </button>
                        
                        {!editingPost && (
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            className={`px-6 py-3 flex items-center gap-2 ${user 
                              ? 'bg-white text-gray-600 hover:bg-gold-600/5' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`}
                            disabled={loading || !user}
                          >
                            <Save size={16} />
                            <span>Save as Draft</span>
                          </button>
                        )}
                        
                        {editingPost && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPost(null);
                              setNewPost({ title: '', category: 'journal', content: '', excerpt: '' });
                              setImageUrl('');
                            }}
                            className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            Cancel Editing
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'manage' && (
                <div className="bg-white/70 backdrop-blur-sm p-6 border-t border-gold-600/10 rounded-sm shadow-sm">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Manage All Posts</h2>
                  
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      No posts found. Create your first post!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {posts.map((post) => (
                        <div 
                          key={post.key} 
                          className="border-b border-gold-600/10 pb-4 grid grid-cols-12 gap-4 items-center"
                        >
                          <div className="col-span-12 md:col-span-6">
                            <h3 className="text-lg text-gray-800">
                              {post.title}
                              {post.status === 'draft' && (
                                <span className="ml-3 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                  Draft
                                </span>
                              )}
                            </h3>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="mr-3">Category: {post.category}</span>
                              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-6 md:col-span-3">
                            <div className="text-sm">
                              <span className="text-gray-600">Likes: {post.likes || 0}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-6 md:col-span-3 flex justify-end gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-2 text-gold-600 hover:bg-gold-600/5 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeletePost(post.key)}
                              className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'journal' && (
                <div className="bg-white/70 backdrop-blur-sm p-6 border-t border-gold-600/10 rounded-sm shadow-sm">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Journal Entries</h2>
                  
                  {posts.filter(post => post.category === 'journal').length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      No journal entries found.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {posts
                        .filter(post => post.category === 'journal')
                        .map((post) => (
                          <div 
                            key={post.key} 
                            className="border-b border-gold-600/10 pb-4 grid grid-cols-12 gap-4 items-center"
                          >
                            <div className="col-span-12 md:col-span-6">
                              <h3 className="text-lg text-gray-800">
                                {post.title}
                                {post.status === 'draft' && (
                                  <span className="ml-3 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                    Draft
                                  </span>
                                )}
                              </h3>
                              <div className="text-sm text-gray-600 mt-1">
                                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                              </div>
                            </div>
                            
                            <div className="col-span-6 md:col-span-3">
                              <div className="text-sm">
                                <span className="text-gray-600">Likes: {post.likes || 0}</span>
                              </div>
                            </div>
                            
                            <div className="col-span-6 md:col-span-3 flex justify-end gap-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="p-2 text-gold-600 hover:bg-gold-600/5 transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              
                              <button
                                onClick={() => handleDeletePost(post.key)}
                                className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                                disabled={loading}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'archive' && (
                <div className="bg-white/70 backdrop-blur-sm p-6 border-t border-gold-600/10 rounded-sm shadow-sm">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Archives</h2>
                  
                  {posts.filter(post => post.category === 'archive').length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      No archived posts found.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {posts
                        .filter(post => post.category === 'archive')
                        .map((post) => (
                          <div 
                            key={post.key} 
                            className="border-b border-gold-600/10 pb-4 grid grid-cols-12 gap-4 items-center"
                          >
                            <div className="col-span-12 md:col-span-6">
                              <h3 className="text-lg text-gray-800">
                                {post.title}
                                {post.status === 'draft' && (
                                  <span className="ml-3 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                    Draft
                                  </span>
                                )}
                              </h3>
                              <div className="text-sm text-gray-600 mt-1">
                                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                              </div>
                            </div>
                            
                            <div className="col-span-6 md:col-span-3">
                              <div className="text-sm">
                                <span className="text-gray-600">Likes: {post.likes || 0}</span>
                              </div>
                            </div>
                            
                            <div className="col-span-6 md:col-span-3 flex justify-end gap-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="p-2 text-gold-600 hover:bg-gold-600/5 transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              
                              <button
                                onClick={() => handleDeletePost(post.key)}
                                className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                                disabled={loading}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;