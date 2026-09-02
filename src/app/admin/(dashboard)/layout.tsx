import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const links = [
    { href: "/admin", label: "Panel" },
    { href: "/admin/urunler", label: "Ürünler" },
    { href: "/admin/pipeline", label: "Satış Pipeline" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-heading text-sm font-bold">
              ERGEN TEKSTİL <span className="text-brand-grey">/ Admin</span>
            </span>
            <nav className="flex gap-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-grey transition hover:text-brand-navy"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-brand-grey">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
