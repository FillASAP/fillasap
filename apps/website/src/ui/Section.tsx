import type { ComponentChildren } from "preact";

interface SectionProps {
  title: string;
  count: number;
  children: ComponentChildren;
}

export function Section({ title, count, children }: SectionProps) {
  return (
    <section class="section" aria-label={title}>
      <h3>
        {title} <span class="count">{count}</span>
      </h3>
      {count === 0 ? <p class="muted">None yet.</p> : <ul>{children}</ul>}
    </section>
  );
}
