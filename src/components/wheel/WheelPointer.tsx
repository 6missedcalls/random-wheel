import { cn } from '@/lib/utils';

interface WheelPointerProps {
  className?: string;
}

export function WheelPointer({ className }: WheelPointerProps) {
  return (
    <div
      className={cn(
        'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
        className
      )}
    >
      <div
        className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-[#FFD700] drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
        }}
      />
    </div>
  );
}
