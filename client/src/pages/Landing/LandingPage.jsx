import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Hero from './sections/Hero';
import Mission from './sections/Mission';
import HowItWorks from './sections/HowItWorks';
import PipelineTrace from './sections/PipelineTrace';
import ProblemDomains from './sections/ProblemDomains';
import Statistics from './sections/Statistics';
import FeaturedChallenges from './sections/FeaturedChallenges';
import SuccessStories from './sections/SuccessStories';
import Stakeholders from './sections/Stakeholders';
import CallToAction from './sections/CallToAction';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <HowItWorks />
        <PipelineTrace />
        <ProblemDomains />
        <Statistics />
        <FeaturedChallenges />
        <SuccessStories />
        <Stakeholders />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}