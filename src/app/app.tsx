import Navbar from "@/components/Navbar";

interface ApplicationProps {
  children: React.ReactNode;
}

export default function App({ children }: ApplicationProps) {
  return (
    <div className="h-screen dark:bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
