import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MobileCardSkeletonProps {
  variant?: 'course' | 'invoice' | 'trip' | 'exam';
  count?: number;
}

export const MobileCardSkeleton = ({ variant = 'course', count = 4 }: MobileCardSkeletonProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            "rounded-lg border border-border bg-card p-4 space-y-3",
            "animate-stagger-in opacity-0"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {variant === 'course' && <CourseCardSkeleton />}
          {variant === 'invoice' && <InvoiceCardSkeleton />}
          {variant === 'trip' && <TripCardSkeleton />}
          {variant === 'exam' && <ExamCardSkeleton />}
        </div>
      ))}
    </div>
  );
};

const CourseCardSkeleton = () => (
  <>
    {/* Header with badge */}
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    
    {/* Details */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    
    {/* Price and button */}
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-9 w-24 rounded-md" />
    </div>
  </>
);

const InvoiceCardSkeleton = () => (
  <>
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    
    {/* Invoice details */}
    <div className="grid grid-cols-2 gap-4 py-2">
      <div className="space-y-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
    
    {/* Amount and action */}
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <div className="space-y-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-28" />
      </div>
      <Skeleton className="h-10 w-28 rounded-md" />
    </div>
  </>
);

const TripCardSkeleton = () => (
  <>
    {/* Image placeholder */}
    <Skeleton className="h-32 w-full rounded-md -mt-1 -mx-1" style={{ width: 'calc(100% + 8px)' }} />
    
    {/* Title and details */}
    <div className="space-y-2 pt-2">
      <Skeleton className="h-5 w-4/5" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
    
    {/* Price and buttons */}
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-6 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  </>
);

const ExamCardSkeleton = () => (
  <>
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    
    {/* Exam details */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    {/* Pricing options */}
    <div className="grid grid-cols-2 gap-2 pt-2">
      <Skeleton className="h-16 rounded-md" />
      <Skeleton className="h-16 rounded-md" />
    </div>
    
    {/* Register button */}
    <Skeleton className="h-10 w-full rounded-md mt-2" />
  </>
);

// Single card skeleton for individual use
export const SingleCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg border border-border bg-card p-4 space-y-3 animate-pulse", className)}>
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-9 w-24 rounded-md" />
    </div>
  </div>
);

// Filter section skeleton
export const FilterSkeleton = () => (
  <div className="space-y-3 animate-fade-in-up">
    <Skeleton className="h-11 w-full rounded-md" />
    <Skeleton className="h-10 w-full rounded-md" />
  </div>
);
