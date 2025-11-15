import { Metadata } from 'next';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogListing } from '@/components/BlogListing';
import { getAllBlogMetadata } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - SmartToolsHub | Tips, Guides & Tutorials',
  description: 'Learn about online tools, productivity tips, and how to make the most of SmartToolsHub. Free tutorials and guides.',
  openGraph: {
    title: 'Blog - SmartToolsHub',
    description: 'Learn about online tools, productivity tips, and tutorials',
    type: 'website',
  },
};

export default function BlogPage() {
  const blogs = getAllBlogMetadata();

  return (
    <BlogLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tips, tutorials, and insights about online tools and productivity
          </p>
        </div>

        {/* Blog Listing Component */}
        <BlogListing blogs={blogs} />
      </div>
    </BlogLayout>
  );
}
