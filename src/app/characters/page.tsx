import { PageHeader } from "@/components/layout/PageHeader";

export default function CharactersPage() {
  return (
    <>
      <PageHeader
        title="Characters"
        description="Manage player characters, specs, roles and activity."
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Characters list will be added later.
        </p>
      </div>
    </>
  );
}