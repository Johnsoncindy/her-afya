import Image from 'next/image'

export default function Hero() {
    return (
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24 bg-custom-background dark:bg-custom-darkBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight font-bold text-custom-text dark:text-custom-darkText">
                Your Personal
                <span className="text-tint-light dark:text-tint-dark"> Health </span>
                Companion
              </h1>
              <p className="mt-6 text-lg text-custom-text/80 dark:text-custom-darkText/80 max-w-2xl mx-auto lg:mx-0">
                Empowering women through accessible healthcare technology. 
                Track your health, get instant support, and access reliable information.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                <a
                  href="#download"
                  className="px-8 py-3 bg-tint-light text-white rounded-full hover:bg-opacity-90 transition-colors dark:bg-tint-dark"
                >
                  Download Now
                </a>
                <a
                  href="#features"
                  className="px-8 py-3 bg-transparent text-tint-light border border-tint-light rounded-full hover:bg-tint-light/5 transition-colors dark:text-tint-dark dark:border-tint-dark dark:hover:bg-tint-dark/5"
                >
                  Learn More
                </a>
              </div>
            </div>
  
            {/* App Preview */}
            <div className="flex-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/app-preview.png"
                  alt="HerAfya App Preview"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
                {/* Add gradient overlay for dark mode */}
                <div className="absolute inset-0 bg-gradient-to-t from-custom-darkBg/10 to-transparent dark:from-custom-darkBg/30 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
