import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInWhenVisibleProps {
    children: React.ReactNode;
    delay?: number;
  }
  
  export const FadeInWhenVisible = ({ children, delay = 0 }: FadeInWhenVisibleProps) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
      threshold: 0.3,
      triggerOnce: true,
    });
  
    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);
  
    return (
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        transition={{ duration: 0.5, delay }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 }
        }}
      >
        {children}
      </motion.div>
    );
  };
