import { CursorGlow } from "@app/lab/components/cursor-glow";
import { Footer } from "@app/lab/components/footer";
import { Header } from "@app/lab/components/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10">
        <Header />
        {children}
        <Footer />
      </div>
    </main>
  );
}
