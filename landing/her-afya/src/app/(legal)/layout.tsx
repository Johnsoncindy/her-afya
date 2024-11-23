import Link from 'next/link'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-[#0a7ea4]">
              HerAfya
            </Link>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-[#4A5568] hover:text-[#0a7ea4]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#4A5568] hover:text-[#0a7ea4]">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  )
}
