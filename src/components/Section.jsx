export default function Section({ id, n, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-24 border-t border-line pt-10">
      <h2 id={`${id}-title`} className="mb-6 text-[22px] font-medium text-heading">
        {n}. {title}
      </h2>
      {children}
    </section>
  );
}
