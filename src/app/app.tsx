import Navbar from "@/components/Navbar";

interface ApplicationProps {
  children: React.ReactNode;
}

export default function App({ children }: ApplicationProps) {
  return (
    <div className="h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-0 bg-background">{children}</main>
    </div>
  );
}
