import TopBar from "@/components/top-bar";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TopBar />
      <div className=" max-w-screen-sm mx-auto">{children}</div>
    </div>
  );
}
