"use client";

import { Cpu, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAVIGATION_ITEMS = [
  { href: "#", label: "Home", Icon: () => null },
  { href: "#stats", label: "Why Folio", Icon: Sparkles },
  { href: "#how-it-works", label: "How it Works", Icon: Layers },
  { href: "#features", label: "Features", Icon: Cpu },
];

export function NavigationPill() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <TooltipProvider delay={0}>
        <NavigationMenu
          className={cn(
            "rounded-full border border-border",
            "bg-background/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
            "px-3 py-1.5 transition-all duration-300 hover:bg-background/80",
          )}
        >
          <NavigationMenuList className="gap-2 flex flex-row items-center justify-center">
            {NAVIGATION_ITEMS.map(({ href, label, Icon }) => (
              <NavigationMenuItem key={href}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      href === "#" ? (
                        <SiteLogo
                          href="#"
                          showText={false}
                          imageClassName="size-5 transition-transform duration-300"
                          className="flex items-center justify-center size-10 rounded-full transition-all duration-300 hover:bg-muted focus:bg-muted focus:outline-none hover:scale-110"
                        />
                      ) : (
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center justify-center size-10 rounded-full transition-all duration-300",
                            "text-muted-foreground hover:text-foreground",
                            "hover:bg-muted hover:scale-110",
                            "focus:bg-muted focus:outline-none",
                          )}
                        />
                      )
                    }
                  >
                    {href === "#" ? null : (
                      <>
                        <Icon className="size-5 transition-transform duration-300" />
                        <span className="sr-only">{label}</span>
                      </>
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={10}
                    className="bg-background/90 text-foreground border border-border backdrop-blur-md px-2.5 py-1 text-xs rounded-md shadow-lg"
                  >
                    <p className="text-xs font-medium">{label}</p>
                  </TooltipContent>
                </Tooltip>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </TooltipProvider>
    </div>
  );
}

export default NavigationPill;
