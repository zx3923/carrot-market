export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className=" max-w-screen-sm mx-auto">{children}</div>
    </div>
  );
}
