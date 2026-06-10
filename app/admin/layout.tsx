import { notFound } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {children}
    </div>
  );
}
