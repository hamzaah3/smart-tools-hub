import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - SmartToolsHub',
  description: 'Terms and conditions for using SmartToolsHub.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing and using SmartToolsHub, you accept and agree to be bound by these Terms of Service.
            If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Use of Services</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">You agree to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Use the tools for lawful purposes only</li>
            <li>Not upload malicious files or content</li>
            <li>Not attempt to overwhelm or attack our servers</li>
            <li>Not violate any applicable laws or regulations</li>
            <li>Respect file size limits and usage guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Service Availability</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We strive to maintain reliable service but cannot guarantee 100% uptime. Services may be temporarily unavailable 
            for maintenance, updates, or due to factors beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. File Processing</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Files are processed temporarily and deleted immediately</li>
            <li>Maximum file sizes apply (25MB for images, 50MB for PDFs)</li>
            <li>We are not responsible for data loss or corruption</li>
            <li>Always keep backups of important files</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Intellectual Property</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You retain all rights to files you upload. We claim no ownership of your content.
            The SmartToolsHub website design, code, and branding are protected by copyright.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Disclaimer of Warranties</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Services are provided "AS IS" without warranties of any kind. We do not guarantee:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Accuracy or quality of results</li>
            <li>Uninterrupted or error-free service</li>
            <li>Specific outcomes or results</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
          <p className="text-gray-700 dark:text-gray-300">
            SmartToolsHub is not liable for any damages arising from use of our services, including but not limited to:
            data loss, business interruption, or any direct or indirect damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Advertising</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our site displays advertisements via Google AdSense. We are not responsible for the content of third-party ads.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. User Content</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            You are solely responsible for any files you upload. Do not upload:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Copyrighted material without permission</li>
            <li>Illegal or harmful content</li>
            <li>Personal information of others without consent</li>
            <li>Malware or malicious code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Termination</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to terminate or suspend access to our services at any time without notice for conduct that 
            violates these terms or is harmful to other users or the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">11. Changes to Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">12. Governing Law</h2>
          <p className="text-gray-700 dark:text-gray-300">
            These terms are governed by applicable laws. Disputes shall be resolved through appropriate legal channels.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">13. Contact</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Questions about these terms? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
