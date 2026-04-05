import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

export default function MeasurementGuide() {
  const measurements = [
    {
      name: 'Chest',
      description:
        'Measure around the fullest part of your chest, keeping the tape horizontal.',
      tip: 'Do not pull the tape too tight. Keep it relaxed.',
      image: '/images/measurements/chest.png',
    },
    {
      name: 'Shoulder',
      description:
        'Measure from the edge of one shoulder to the edge of the other across the back.',
      tip: 'Stand straight and measure across your upper back.',
      image: '/images/measurements/shoulder.png',
    },
    {
      name: 'Sleeve Length',
      description:
        'Measure from the shoulder seam to your wrist with your arm slightly bent.',
      tip: 'Keep your arm slightly bent for accurate measurement.',
      image: '/images/measurements/sleeve.png',
    },
    {
      name: 'Shirt Length',
      description:
        'Measure from the top of the shoulder down to where you want the shirt to end.',
      tip: 'Measure straight down from the highest shoulder point.',
      image: '/images/measurements/length.png',
    },
    {
      name: 'Neck',
      description:
        'Measure around your neck at the base where the collar sits.',
      tip: 'Leave one finger space inside the tape for comfort.',
      image: '/images/measurements/neck.png',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <Link
              to="/shop"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
            <h1 className="text-3xl md:text-4xl mb-4">Measurement Guide</h1>
            <p className="text-muted-foreground max-w-2xl">
              Follow these steps to take accurate measurements for your custom-tailored linen shirt.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">

            {/* Before Start */}
            <div className="bg-accent/30 border border-border rounded-sm p-6 mb-12">
              <h2 className="text-xl mb-4">Before You Start</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use a flexible measuring tape</li>
                <li>• Measure over light clothing or directly on skin</li>
                <li>• Keep the tape snug, not tight</li>
                <li>• Ask someone for help if possible</li>
                <li>• All measurements should be in inches</li>
              </ul>
            </div>

            {/* Measurement Steps */}
            <div className="space-y-12">
              {measurements.map((measurement, index) => (
                <div
                  key={measurement.name}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                >
                  {/* Image */}
                  <div
                    className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                      }`}
                  >
                    <div className="aspect-square rounded-sm overflow-hidden bg-muted p-4 flex items-center justify-center">
                      <img
                        src={measurement.image}
                        alt={`${measurement.name} measurement guide`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                        className="max-h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className={`space-y-4 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl">{measurement.name}</h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {measurement.description}
                    </p>

                    {/* Tip */}
                    <p className="text-sm text-primary font-medium">
                      💡 {measurement.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Size Chart */}
            <div className="mt-16 border border-border rounded-sm overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h2 className="text-xl">Standard Size Chart (inches)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm">Size</th>
                      <th className="px-6 py-3 text-left text-sm">Chest</th>
                      <th className="px-6 py-3 text-left text-sm">Shoulder</th>
                      <th className="px-6 py-3 text-left text-sm">Sleeve</th>
                      <th className="px-6 py-3 text-left text-sm">Length</th>
                      <th className="px-6 py-3 text-left text-sm">Neck</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ['S', 38, 16.5, 23.5, 28, 14.5],
                      ['M', 40, 17, 24, 29, 15],
                      ['L', 42, 17.5, 24.5, 30, 15.5],
                      ['XL', 44, 18, 25, 31, 16],
                    ].map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-6 py-4 text-sm text-muted-foreground"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">
                Ready to create your perfect fit?
              </p>
              <Link to="/shop">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}