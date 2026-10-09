// Se vuelve a montar en cada navegación: da un fundido suave entre pantallas.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
