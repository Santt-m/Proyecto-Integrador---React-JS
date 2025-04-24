import React, { Suspense } from 'react';
import HomeSkeleton from './components/HomeSkeleton/HomeSkeleton';

const Hero = React.lazy(() => import('./components/Hero/Hero'));
const FeaturedProducts = React.lazy(() => import('./components/FeaturedProducts/FeaturedProducts'));
const WhyChooseUs = React.lazy(() => import('./components/WhyChooseUs/WhyChooseUs'));
const Testimonials = React.lazy(() => import('./components/Testimonials/Testimonials'));
const HowToBuy = React.lazy(() => import('./components/HowToBuy/HowToBuy'));
const CallToAction = React.lazy(() => import('./components/CallToAction/CallToAction'));

function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <div>
        {/* Banner principal */}
        <Hero />

        {/* Sección de productos destacados */}
        <FeaturedProducts />

        {/* Sección de información adicional */}
        <WhyChooseUs />

        {/* Nueva sección de testimonios */}
        <Testimonials />

        {/* Nueva sección de guía de compra */}
        <HowToBuy />

        {/* Nueva sección de llamado a la acción */}
        <CallToAction />
      </div>
    </Suspense>
  );
}

export default Home;
