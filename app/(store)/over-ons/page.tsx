export const metadata = {
  title: "Over ons – Fioresque Artwear",
  description:
    "Fioresque Artwear staat voor strakke kleding met unieke, artistieke prints. Ontdek ons verhaal en onze aanpak.",
};

export default function OverOnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-primary">
        Over Fioresque Artwear
      </h1>
      <div className="mt-8 space-y-6 text-primary/90">
        <p>
          Fioresque Artwear is een modern kledingmerk met oog voor design en kwaliteit.
          We verkopen unieke prints op kleding via print-on-demand: elke bestelling wordt
          met zorg geproduceerd en naar je opgestuurd.
        </p>
        <p>
          Onze stijl is clean en strak – geen overdreven luxe, wel verzorgd en professioneel.
          We willen dat je je thuis voelt in onze kleding, of je nu onderweg bent of thuis werkt.
        </p>
        <p>
          Heb je een vraag of suggestie? Neem gerust contact met ons op. We staan je graag te woord.
        </p>
      </div>
    </div>
  );
}
