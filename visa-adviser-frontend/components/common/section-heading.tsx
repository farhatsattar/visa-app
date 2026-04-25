type SectionHeadingProps = {
  id?: string;
  title: string;
  subtitle: string;
};

export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div id={id} className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
        {subtitle}
      </p>
    </div>
  );
}
