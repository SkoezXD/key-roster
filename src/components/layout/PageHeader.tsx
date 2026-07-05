type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>

      {actions ? <div>{actions}</div> : null}
    </div>
  );
}