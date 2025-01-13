'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Team() {
  const founders = [
    {
      name: "Cindy Tetama Johnson",
      role: "Co-Founder & Visionary",
      image: "/images/team/cindy.jpeg",
      bio: "Computer Science student with a deep passion for creating impactful solutions. Inspired by her own experiences and the challenges faced by women globally.",
      socials: {
        twitter: "https://x.com/JohnsonCindyT",
        github: "https://github.com/Johnsoncindy"
      }
    },
    {
      name: "Geitodyu Henrique Crusoe",
      role: "Co-Founder & Lead Developer",
      image: "/images/team/henrique.jpeg",
      bio: "Software & Civil Engineer who combines his expertise in engineering and technology to ensure HerAfya's robust development.",
      socials: {
        linkedin: "https://www.linkedin.com/in/crusoehenrique",
        github: "https://github.com/cruso003"
      }
    },
    {
      name: "George S Mulbah II",
      role: "Co-Founder & Technology Lead",
      image: "/images/team/george.jpeg",
      bio: "Engineering enthusiast and tech instructor with an Associate Degree in Electronics Engineering. Experienced backend developer and startup founder with expertise in computer programming and electronics engineering.",
      socials: {
        github: "https://github.com/sir-george2500",
        linkedin: "https://www.linkedin.com/in/george-s-mulbah-ii-3a571b195"
      }
    }
  ]

    const coreTeam = [
      {
        name: "Danielle Wornee",
        role: "Health Advocacy Lead",
        image: "/images/team/danielle.jpeg",
        bio: "Social Worker and Women's Health Activist dedicated to bridging the gap between healthcare technology and community needs.",
        socials: {
          linkedin: "https://www.linkedin.com/in/danielle-wornee-1a4b4316a"
        }
      }
    ]

    const advisors = [
      {
        name: "Dr. RoseMarie T.T. Crusoe",
        role: "Medical Consultant",
        image: "/images/team/rosemarie.jpeg",
        bio: "Licensed Medical Doctor providing expert healthcare consultation and guidance to ensure HerAfya delivers accurate and reliable medical information.",
        credentials: "MD",
        socials: {
          facebook: "https://web.facebook.com/rosemariegodgeturback.tuopay"
        }
      }
    ]
  
    const teamMembers = [
      { role: "Design", count: 3 },
      { role: "Development", count: 3 },
      { role: "Healthcare", count: 2 },
      { role: "Support", count: 5 }
    ]
    
    return (
      <section id="team" className="py-20  bg-custom-background/80 dark:bg-custom-darkBg/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-tint-light dark:text-tint-dark font-semibold tracking-wider uppercase">
              Our Team
            </span>
            <h2 className="mt-4 text-4xl font-bold text-custom-text dark:text-custom-darkText">
              Meet the Minds Behind HerAfya
            </h2>
            <p className="mt-6 text-xl text-custom-text/70 dark:text-custom-darkText/70 max-w-3xl mx-auto">
              A passionate and diverse team dedicated to empowering women and girls worldwide 
              through innovative technology and impactful solutions.
            </p>
          </motion.div>
  
          {/* Founders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-tint-light to-secondary-light dark:from-tint-dark dark:to-secondary-dark rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-custom-darkBg/50 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-60 h-60 rounded-xl overflow-hidden">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        width={50}
                        className='object-contain'
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-custom-text dark:text-custom-darkText mb-2">
                        {founder.name}
                      </h3>
                      <p className="text-tint-light dark:text-tint-dark font-medium mb-4">
                        {founder.role}
                      </p>
                      <p className="text-custom-text/70 dark:text-custom-darkText/70 mb-6">
                        {founder.bio}
                      </p>
                      <div className="flex gap-4 justify-center md:justify-start">
                        {Object.entries(founder.socials).map(([platform, link]) => (
                          <a
                            key={platform}
                            href={link}
                            className="text-custom-text/50 dark:text-custom-darkText/50 hover:text-tint-light dark:hover:text-tint-dark transition-colors"
                          >
                            <span className="capitalize">{platform}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="text-2xl font-bold text-custom-text dark:text-custom-darkText text-center mb-12">
              Core Team
            </h3>
            <div className="max-w-2xl mx-auto">
              {coreTeam.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-tint-light/80 to-secondary-light/80 dark:from-tint-dark/80 dark:to-secondary-dark/80 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-white dark:bg-custom-darkBg/50 rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="relative w-60 h-60 rounded-xl overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className='object-contain'
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-custom-text dark:text-custom-darkText mb-2">
                          {member.name}
                        </h3>
                        <p className="text-tint-light dark:text-tint-dark font-medium mb-4">
                          {member.role}
                        </p>
                        <p className="text-custom-text/70 dark:text-custom-darkText/70 mb-6">
                          {member.bio}
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                          {Object.entries(member.socials).map(([platform, link]) => (
                            <a
                              key={platform}
                              href={link}
                              className="text-custom-text/50 dark:text-custom-darkText/50 hover:text-tint-light dark:hover:text-tint-dark transition-colors"
                            >
                              <span className="capitalize">{platform}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Medical Advisors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="text-2xl font-bold text-custom-text dark:text-custom-darkText text-center mb-12">
              Medical Advisory Board
            </h3>
            <div className="max-w-2xl mx-auto">
              {advisors.map((advisor, index) => (
                <motion.div
                  key={advisor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-light to-tint-light dark:from-secondary-dark dark:to-tint-dark rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-white dark:bg-custom-darkBg/50 rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="relative w-60 h-60 rounded-xl overflow-hidden">
                        <Image
                          src={advisor.image}
                          alt={advisor.name}
                          fill
                          className='object-contain'
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-custom-text dark:text-custom-darkText mb-2">
                          {advisor.name}, {advisor.credentials}
                        </h3>
                        <p className="text-tint-light dark:text-tint-dark font-medium mb-4">
                          {advisor.role}
                        </p>
                        <p className="text-custom-text/70 dark:text-custom-darkText/70 mb-6">
                          {advisor.bio}
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                          {Object.entries(advisor.socials).map(([platform, link]) => (
                            <a
                              key={platform}
                              href={link}
                              className="text-custom-text/50 dark:text-custom-darkText/50 hover:text-tint-light dark:hover:text-tint-dark transition-colors"
                            >
                              <span className="capitalize">{platform}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
  
          {/* Team Composition */}
          <div className="bg-custom-background/30 dark:bg-custom-darkBg/30 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-custom-text dark:text-custom-darkText text-center mb-12">
              Our Growing Team
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((team, index) => (
                <motion.div
                  key={team.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-tint-light dark:text-tint-dark mb-2">
                    {team.count}
                  </div>
                  <div className="text-custom-text/70 dark:text-custom-darkText/70">
                    {team.role} Team
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
  
          {/* Join Us CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-bold text-custom-text dark:text-custom-darkText mb-4">
              Volunteer With Us
            </h3>
            <p className="text-custom-text/70 dark:text-custom-darkText/70 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our vision of 
              making healthcare technology accessible to everyone.
            </p>
            <a
              href="mailto:herafya93@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-tint-light dark:bg-tint-dark text-white rounded-full hover:opacity-90 transition-colors"
            >
              Email Us
            </a>
          </motion.div>
        </div>
      </section>
    )
}
