import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl bg-dark-2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-dark-2" />
        <Skeleton className="h-4 w-[200px] bg-dark-2" />
      </div>
      <Skeleton className="h-[125px] w-full rounded-xl bg-dark-2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-dark-2" />
        <Skeleton className="h-4 w-[200px] bg-dark-2" />
      </div>{" "}
      <Skeleton className="h-[125px] w-full rounded-xl bg-dark-2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-dark-2" />
        <Skeleton className="h-4 w-[200px] bg-dark-2" />
      </div>
    </div>
  );
}
