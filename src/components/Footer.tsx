export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UniMonitor Esporte. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
