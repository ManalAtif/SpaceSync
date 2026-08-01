import React from 'react';
import {
  Sparkles,
  Calendar,
  Building2,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Globe,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            ⚡
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SpaceSync</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Solutions</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Resources</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New: Advanced Multi-Campus Analytics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Streamline your workplace <br className="hidden sm:inline" />
          <span className="text-blue-600">ecosystem</span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The modern operating system for the hybrid office. Manage desks, coordinate meeting rooms, and optimize team logistics with a unified, data-driven resource platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2"
          >
            <span>Get Started For Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 font-semibold px-7 py-3.5 rounded-xl border border-slate-300 transition-colors"
          >
            Book a Demo
          </button>
        </div>

        {/* Hero Product Mockup Preview */}
        <div className="mt-14 relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white p-2">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1400&auto=format&fit=crop&q=80"
            alt="SpaceSync Dashboard"
            className="w-full h-[400px] object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-8">
            <div className="text-left text-white max-w-md">
              <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                Live Preview
              </span>
              <h3 className="text-xl font-bold mt-2">Real-time Conflict Detection & Calendar Sync</h3>
              <p className="text-xs text-slate-200 mt-1">Eliminate double-bookings instantly across global offices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 font-bold text-slate-400 text-sm">
            <span>TECHFLOW</span>
            <span>LUMINA</span>
            <span>QUANTUM</span>
            <span>NEXUS</span>
            <span>VERTEX</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Powering the Future of Work</h2>
          <p className="mt-3 text-slate-600">Comprehensive tools designed to sync your physical and digital workplace footprint.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Smart Desk Booking</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Interactive floor plans with real-time occupancy state. Empower employees to reserve desks near their team in seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Room Management</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Eliminate ghost meetings and room hogging. Sync calendars and provide instant check-ins via tablet or QR code.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Team Logistics</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Coordinate office days across distributed teams. See who is coming in and plan collaborative sessions with ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Advanced Analytics</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Deep insights into space utilization patterns. Optimize your real estate footprint based on actual behavioral data.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Enterprise Ecosystem</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              SpaceSync plays well with others. Connect with Google, Microsoft Teams, Zoom, and HRIS systems to automate your workflow.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Campus Control</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Centralized admin tools for managing multiple offices, campuses, timezones, and access groups in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Knowledge & Support */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Knowledge & Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">Help Center</h4>
              <p className="text-xs text-slate-500 mt-1">Step-by-step guides and tutorials for admins and users.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">API Documentation</h4>
              <p className="text-xs text-slate-500 mt-1">Build custom integrations with our REST API.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">Community</h4>
              <p className="text-xs text-slate-500 mt-1">Join discussions with other workplace & facilities leads.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">System Status</h4>
              <p className="text-xs text-slate-500 mt-1">See live global uptime across regional micro-hubs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flexible Plans */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Flexible Plans for Every Team</h2>
        <p className="mt-3 text-slate-600">Scale your workplace operations with pricing that fits your organization.</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Starter */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Starter</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">$0 <span className="text-sm font-normal text-slate-500">/mo</span></div>
              <p className="text-xs text-slate-500 mt-2">Free forever for small teams</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 50 users</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic desk booking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Shared calendar view</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-colors text-center text-xs"
            >
              Start Free
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 relative shadow-xl flex flex-col justify-between">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold uppercase text-blue-600">Pro</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">$5 <span className="text-sm font-normal text-slate-500">/user/mo</span></div>
              <p className="text-xs text-slate-500 mt-2">Advanced features for growing orgs</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited users & resources</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Advanced analytics & heatmaps</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Role-based access control</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Approval workflows</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors text-center text-xs"
            >
              Get Started
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Enterprise</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">Custom</div>
              <p className="text-xs text-slate-500 mt-2">Dedicated support & security</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> SAML / SSO Integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated Success Manager</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom API & webhooks</li>
              </ul>
            </div>
            <button
              onClick={onLogin}
              className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-colors text-center text-xs"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold">Ready to sync your space?</h2>
          <p className="mt-2 text-blue-100 text-sm max-w-lg mx-auto">
            Join 500+ organizations scaling their workplace operations with SpaceSync today.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md text-sm"
            >
              Start 14-Day Free Trial
            </button>
            <button
              onClick={onLogin}
              className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm"
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SpaceSync</span>
            <span>© 2026 SpaceSync Technologies Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-800">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800">Terms of Service</a>
            <a href="#" className="hover:text-slate-800">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
