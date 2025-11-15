import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { BlogLayout } from '@/components/BlogLayout';
import { getBlogBySlug, getAllBlogSlugs, getRecentBlogs } from '@/lib/blog';

interface BlogPostPageProps {
  params:
    | {
        slug: string;
      }
    | Promise<{
    slug: string;
      }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugParam = resolvedParams?.slug;

  if (!slugParam || Array.isArray(slugParam)) {
    console.error('generateMetadata received invalid slug param:', resolvedParams);
    return {
      title: 'Blog Post Not Found',
    };
  }

  try {
    const blog = await getBlogBySlug(slugParam);
    
    return {
      title: `${blog.title} - SmartToolsHub Blog`,
      description: blog.description,
      keywords: blog.tags.join(', '),
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.title,
        description: blog.description,
        type: 'article',
        publishedTime: blog.date,
        authors: [blog.author],
        images: blog.image ? [blog.image] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.description,
        images: blog.image ? [blog.image] : [],
      },
    };
  } catch {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let blog;
  const resolvedParams = await params;
  const slugParam = resolvedParams?.slug;

  if (!slugParam || Array.isArray(slugParam)) {
    console.error('BlogPostPage received invalid slug param:', resolvedParams);
    notFound();
  }

  try {
    blog = await getBlogBySlug(slugParam);
  } catch (error) {
    console.error(`Failed to load blog post "${slugParam}":`, error);
    notFound();
  }

  const recentBlogs = getRecentBlogs(5, slugParam);

  return (
    <BlogLayout>
      {/* JSON-LD Structured Data */}
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.description,
            image: blog.image,
            datePublished: blog.date,
            author: {
              '@type': 'Person',
              name: blog.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartToolsHub',
            },
          }),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Featured Image */}
                {blog.image && (
                  <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="p-8">
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                    {blog.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
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

                  {/* Ad Space before content */}
                  <div className="my-8">
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Ad Space (728x90)</span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div 
                    className="prose dark:prose-invert max-w-none
                      prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                      prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-4 prose-p:leading-relaxed
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                      prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                      prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                      prose-img:rounded-lg prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {/* Ad Space after content */}
                  <div className="my-8">
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Ad Space (728x90)</span>
                    </div>
                  </div>

                  {/* Share & Back */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Blog
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Ad Space in Sidebar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Sidebar Ad (300x250)</span>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentBlogs.map((recentBlog) => (
                    <Link 
                      key={recentBlog.slug}
                      href={`/blog/${recentBlog.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        {recentBlog.image && (
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded">
                            <Image
                              src={recentBlog.image}
                              alt={recentBlog.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                            {recentBlog.title}
                          </h4>
                          <time className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(recentBlog.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Another Ad Space */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Sidebar Ad (300x250)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
