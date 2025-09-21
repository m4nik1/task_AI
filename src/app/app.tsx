import Navbar from "@/components/Navbar";

interface ApplicationProps {
  children: React.ReactNode;
}

export default function App({ children }: ApplicationProps) {
  return (
    <div className="h-screen dark:bg-[#1f1f1f] flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 dark:bg-[#1f1f1f]">{children}</main>
    </div>
  );
}
