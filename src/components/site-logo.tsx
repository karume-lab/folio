import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  href?: string;
  showText?: boolean;
  className?: string;
  imageClassName?: string;
}

export function SiteLogo({
  href = "/",
  showText = true,
  className = "",
  imageClassName = "size-10",
}: SiteLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center select-none rounded-full",
        showText && "gap-1",
        className,
      )}
    >
      <Image
        width={40}
        height={40}
        src="/logo.png"
        className={cn("object-contain rounded-full", imageClassName)}
        alt="Folio Logo"
        priority
      />
      {showText && (
        <span className="text-xl font-bold tracking-tight text-foreground font-sans">
          olio
        </span>
      )}
    </Link>
  );
}

export default SiteLogo;
