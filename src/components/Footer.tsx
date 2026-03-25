export default function Footer() {
  return (
    <footer className="border-border/60 mt-12 border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} ORTT</span>
        <span>
          Créateur{" "}
          <a
            href="https://jesared.fr"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Jérôme HENRY
          </a>
        </span>
      </div>
    </footer>
  );
}
