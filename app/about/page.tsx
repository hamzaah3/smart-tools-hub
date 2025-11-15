import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - SmartToolsHub',
  description: 'Learn about SmartToolsHub and our mission to provide free, secure online tools.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About SmartToolsHub</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          SmartToolsHub is a free collection of online tools designed to make your daily tasks easier, faster, and more efficient.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We believe that everyone should have access to powerful, easy-to-use tools without the need for expensive software or complicated installations. 
          Our mission is to provide a comprehensive suite of free online utilities that help students, professionals, and creators accomplish their goals.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>100% Free:</strong> All tools are completely free to use with no hidden fees</li>
          <li><strong>Privacy First:</strong> Files are processed securely and deleted immediately</li>
          <li><strong>No Registration:</strong> Use all tools without creating an account</li>
          <li><strong>Mobile Friendly:</strong> Works perfectly on phones, tablets, and desktops</li>
          <li><strong>Fast Processing:</strong> Optimized for speed and efficiency</li>
          <li><strong>Regular Updates:</strong> We continuously add new tools and features</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>Privacy:</strong> We never store your files or personal data</li>
          <li><strong>Simplicity:</strong> Clean, intuitive interfaces that anyone can use</li>
          <li><strong>Quality:</strong> Tools that work reliably and produce great results</li>
          <li><strong>Accessibility:</strong> Free access for everyone, everywhere</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Have questions, suggestions, or feedback? We'd love to hear from you!
          Visit our <a href="/contact" className="text-blue-600 hover:underline">contact page</a> to get in touch.
        </p>
      </div>
    </div>
  );
}
