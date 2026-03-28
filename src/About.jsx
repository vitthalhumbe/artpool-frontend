import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const team = [
  {
    name: "Vitthal Humbe",
    role: "Founder & Developer",
    desc: "B.Tech AI/ML student at PCCOE Pune. Built ArtPool from scratch — full stack, design, and vision. Artist at heart, engineer by craft.",
    avatar: "https://ui-avatars.com/api/?name=Vitthal+Humbe&background=2563eb&color=fff&size=128"
  }
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-full mb-6">Our Story</span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Art Deserves a Better Home.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          ArtPool was built because talented artists deserved more than social media algorithms. A real marketplace. A real community. A real way to earn from their craft.
        </p>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why ArtPool?</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Most art platforms are built for volume — thousands of prints, mass production, algorithm-driven feeds. ArtPool is different. Every piece here is original, physical, one-of-a-kind. When you buy on ArtPool, you own something no one else has.
              </p>
              <p className="text-gray-500 leading-relaxed">
                For artists, ArtPool is a studio, a storefront, and a community — all in one place. Upload your work, write your story, take commissions, and build a following that actually cares about your craft.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <div className="text-3xl font-extrabold text-blue-600 mb-1">10,000+</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-blue-600 mb-1">300+</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Artists</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-blue-600 mb-1">5,000+</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Artworks Sold</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Who is ArtPool for?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">For Artists</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              ArtPool gives you a professional portfolio, a direct sales channel, and a commission system — without taking a cut until you sell. Upload your work, write your story through blogs, build your follower base, and get hired for custom pieces.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li>✓ Pinterest-style gallery showcase</li>
              <li>✓ Commission requests with negotiation</li>
              <li>✓ Blog and story publishing</li>
              <li>✓ Real follower and rating system</li>
              <li>✓ Direct messaging with buyers</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Customers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Discover original art from real artists. Buy physical pieces shipped directly to you, or commission something made exactly to your taste. Every purchase supports an independent creator.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li>✓ Browse thousands of original artworks</li>
              <li>✓ Secure checkout with order tracking</li>
              <li>✓ Commission custom pieces</li>
              <li>✓ Follow your favourite artists</li>
              <li>✓ Leave verified reviews</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built by</h2>
          <p className="text-gray-500 mb-16">A solo developer with a love for art and clean code.</p>
          <div className="flex justify-center">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-sm w-full">
                <img src={member.avatar} className="w-20 h-20 rounded-2xl mx-auto mb-4" alt={member.name} />
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-bold text-sm mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Join the community.</h2>
        <p className="text-gray-500 mb-8 text-lg">Whether you create or collect — ArtPool is your place.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/signup')} className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors text-lg">
            Get Started <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/gallery')} className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 text-gray-700 font-bold rounded-full hover:border-gray-400 transition-colors text-lg">
            Browse Gallery
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;