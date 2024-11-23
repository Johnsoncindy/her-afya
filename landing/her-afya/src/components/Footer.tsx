import Link from 'next/link'

export default function Footer() {
    return (
      <footer className="bg-[#333D43] text-[#ECEDEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">HerAfya</h2>
              <p className="text-[#A0AEC0] mb-4">
                Empowering women through accessible healthcare technology.
              </p>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="hover:text-[#40E0D0]">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-[#40E0D0]">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#40E0D0]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#40E0D0]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@herafya.com" className="hover:text-[#40E0D0]">
                    support@herafya.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-[#4A5568] mt-12 pt-8 text-center text-[#A0AEC0]">
            <p>© {new Date().getFullYear()} HerAfya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  