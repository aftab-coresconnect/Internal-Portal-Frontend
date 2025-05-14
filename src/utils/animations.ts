import { Variants } from 'framer-motion';

// Page transition animations
export const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 10
  },
  in: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  out: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// Card animations
export const cardVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2
    }
  },
  tap: {
    y: 0,
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.1
    }
  }
};

// List item animations
export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 10 
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut'
    }
  }),
  removed: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.2
    }
  }
};

// Form animations
export const formVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

export const formItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Button animations
export const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// Fade animations
export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0 
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.175, 0.885, 0.32, 1.275] // Elastic ease
    }
  }
};

// Rotate animations
export const rotateVariants: Variants = {
  hidden: { 
    rotate: -90,
    opacity: 0 
  },
  visible: { 
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// Slide animations
export const slideFromRightVariants: Variants = {
  hidden: { 
    x: 100,
    opacity: 0 
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const slideFromLeftVariants: Variants = {
  hidden: { 
    x: -100,
    opacity: 0 
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}; 