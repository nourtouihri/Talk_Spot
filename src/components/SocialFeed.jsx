import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { mockUsers } from '../data/mockData'
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Clock,
  Image,
  Link,
  MoreHorizontal
} from 'lucide-react'

const SocialFeed = () => {
  const { user } = useAuth()
  const { posts, addPost, likePost, addComment } = useApp()

  const [newPost, setNewPost] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [link, setLink] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showComments, setShowComments] = useState(null)
  const [commentText, setCommentText] = useState('')

  const approvedPosts = posts.filter(p => p.status === 'approved')

  // Reshare handler
  const handleShare = original => {
    const sharedPost = {
      id: Date.now().toString(),
      authorId: user.id,
      content: original.content,
      status: user.role === 'admin' ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      type: 'share',
      image: original.image || null,
      link: original.link || null,
      parentId: original.id
    }
    addPost(sharedPost)
  }

  const handleSubmitPost = () => {
    if (!newPost.trim() && !imageFile && !link.trim()) return

    const post = {
      id: Date.now().toString(),
      authorId: user.id,
      content: newPost,
      status: user.role === 'admin' ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      type: 'post',
      image: imageFile ? URL.createObjectURL(imageFile) : null,
      link: link.trim() || null
    }
    addPost(post)
    setNewPost('')
    setImageFile(null)
    setLink('')
    setShowLinkInput(false)
  }

  const handleLike = postId => likePost(postId, user.id)

  const handleComment = postId => {
    if (!commentText.trim()) return
    addComment(postId, {
      id: Date.now().toString(),
      authorId: user.id,
      content: commentText,
      createdAt: new Date().toISOString(),
      likes: []
    })
    setCommentText('')
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Social Feed</h2>
        </div>
        <div className="p-6">
          <div className="flex space-x-4">
            <img
              src={user.avatar}
              alt={user.firstName}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                rows={3}
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="
                  w-full p-3 border border-gray-300 rounded-lg resize-none
                  focus:ring-2 focus:ring-[#7fded3] focus:border-[#7fded3]
                "
              />

              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mt-3 w-full h-auto max-h-80 object-contain rounded-lg"
                />
              )}

              {link && (
                <p className="mt-2 text-[#65d6b1] underline break-words">
                  {link}
                </p>
              )}

              {showLinkInput && (
                <input
                  type="url"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  placeholder="Paste a link here..."
                  className="
                    mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                    focus:ring-2 focus:ring-[#7fded3] focus:border-[#7fded3]
                  "
                />
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-1 text-gray-500 hover:text-[#65d6b1] cursor-pointer">
                    <Image className="h-4 w-4" />
                    <span className="text-sm">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => setImageFile(e.target.files[0])}
                    />
                  </label>

                  <button
                    onClick={() => setShowLinkInput(p => !p)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-[#65d6b1]"
                  >
                    <Link className="h-4 w-4" />
                    <span className="text-sm">Link</span>
                  </button>
                </div>

                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() && !imageFile && !link.trim()}
                  className="
                    bg-[#65d6b1] text-white px-4 py-2 rounded-md
                    hover:bg-[#54b89b] disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Post
                </button>
              </div>

              {user.role !== 'admin' && (
                <p className="text-xs text-gray-500 mt-2">
                  Your post will be reviewed by an admin before being published.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {approvedPosts.map(post => {
          const author = mockUsers.find(u => u.id === post.authorId)
          const isLiked = post.likes.includes(user.id)
          const isShare = post.type === 'share'
          // if reshare, find original
          const original = isShare && posts.find(p => p.id === post.parentId)
          const origAuthor = original && mockUsers.find(u => u.id === original.authorId)

          return (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Reshare header */}
              {isShare && origAuthor && (
                <div className="flex items-center space-x-2 px-6 pt-4 text-gray-500 text-sm">
                  <Share2 className="h-4 w-4" />
                  <img
                    src={origAuthor.avatar}
                    alt={origAuthor.firstName}
                    className="h-4 w-4 rounded-full"
                  />
                  <span>Reshared from {origAuthor.firstName}</span>
                </div>
              )}

              {/* Post Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={author.avatar}
                      alt={author.firstName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {author.firstName} {author.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {author.position} • {author.department}
                      </p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-900 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-auto max-h-96 object-contain rounded-lg mb-4"
                  />
                )}
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#65d6b1] underline break-words"
                  >
                    {post.link}
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-3 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`
                      flex items-center space-x-2
                      ${isLiked
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'}
                    `}
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span className="text-sm">{post.likes.length}</span>
                  </button>

                  <button
                    onClick={() =>
                      setShowComments(c => (c === post.id ? null : post.id))
                    }
                    className="flex items-center space-x-2 text-gray-500 hover:text-[#65d6b1]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-[#65d6b1]"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>

              {/* Comments */}
              {showComments === post.id && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-3">
                    {post.comments.map(comment => {
                      const cAuthor = mockUsers.find(u => u.id === comment.authorId)
                      return (
                        <div key={comment.id} className="flex space-x-3">
                          <img
                            src={cAuthor.avatar}
                            alt={cAuthor.firstName}
                            className="h-6 w-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-900">
                                {cAuthor.firstName} {cAuthor.lastName}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                {comment.content}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Add Comment */}
                  <div className="flex items-center space-x-3 mt-4">
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-6 w-6 rounded-full"
                    />
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="
                          flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm
                          focus:ring-2 focus:ring-[#7fded3] focus:border-[#7fded3]
                        "
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        disabled={!commentText.trim()}
                        className="
                          bg-[#65d6b1] text-white px-3 py-2 rounded-md
                          hover:bg-[#54b89b] disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SocialFeed;
