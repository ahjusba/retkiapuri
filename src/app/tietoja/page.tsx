export default function TietojaPage() {
  return (
    <main
      className="flex-1 flex flex-col items-center justify-center px-6 py-16"
      style={{ background: 'var(--background)' }}
    >
      <article
        className="w-full max-w-lg rounded-2xl p-8 shadow-sm"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: 'var(--foreground)', fontFamily: 'Lusitana, serif' }}
        >
          Tietoja Retkiapurista
        </h1>
        <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <p>
            <strong style={{ color: 'var(--foreground)' }}>Retkiapuri</strong> on selainpohjainen työkalu,
            joka auttaa retkeilijää suunnittelemaan matkansa varusteet ja muonan.
            Vastaamalla muutamaan yksinkertaiseen kysymykseen saat henkilökohtaisen
            pakkauslistan, joka ottaa huomioon vuodenajan, maaston, yöpymistavan
            ja päivämatkan pituuden.
          </p>
          <p>
            Sovellus on suunniteltu erityisesti Suomen olosuhteisiin – tunturille,
            metsiin ja järvimaisemiin. Tavoitteena on tehdä retkeilyn suunnittelusta
            helpompaa niin aloittelijoille kuin kokeneemmillekin vaeltajille.
          </p>
          <p>
            Retkiapuri ei korvaa omaa harkintaasi tai paikallisia olosuhteita
            koskevaa tietoa. Tarkista aina ajantasainen sääennuste ja mahdolliset
            reittirajoitukset ennen lähtöä.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--border)' }}>
            Versio 0.1 &mdash; kehitysversio
          </p>
        </div>
      </article>
    </main>
  );
}
