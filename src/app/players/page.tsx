import { PageHeader } from "@/components/layout/PageHeader";

export default function PlayersPage() {
  return (
    <>
      <PageHeader
        title="Players"
        description="Manage players in your Mythic+ roster."
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Players list will be added later.
        </p>
      </div>
    </>
  );
}