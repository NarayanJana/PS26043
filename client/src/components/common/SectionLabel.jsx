export default function SectionLabel({ children }) {
  return (
    <div className="font-mono text-xs tracking-widest uppercase text-pulse mb-4">
      {children}
    </div>
  );
}