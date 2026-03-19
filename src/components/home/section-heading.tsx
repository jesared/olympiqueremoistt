interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="max-w-2xl space-y-3">
      <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
        {eyebrow}
      </p>
      <h2 id={id} className="text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
        {description}
      </p>
    </header>
  );
}
