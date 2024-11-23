import Link from 'next/link';
import { Users, AlertTriangle, HelpCircle } from 'lucide-react';
import { PolicySection } from '@/components/ui/PolicySection';
import { PolicyList } from '@/components/ui/PolicyList';

export default function Terms() {
  const effectiveDate = "November 23, 2024";

  return (
    <div className="min-h-screen bg-custom-background dark:bg-custom-darkBg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-custom-text dark:text-custom-darkText mb-4">
            Terms of Service
          </h1>
          <p className="text-custom-text/60 dark:text-custom-darkText/60">
            Effective Date: {effectiveDate}
          </p>
        </div>

        {/* Introduction Card */}
        <div className="bg-white dark:bg-custom-darkBg/50 rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-custom-text dark:text-custom-darkText mb-4">
            Welcome to HerAfya!
          </h2>
          <p className="text-lg text-custom-text/80 dark:text-custom-darkText/80 leading-relaxed">
            By using our app, you agree to comply with these Terms of Service. 
            Please read them carefully before proceeding.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          <PolicySection title="1. Use of the App">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-custom-darkBg/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-tint-light dark:text-tint-dark" />
                  <h3 className="font-semibold text-custom-text dark:text-custom-darkText">
                    Eligibility
                  </h3>
                </div>
                <PolicyList items={[
                  'Must be 16 years or older',
                  'Provide accurate information',
                  'Maintain account security'
                ]} />
              </div>

              <div className="bg-white dark:bg-custom-darkBg/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-tint-light dark:text-tint-dark" />
                  <h3 className="font-semibold text-custom-text dark:text-custom-darkText">
                    Prohibited Activities
                  </h3>
                </div>
                <PolicyList items={[
                  'Misuse of app features',
                  'Sharing harmful content',
                  'Fraudulent behavior'
                ]} />
              </div>
            </div>
          </PolicySection>

          {/* Medical Disclaimer */}
          <div className="bg-secondary-light/10 dark:bg-secondary-dark/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-secondary-light dark:text-secondary-dark" />
              <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText">
                Medical Disclaimer
              </h3>
            </div>
            <p className="text-custom-text/80 dark:text-custom-darkText/80 leading-relaxed">
              HerAfya provides general health insights and tools but does not replace 
              professional medical advice. Always consult healthcare providers for 
              medical decisions.
            </p>
          </div>

          {/* Add more sections... */}

          {/* Contact Section */}
          <div className="bg-tint-light/10 dark:bg-tint-dark/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText mb-4">
              Questions about our Terms?
            </h3>
            <p className="text-custom-text/80 dark:text-custom-darkText/80 mb-6">
              Our support team is ready to help clarify any concerns.
            </p>
            <Link 
              href="mailto:herafya93@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-tint-light dark:bg-tint-dark text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-custom-text/10 dark:border-custom-darkText/10">
          <div className="flex justify-between items-center">
            <Link 
              href="/privacy"
              className="text-tint-light dark:text-tint-dark hover:underline"
            >
              ← Privacy Policy
            </Link>
            <Link 
              href="/"
              className="text-tint-light dark:text-tint-dark hover:underline"
            >
              Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
