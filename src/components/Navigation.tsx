
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink 
                  className={cn(navigationMenuTriggerStyle(), 
                  isActive("/") && "bg-accent text-accent-foreground")}
                >
                  Weather
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/esp8266">
                <NavigationMenuLink 
                  className={cn(navigationMenuTriggerStyle(), 
                  isActive("/esp8266") && "bg-accent text-accent-foreground")}
                >
                  ESP8266 Sensor
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/summary">
                <NavigationMenuLink 
                  className={cn(navigationMenuTriggerStyle(), 
                  isActive("/summary") && "bg-accent text-accent-foreground")}
                >
                  Sensor Summary
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navigation;
