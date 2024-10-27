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
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { Hourglass, PenSquare, LogIn, Palette } from "lucide-react";
import MainLogo from "./MainLogo";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: "guardian-1", name: "Guardian 1" },
    { key: "going-global-1", name: "Going Global 1" },
    { key: "going-global-2", name: "Going Global 2" },
    { key: "hero-1", name: "Hero 1" },
    { key: "hero-2", name: "Hero 2" },
    { key: "vida", name: "VIDA" },
    { key: "past-history", name: "Past History" },
    { key: "motorsports-1", name: "Motorsports 1" },
    { key: "motorsports-2", name: "Motorsports 2" },
    { key: "motorsports-3", name: "Motorsports 3" },
    { key: "bravery-1", name: "Bravery & Courage 1" },
    { key: "bravery-2", name: "Bravery & Courage 2" },
    { key: "bravery-3", name: "Bravery & Courage 3" },
    { key: "golf-1", name: "Golf 1" },
    { key: "golf-2", name: "Golf 2" },
    { key: "golf-3", name: "Golf 3" },
    { key: "guiding-1", name: "Guiding 1" },
    { key: "guiding-2", name: "Guiding 2" },
    { key: "guiding-3", name: "Guiding 3" },
    { key: "romantic-1", name: "Romantic 1" },
    { key: "romantic-2", name: "Romantic 2" },
    { key: "romantic-3", name: "Romantic 3" },
    { key: "guardian-2", name: "Guardian 2" },
    { key: "guardian-3", name: "Guardian 3" },
    { key: "india-ict-1", name: "India ICT 1" },
    { key: "india-ict-2", name: "India ICT 2" },
    { key: "india-ict-3", name: "India ICT 3" },
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  const renderAuthButton = () => {
    if (isLoggedIn) {
      return (
        <Button
          as={Link}
          className="text-sm font-normal text-default-600 bg-default-100"
          href="/postgreeting"
          variant="flat"
          startContent={<PenSquare size={18} />}
        >
          Compose Message
        </Button>
      );
    } else {
      return (
        <Button
          as={Link}
          className="text-sm font-normal text-default-600 bg-default-100"
          href="/login"
          variant="flat"
          startContent={<LogIn size={18} />}
        >
          Login
        </Button>
      );
    }
  };

  const renderThemeSwitch = () => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          startContent={<Palette size={18} />}
          className="text-sm font-normal"
        >
          Theme
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={new Set([theme || ""])}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0]?.toString();
          if (selected) setTheme(selected);
        }}
        selectionMode="single"
        items={themes}
      >
        {(item) => (
          <DropdownItem key={item.key} className="capitalize">
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <NextUINavbar
      maxWidth="full"
      position="static"
      className="bg-content1 rounded-full shadow-md"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <div>
            <Link href="/">
              <MainLogo className="mt-2 w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-hourglass " />
            </Link>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="center"
      >
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/"
            >
              Journey
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/postgreeting"
            >
              Wall of Celebration
            </NextLink>
          </NavbarItem>
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>{renderThemeSwitch()}</NavbarItem>
        <NavbarItem>{renderAuthButton()}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <Link color="foreground" href="/" size="lg">
              Wall of Celebration
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" href="#" size="lg">
              Journey
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              color="foreground"
              href={isLoggedIn ? "/postgreeting" : "/login"}
              size="lg"
            >
              {isLoggedIn ? "Compose Message" : "Login"}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>{renderThemeSwitch()}</NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
