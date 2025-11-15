import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - SmartToolsHub',
  description: 'Learn how SmartToolsHub handles your data and protects your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            SmartToolsHub is designed with privacy in mind. We collect minimal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Files:</strong> Files you upload are processed temporarily and deleted immediately after conversion</li>
            <li><strong>Analytics:</strong> We use Google Analytics to understand how visitors use our site (anonymous data only)</li>
            <li><strong>Cookies:</strong> We use cookies for site functionality and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Process files for conversion (temporary only)</li>
            <li>Improve user experience and site functionality</li>
            <li>Understand traffic patterns (anonymously)</li>
            <li>Display relevant advertisements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. File Storage and Security</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>We do NOT store your files.</strong> All uploaded files are:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Processed in memory or temporary storage</li>
            <li>Automatically deleted immediately after processing</li>
            <li>Never saved to permanent storage</li>
            <li>Never shared with third parties</li>
            <li>Never analyzed for content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Third-Party Services</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Google Analytics:</strong> For anonymous traffic analysis</li>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">These services have their own privacy policies governing their use of information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">We use cookies for:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Remembering your theme preference (light/dark mode)</li>
            <li>Analytics (via Google Analytics)</li>
            <li>Advertising (via Google AdSense)</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">You can disable cookies in your browser settings, though some features may not work properly.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Children's Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our service is not directed to children under 13. We do not knowingly collect information from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Use our tools without providing personal information</li>
            <li>Clear your browser cookies at any time</li>
            <li>Contact us with privacy concerns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Changes to This Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have questions about this privacy policy, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
