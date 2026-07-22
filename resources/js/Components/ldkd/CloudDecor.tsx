import { motion, useReducedMotion } from 'framer-motion';

type CloudDecorProps = {
    variant?: 'hero' | 'section' | 'compact';
};

export default function CloudDecor({ variant = 'section' }: CloudDecorProps) {
    const reduceMotion = useReducedMotion();
    const clouds =
        variant === 'hero'
            ? [
                  'left-[-34px] top-[22%] h-12 w-28 opacity-80 sm:left-[4%] sm:top-[28%]',
                  'right-[6%] top-[20%] h-10 w-24 opacity-75',
                  'bottom-[9%] left-[5%] h-12 w-28 opacity-80',
                  'bottom-[14%] right-[16%] h-10 w-24 opacity-65',
              ]
            : variant === 'compact'
              ? [
                    'left-[-40px] top-10 h-8 w-20 opacity-60',
                    'right-8 bottom-12 h-8 w-20 opacity-55',
                ]
              : [
                    'left-[6%] top-14 h-10 w-24 opacity-70',
                    'right-[14%] top-20 h-8 w-20 opacity-55',
                    'bottom-16 left-[18%] h-9 w-24 opacity-50',
                ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {clouds.map((className, index) => (
                <motion.span
                    key={className}
                    className={`ldkd-cloud ${className}`}
                    animate={reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -8 : 7, 0] }}
                    transition={{ duration: 8 + index, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}
