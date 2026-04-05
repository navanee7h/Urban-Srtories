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
              At Urban Stories, we believe that clothing is more than just fabric—it's a narrative.
              We craft premium linen garments designed for the modern individual who values both
              comfort and uncompromising style.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <div className="order-2 md:order-1 space-y-6">
                <h2 className="text-3xl font-medium tracking-tight">The Art of Linen</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We source only the finest 100% premium linen, celebrated for its breathability,
                  durability, and natural elegance. Every thread tells a story of careful selection
                  and sustainable practices, ensuring that your garments not only look exceptional
                  but tread lightly on the earth.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Linen is a living fabric that softens and gains character with every wash,
                  making each piece uniquely yours over time.
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
              To redefine everyday elegance by bringing tailor-made, premium linen essentials
              directly to the modern wardrobe effortlessly, sustainably, and beautifully.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
