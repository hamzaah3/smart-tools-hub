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
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
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

                <div className="p-8 md:p-12">
                  {/* Category Badge */}
                  {blog.category && (
                    <div className="mb-4">
                      <span className="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  )}

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
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-gray-900 dark:text-white leading-tight tracking-tight">
                    {blog.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <time dateTime={blog.date}>
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{blog.author}</span>
                    </div>
                    {blog.readingTime && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{blog.readingTime}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Ad Space before content */}
                  <div className="my-8">
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Ad Space (728x90)</span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div 
                    className="prose prose-xl dark:prose-invert max-w-none editorial-content
                      prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight
                      prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-10 prose-h1:leading-tight prose-h1:font-black
                      prose-h2:text-[2.5rem] prose-h2:mt-16 prose-h2:mb-8 prose-h2:leading-tight prose-h2:border-b-[3px] prose-h2:border-gray-300 dark:prose-h2:border-gray-600 prose-h2:pb-4 prose-h2:pl-6 prose-h2:font-black
                      prose-h3:text-[2rem] prose-h3:mt-12 prose-h3:mb-6 prose-h3:leading-snug prose-h3:font-black prose-h3:border-b-2 prose-h3:border-gray-200 dark:prose-h3:border-gray-700 prose-h3:pb-3
                      prose-h4:text-[1.75rem] prose-h4:mt-10 prose-h4:mb-5 prose-h4:font-black prose-h4:text-gray-800 dark:prose-h4:text-gray-100
                      prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:mb-6 prose-p:leading-[1.85] prose-p:text-[1.125rem]
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:underline prose-a:decoration-transparent hover:prose-a:decoration-blue-600 prose-a:underline-offset-2 prose-a:transition-all prose-a:text-[1.125rem]
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-black prose-strong:text-[1.125rem]
                      prose-em:italic prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-em:text-[1.125rem]
                      prose-ul:my-6 prose-ul:space-y-3 prose-ul:list-disc prose-ul:pl-6
                      prose-ol:my-6 prose-ol:space-y-3 prose-ol:pl-6
                      prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:leading-[1.85] prose-li:text-[1.125rem] prose-li:pl-2 prose-li:mb-2
                      prose-li::marker:text-blue-600 prose-li::marker:font-black prose-li::marker:text-lg
                      prose-blockquote:border-l-[5px] prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-5 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-blockquote:shadow-md prose-blockquote:text-[1.125rem] prose-blockquote:leading-[1.85]
                      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-[1rem] prose-code:font-mono prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:font-semibold
                      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-8 prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700 prose-pre:text-[1rem]
                      prose-img:rounded-xl prose-img:shadow-xl prose-img:my-10 prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700
                      prose-hr:border-0 prose-hr:border-t-[3px] prose-hr:border-double prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-12
                      prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:border prose-table:border-gray-300 dark:prose-table:border-gray-600 prose-table:shadow-sm prose-table:text-[1.125rem]
                      prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800
                      prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-4 prose-th:text-left prose-th:font-black prose-th:uppercase prose-th:text-[1rem] prose-th:tracking-wide prose-th:border-b-2 prose-th:border-gray-300 dark:prose-th:border-gray-600
                      prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:p-4 prose-td:text-gray-800 dark:prose-td:text-gray-200 prose-td:text-[1.125rem]
                      prose-tr:border-b prose-tr:border-gray-200 dark:prose-tr:border-gray-700
                      first:prose-p:text-[1.25rem] first:prose-p:text-gray-700 dark:first:prose-p:text-gray-300 first:prose-p:leading-[1.85] first:prose-p:font-medium"
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
