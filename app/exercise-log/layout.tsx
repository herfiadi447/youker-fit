import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export default function ExerciseLogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 md:ml-64 h-full overflow-y-auto pt-20 md:pt-0 bg-surface">
        {children}
      </main>
    </div>
  );
}
