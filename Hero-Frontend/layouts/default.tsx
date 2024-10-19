import { Link } from "@nextui-org/link";
import { Head } from "./head";
import { Navbar } from "@/components/NavBar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Head />
      <div className="w-full max-w-8xl mx-auto px-6 pt-4">
        <Navbar />
      </div>
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        {/* Footer content */}
      </footer>
    </div>
  );
}
