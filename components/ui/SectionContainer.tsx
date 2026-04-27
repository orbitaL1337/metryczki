import { cn } from "@/lib/utils";

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionContainer({ children, className }: SectionContainerProps) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-4 md:px-8 lg:px-10", className)}>{children}</div>;
}