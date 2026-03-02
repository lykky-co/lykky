export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground md:px-6">
        <p>
          Code:{" "}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            MIT
          </a>
          {" \u00B7 "}
          Content:{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            CC BY-SA 4.0
          </a>
        </p>
        <p>
          <a
            href="https://github.com/lykky-co/lykky"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          {" \u00B7 "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
