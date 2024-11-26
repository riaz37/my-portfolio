export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      {children}
    </div>
  );
}
