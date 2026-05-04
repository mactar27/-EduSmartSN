import Image from "next/image"
import Link from "next/link"

const footerLinks = {
  produit: [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Modules", href: "#modules" },
    { label: "Tarifs", href: "#modules" }, // Rediriger vers modules pour l'instant
    { label: "Démo", href: "#contact" },
  ],
  entreprise: [
    { label: "À propos", href: "#fonctionnalites" },
    { label: "Blog", href: "#" },
    { label: "Carrières", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Confidentialité", href: "/privacy" },
    { label: "CGU", href: "/terms" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3 sm:mb-4">
              <Image
                src="/logo.png"
                alt="EduSmart SN Logo"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              La plateforme SaaS de gestion universitaire moderne du Sénégal.
            </p>
            <p className="text-xs text-muted-foreground">
              Smarter Education, Better Future
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">Produit</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.produit.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">Entreprise</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.entreprise.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">Légal</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduSmart SN. Plateforme de Souveraineté Numérique.
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-widest">
              Réalisé par <a href="https://wockytech.xyz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-black">WockyTech</a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">Propulsé avec</span>
            <span className="text-destructive animate-pulse">❤️</span>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">au Sénégal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
