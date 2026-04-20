import { useNavigate } from 'react-router-dom';
import { Search, FileText, MessageSquare, CheckCircle, Star, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "1. Find Your Artist",
    desc: "Browse our Artists directory and explore their portfolios. Filter by style, rating, or followers to find the perfect match for your vision."
  },
  {
    icon: FileText,
    title: "2. Send a Request",
    desc: "Click 'Hire' on any artwork or artist profile. Fill out the commission form — describe your idea, set your budget, and pick a deadline."
  },
  {
    icon: MessageSquare,
    title: "3. Discuss & Refine",
    desc: "The artist reviews your request and can accept or propose changes. Use the built-in messaging to discuss details, share references, and align on the vision."
  },
  {
    icon: CheckCircle,
    title: "4. Receive Your Art",
    desc: "Once the artist completes the piece, you receive your custom artwork. Rate the experience and help others discover great artists."
  }
];

const faqs = [
  {
    q: "How much does a commission cost?",
    a: "Entirely up to you and the artist. You propose a budget in your request, and the artist can accept or negotiate."
  },
  {
    q: "What if I'm not happy with the result?",
    a: "We encourage open communication throughout the process. Discuss revisions directly with the artist via messages."
  },
  {
    q: "How long does a commission take?",
    a: "You set the deadline in your request. Most artists complete commissions within 1–4 weeks depending on complexity."
  },
  {
    q: "Can I cancel a commission?",
    a: "Yes, before the artist accepts. Once accepted, reach out to the artist directly to discuss cancellation."
  }
];

const Commission = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-white">

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-sm font-bold rounded-full mb-6">How It Works</span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Get Custom Art Made <br className="hidden md:block" /> Just for You.
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Commission a one-of-a-kind piece from a talented artist on ArtPool. Tell them your vision — they bring it to life.
        </p>
        <button onClick={() => navigate('/artists')} className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white dark:text-black text-white font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg text-lg">
          Find an Artist <ArrowRight size={20} />
        </button>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">The Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <step.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-black text-white text-center px-4">
        <h2 className="text-4xl font-extrabold mb-4">Ready to commission something special?</h2>
        <p className="text-gray-400 mb-8 text-lg">Browse our artists and send your first request today.</p>
        <button onClick={() => navigate('/artists')} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors text-lg">
          Browse Artists <ArrowRight size={20} />
        </button>
      </section>
    </div>
  );
};

export default Commission;