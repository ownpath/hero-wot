import { Link } from "@nextui-org/link";
import { Head } from "./head";
import { Navbar } from "@/components/NavBar";
import MainLogo from "@/components/MainLogo";
import { useRouter } from "next/router";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleLogout = () => {
    try {
      // Clear all items from localStorage
      localStorage.clear();

      // Show success toast
      toast.success("Logged out successfully");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Head />
      <Toaster position="bottom-right" expand={true} richColors />
      <div className="w-full max-w-8xl mx-auto px-6 bg-background">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <MainLogo className="mt-0.5 w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-hourglass " />
            </Link>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-hourglass hover:underline transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}
