import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogsDirectory = path.join(process.cwd(), 'content/blogs');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  author: string;
  tags: string[];
  content: string;
}

export interface BlogMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  author: string;
  tags: string[];
}

// Get all blog slugs
export function getAllBlogSlugs(): string[] {
  const fileNames = fs.readdirSync(blogsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

// Get blog post by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(blogsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse frontmatter
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    image: data.image,
    author: data.author || 'SmartToolsHub Team',
    tags: data.tags || [],
    content: contentHtml,
  };
}

// Get all blog posts metadata
export function getAllBlogMetadata(): BlogMetadata[] {
  const slugs = getAllBlogSlugs();
  const blogs = slugs.map(slug => {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      image: data.image,
      author: data.author || 'SmartToolsHub Team',
      tags: data.tags || [],
    };
  });

  // Sort by date (newest first)
  return blogs.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Get recent blog posts
export function getRecentBlogs(limit: number = 5, excludeSlug?: string): BlogMetadata[] {
  const allBlogs = getAllBlogMetadata();
  const filtered = excludeSlug 
    ? allBlogs.filter(blog => blog.slug !== excludeSlug)
    : allBlogs;
  return filtered.slice(0, limit);
}
