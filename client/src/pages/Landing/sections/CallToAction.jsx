import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

export default function CallToAction() {
  return (
    <section className="py-28 px-6 lg:px-8 border-t border-panelLight">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink50 leading-tight mb-6">
          The problem in your neighborhood might be someone's PhD thesis.
        </h2>
        <p className="text-inkMuted mb-10">
          It takes two minutes to submit. The system does the routing.
        </p>
        <Link to="/register">
          <Button variant="primary" icon className="mx-auto">
            Report a challenge
          </Button>
        </Link>
      </div>
    </section>
  );
}