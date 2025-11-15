'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogMetadata } from '@/lib/blog';

interface BlogListingProps {
  blogs: BlogMetadata[];
}

export function BlogListing({ blogs }: BlogListingProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter blogs based on search term
  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    
    const term = searchTerm.toLowerCase();
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(term) ||
      blog.description.toLowerCase().includes(term) ||
      blog.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [blogs, searchTerm]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No blog posts found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <article 
              key={blog.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Blog Image */}
              <Link href={`/blog/${blog.slug}`}>
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Blog Content */}
              <div className="p-6">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <Link href={`/blog/${blog.slug}`}>
                  <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    {blog.title}
                  </h2>
                </Link>

                {/* Date & Author */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <time dateTime={blog.date}>
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{blog.author}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {blog.description}
                </p>

                {/* Read More Link */}
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
