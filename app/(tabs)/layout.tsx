import TabBar from "@/components/tab-bar";
import TopBar from "@/components/top-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
}
