import Link from 'next/link';
import { Shield, Lock, Eye, Bell } from 'lucide-react';
import { PolicySection } from '@/components/ui/PolicySection';
import { PolicyList } from '@/components/ui/PolicyList';

export default function PrivacyPolicy() {
  const effectiveDate = "November 23, 2024";

  return (
    <div className="min-h-screen bg-custom-background dark:bg-custom-darkBg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-custom-text dark:text-custom-darkText mb-4">
            Privacy Policy
          </h1>
          <p className="text-custom-text/60 dark:text-custom-darkText/60">
            Effective Date: {effectiveDate}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-custom-darkBg/50 rounded-2xl p-8 shadow-lg mb-8">
          <p className="text-lg text-custom-text dark:text-custom-darkText leading-relaxed">
            HerAfya values your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and protect your 
            information when you use our app.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          <PolicySection title="1. Information We Collect">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-custom-darkBg/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-tint-light dark:text-tint-dark" />
                  <h3 className="font-semibold text-custom-text dark:text-custom-darkText">
                    Personal Information
                  </h3>
                </div>
                <PolicyList items={[
                  'Name and email address from Google Sign-in',
                  'Profile picture (optional)',
                  'Location data for emergency services'
                ]} />
              </div>

              <div className="bg-white dark:bg-custom-darkBg/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-tint-light dark:text-tint-dark" />
                  <h3 className="font-semibold text-custom-text dark:text-custom-darkText">
                    Health Information
                  </h3>
                </div>
                <PolicyList items={[
                  'Period tracking data',
                  'Pregnancy milestones',
                  'Health-related preferences'
                ]} />
              </div>
            </div>
          </PolicySection>

          <PolicySection title="2. How We Use Your Information">
            <div className="bg-white dark:bg-custom-darkBg/50 rounded-xl p-6">
              <PolicyList items={[
                'To provide personalized health insights and recommendations',
                'To enable support requests and emergency services',
                'To improve app functionality through analytics',
                'To send important notifications and updates'
              ]} />
            </div>
          </PolicySection>

          <PolicySection title="3. Data Security">
            <div className="bg-white dark:bg-custom-darkBg/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-tint-light dark:text-tint-dark" />
                <h3 className="font-semibold text-custom-text dark:text-custom-darkText">
                  Security Measures
                </h3>
              </div>
              <PolicyList items={[
                'End-to-end encryption for sensitive data',
                'Secure cloud storage with regular backups',
                'Regular security audits and updates',
                'Access controls and authentication'
              ]} />
            </div>
          </PolicySection>

          {/* Add more sections as needed */}

          {/* Contact Section */}
          <div className="bg-tint-light/10 dark:bg-tint-dark/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-custom-text dark:text-custom-darkText mb-4">
              Questions about our Privacy Policy?
            </h3>
            <p className="text-custom-text/80 dark:text-custom-darkText/80 mb-6">
              We're here to help! Reach out to our support team.
            </p>
            <Link 
              href="mailto:support@herafya.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-tint-light dark:bg-tint-dark text-white rounded-full hover:opacity-90 transition-opacity"
            >
              <Bell className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-custom-text/10 dark:border-custom-darkText/10">
          <div className="flex justify-between items-center">
            <Link 
              href="/"
              className="text-tint-light dark:text-tint-dark hover:underline"
            >
              ← Back to Home
            </Link>
            <Link 
              href="/terms"
              className="text-tint-light dark:text-tint-dark hover:underline"
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
