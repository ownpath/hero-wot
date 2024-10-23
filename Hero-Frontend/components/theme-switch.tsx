import { FC, useState, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Palette } from "lucide-react";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Array of themes grouped by category
  const themeGroups = {
    Guardian: ["guardian-1", "guardian-2", "guardian-3"],
    "Going Global": ["going-global-1", "going-global-2"],
    Hero: ["hero-1", "hero-2"],
    Motorsports: ["motorsports-1", "motorsports-2", "motorsports-3"],
    "Bravery & Courage": ["bravery-1", "bravery-2", "bravery-3"],
    Golf: ["golf-1", "golf-2", "golf-3"],
    Guiding: ["guiding-1", "guiding-2", "guiding-3"],
    Romantic: ["romantic-1", "romantic-2", "romantic-3"],
    "India ICT": ["india-ict-1", "india-ict-2", "india-ict-3"],
    Other: ["vida", "past-history"],
  };

  // Get all themes in a flat array
  const allThemes = Object.values(themeGroups).flat();

  // Function to get a random theme
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * allThemes.length);
    return allThemes[randomIndex];
  };

  // Set random theme on every mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const randomTheme = getRandomTheme();
      setTheme(randomTheme);
    }
  }, []);

  // Cycle through themes in sequence when clicked
  const cycleTheme = () => {
    const currentIndex = allThemes.indexOf(theme || allThemes[0]);
    const nextIndex = (currentIndex + 1) % allThemes.length;
    setTheme(allThemes[nextIndex]);
  };

  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({
      isSelected: false,
      onChange: cycleTheme,
    });

  //prevent hydration mismatch
  if (!isMounted) return <div className="w-6 h-6" />;

  return (
    <Component
      aria-label="Switch theme"
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper
          ),
        })}
      >
        <Palette size={22} />
      </div>
    </Component>
  );
};
