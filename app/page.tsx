import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: "Waypoint",
  description: "Learn AWS visually. Walk through an interactive, live-evolving architecture simulation explaining IAM, VPC, EC2, S3, and CloudFront in lockstep.",
};

const CHAPTERS_LIST = [
  {
    id: 'iam',
    number: '01',
    title: 'IAM',
    fullName: 'Identity & Access Management',
    desc: 'Establish cloud identities, secure credentials, and delegate access privileges.',
    features: ['IAM Roles & Policies', 'Console/Access Keys', 'Least Privilege Delegation'],
    color: 'border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 hover:border-red-300'
  },
  {
    id: 'vpc',
    number: '02',
    title: 'VPC',
    fullName: 'Virtual Private Cloud',
    desc: 'Configure isolated virtual networks with private/public subnets and routing.',
    features: ['Public/Private Subnets', 'Internet & NAT Gateways', 'Route Tables & NACLs'],
    color: 'border-green-200 text-green-600 bg-green-50/50 hover:bg-green-50 hover:border-green-300'
  },
  {
    id: 'ec2',
    number: '03',
    title: 'EC2',
    fullName: 'Elastic Compute Cloud',
    desc: 'Launch virtual servers, set up firewalls, and establish backend connectivity.',
    features: ['Web & DB Instances', 'Stateful Security Groups', 'Multi-Tier Security Design'],
    color: 'border-orange-200 text-orange-600 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-300'
  },
  {
    id: 's3',
    number: '04',
    title: 'S3',
    fullName: 'Simple Storage Service',
    desc: 'Store static assets in global object storage buckets and manage access policies.',
    features: ['Object Bucket Storage', 'Role-Based Access Integration', 'Durability & Encryption'],
    color: 'border-purple-200 text-purple-600 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300'
  },
  {
    id: 'cloudfront',
    number: '05',
    title: 'CloudFront',
    fullName: 'Content Delivery Network',
    desc: 'Distribute static and dynamic web content globally with ultra-low latency.',
    features: ['Global Edge Locations', 'S3 & EC2 Origin Caching', 'SSL/TLS Acceleration'],
    color: 'border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-slate-800 flex flex-col font-sans select-text">
      
      {/* Header bar */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold font-serif leading-tight text-slate-900 mb-8 tracking-tight">
          Learn AWS.
          <br />
          <span className="text-[#1B17FE]">
            Through interactive simulations.
          </span>
        </h1>
        
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-sans font-medium">
          No jargon, no dry blog posts. Walk through a single, live-evolving architectural diagram that animates and scales in response to your learning steps.
        </p>

        <div className="flex justify-center">
          <Link
            href="/learn"
            className="py-3.5 px-10 rounded-lg text-sm font-bold bg-[#1B17FE] text-white hover:brightness-110 active:scale-[0.98] transition-all no-underline shadow-md"
          >
            Start Walkthrough
          </Link>
        </div>
      </section>

      {/* Interactive Topology Simulator Preview */}
      <section className="max-w-4xl mx-auto px-6 mb-24 w-full">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden aspect-[16/10] md:aspect-[21/9] relative select-none flex items-center justify-center bg-slate-50">
          <video 
            src="/arch.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Chapters Curriculum Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 font-sans text-center">
          Core Learning Curriculum
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS_LIST.map((ch) => (
            <Link
              key={ch.id}
              href={`/learn?chapter=${ch.id}`}
              className={`flex flex-col p-6 rounded-xl border transition-all no-underline text-left cursor-pointer hover:shadow-md ${ch.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  Chapter {ch.number}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 border border-current/10">
                  {ch.title}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                {ch.fullName}
              </h3>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed flex-1">
                {ch.desc}
              </p>
              
              <div className="border-t border-current/10 pt-4 mt-auto">
                <ul className="space-y-1.5">
                  {ch.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                      <span className="text-xs opacity-75">→</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Visual Sandbox Overview Section */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 font-sans">
              Connected Architecture Sandbox
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike static slide sheets or separate diagrams, Waypoint preserves the architecture continuum. As you hit continue, the canvas shifts, routes traffic, and expands upon your existing infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Stateful Topology
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nodes remember their relations. Drag and rotate panels freely while the canvas retains alignment, giving you complete visibility of the system.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Live Configuration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select any resource node to inspect its live ports, security rule arrays, NAT translation logs, and IAM credential details.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Flow Simulation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch animated request packages traverse subnets, hit routing tables, cross Internet Gateways, and query database nodes in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#F9F8F6] px-6 py-8 text-center select-none text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        Waypoint — Open-source Visual AWS Architecture. Built for developers.
      </footer>
    </div>
  );
}