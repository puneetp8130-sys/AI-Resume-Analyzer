import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const FEATURES = [
  { icon: '🎯', title: 'ATS-oriented score', text: 'Get a clear 0-100 score modeled on how applicant tracking systems evaluate resumes.' },
  { icon: '🧩', title: 'Skill gap analysis', text: 'See which of your skills stand out, and which are missing for your target role.' },
  { icon: '💡', title: 'Actionable suggestions', text: 'Receive concrete, section-by-section feedback you can act on right away.' },
];

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="badge bg-brand-50 text-brand-700">AI-powered resume review</span>
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Know exactly why your resume isn&apos;t getting noticed
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-gray-500 sm:text-lg">
          Upload your resume, get an instant ATS score, and see the exact skills, keywords, and
          improvements that will make it stronger.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={ROUTES.REGISTER}>
            <Button className="px-6 py-3 text-base">Get started for free</Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button variant="secondary" className="px-6 py-3 text-base">
              Log in
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Your ATS score is an evaluation aid, not a guarantee of job selection.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="text-left">
              <div className="mb-3 text-2xl" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
