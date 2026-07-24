import { cn } from '@/lib/utils';

interface BrandMarkProps {
    className?: string;
    imageClassName?: string;
    alt?: string;
}

export default function BrandMark({ className, imageClassName, alt = 'LDKD Care' }: BrandMarkProps) {
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#E8ECF3]',
                className,
            )}
        >
            <img
                src="/favicon-kotak.png"
                alt={alt}
                className={cn('h-full w-full object-cover', imageClassName)}
                draggable={false}
            />
        </span>
    );
}
