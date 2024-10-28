import React, { useState, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import clsx from "clsx";

import { Palette, LogOut } from "lucide-react";
import MainLogo from "./MainLogo";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const themes = [
    "guardian-1",
    "going-global-1",
    "going-global-2",
    "hero-1",
    "hero-2",
    "vida",
    "past-history",
    "motorsports-1",
    "motorsports-2",
    "motorsports-3",
    "bravery-1",
    "bravery-2",
    "bravery-3",
    "golf-1",
    "golf-2",
    "golf-3",
    "guiding-1",
    "guiding-2",
    "guiding-3",
    "romantic-1",
    "romantic-2",
    "romantic-3",
    "guardian-2",
    "guardian-3",
    "india-ict-1",
    "india-ict-2",
    "india-ict-3",
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/");
  };

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as string);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="px-7 sm:px-14 mt-10">
        <NextUINavbar
          maxWidth="full"
          className="bg-masonryNavbar rounded-md shadow-md"
        >
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <div>
                <Link href="/">
                  <MainLogo className="mt-2 w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-masonryButtonBg" />
                </Link>
              </div>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent
            className="hidden sm:flex sm:basis-full items-center"
            justify="end"
          >
            <ul className="hidden lg:flex gap-4 justify-end ml-2 items-center">
              <NavbarItem className="flex items-center">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "text-masonryButtonBg hover:text-primary data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  href="/"
                >
                  Journey
                </NextLink>
              </NavbarItem>
              <NavbarItem className="flex items-center">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "text-masonryButtonBg hover:text-primary data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  href="/wallofwishes"
                >
                  Wall of Wishes
                </NextLink>
              </NavbarItem>
              <NavbarItem className="flex items-center">
                <Button
                  as={Link}
                  href={isLoggedIn ? "/postgreeting" : "/login"}
                  variant="light"
                  className=" text-masonryButtonBg"
                >
                  Send your wishes!
                </Button>
              </NavbarItem>
              {/* <NavbarItem className="flex items-center">
              <Button
                variant="light"
                startContent={<Palette size={18} />}
                onClick={cycleTheme}
                className="text-masonryButtonBg"
              ></Button>
            </NavbarItem> */}
              {isLoggedIn && (
                <NavbarItem className="flex items-center">
                  <Button
                    variant="light"
                    startContent={<LogOut size={18} />}
                    onClick={handleLogout}
                    className="text-masonryButtonBg"
                  >
                    Logout
                  </Button>
                </NavbarItem>
              )}
            </ul>
          </NavbarContent>

          <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarMenu>
            <div className="mx-4 mt-2 flex flex-col gap-2">
              <NavbarMenuItem>
                <Link color="foreground" href="/" size="lg">
                  Journey
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="foreground" href="/masonry" size="lg">
                  Wall of Wishes
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link
                  color="foreground"
                  href={isLoggedIn ? "/postgreeting" : "/login"}
                  size="lg"
                >
                  Send your wishes!
                </Link>
              </NavbarMenuItem>
              {/* <NavbarMenuItem>
              <Button
                variant="light"
                startContent={<Palette size={18} />}
                onClick={cycleTheme}
                className="w-full"
              >
                Theme
              </Button>
            </NavbarMenuItem> */}
              {isLoggedIn && (
                <NavbarMenuItem>
                  <Button
                    variant="light"
                    startContent={<LogOut size={18} />}
                    onClick={handleLogout}
                    className="w-full bg-masonryButtonBg text-masonryButtonText"
                  >
                    Logout
                  </Button>
                </NavbarMenuItem>
              )}
            </div>
          </NavbarMenu>
        </NextUINavbar>
      </div>
    </div>
  );
};
