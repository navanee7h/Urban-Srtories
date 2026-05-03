import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              At Urban Stories, we believe that clothing is more than just fabric — it's a narrative.
              We curate premium men's shirts in linen, cotton, and imported fabrics for the modern man who demands
              both comfort and uncompromising style.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <div className="order-2 md:order-1 space-y-6">
                <h2 className="text-3xl font-medium tracking-tight">The Art of Fine Fabrics</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We source the finest linens, imported cottons, and premium blended fabrics from
                  some of the world's best mills. Every material is handpicked for its breathability,
                  durability, and natural elegance — ensuring your shirt not only looks exceptional
                  but feels incredible against your skin.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From classic pure linens that soften with every wash to crisp imported cotton weaves,
                  our fabric range gives you the perfect shirt for every occasion.
                </p>
              </div>
              <div className="order-1 md:order-2 aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                <img
                  src="/images/linen_fabric.png"
                  alt="Premium folded linen fabric"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                <img
                  src="/images/linen_shirt.png"
                  alt="Premium linen clothing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-medium tracking-tight">Made to Measure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reject the "one size fits all" philosophy. Every body is unique, which is why
                  we offer our signature Custom Tailoring service. We empower you to dial in your
                  exact measurements, from sleeve length to collar fit.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our master tailors meticulously craft your shirt to the precise specifications
                  saved in your account, delivering a bespoke fit without the bespoke price tag.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="bg-primary text-primary-foreground py-24 text-center">
          <div className="container mx-auto px-4 max-w-3xl space-y-6">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Our Vision</h2>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              To be every man's go-to destination for premium shirts — bringing together
              the finest linen, cotton, and imported fabrics into one effortless shopping experience.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
