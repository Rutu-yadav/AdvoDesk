import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaClock,
  FaFileAlt,
  FaLock,
  FaCheckCircle,
  FaStar,
  FaArrowRight,
  FaGavel,
  FaBriefcase,
  FaUserTie,
} from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaGavel className="text-4xl" />,
      title: "Case Management",
      description:
        "Organize and track all your legal cases in one centralized platform with real-time updates.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaFileAlt className="text-4xl" />,
      title: "Document Management",
      description:
        "Securely store, organize, and access all case documents with advanced search capabilities.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Client Portal",
      description:
        "Give clients 24/7 access to their case information and communicate seamlessly.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "Time Tracking",
      description:
        "Accurately track billable hours and generate detailed reports for transparent billing.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Analytics & Reports",
      description:
        "Gain insights with comprehensive analytics and customizable reports on your practice.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FaLock className="text-4xl" />,
      title: "Bank-Level Security",
      description:
        "Your data is protected with enterprise-grade encryption and regular security audits.",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Users", icon: <FaUsers /> },
    { number: "50,000+", label: "Cases Managed", icon: <FaGavel /> },
    { number: "99.9%", label: "Uptime", icon: <FaCheckCircle /> },
    { number: "24/7", label: "Support", icon: <FaClock /> },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Partner, Johnson & Associates",
      content:
        "AdvoDesk has transformed how we manage our cases. The efficiency gains are remarkable, and our clients love the transparency.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Solo Practitioner",
      content:
        "As a solo lawyer, AdvoDesk gives me the tools of a large firm. It's intuitive, powerful, and has significantly improved my practice.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Legal Director, Tech Corp",
      content:
        "The security features and compliance tools give us peace of mind. AdvoDesk is an essential part of our legal operations.",
      rating: 5,
      avatar: "ER",
    },
  ];

  const trustIndicators = [
    "SOC 2 Type II Certified",
    "GDPR Compliant",
    "ISO 27001 Certified",
    "ABA Approved",
    "256-bit Encryption",
    "Regular Security Audits",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FaGavel className="text-3xl text-sky-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                AdvoDesk
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#why-us"
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
              >
                Why Us
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
              >
                Testimonials
              </a>
              <button
                onClick={() => navigate("/login")}
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              Legal Case Management
              <span className="block bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
              Streamline your legal practice with our comprehensive case
              management platform. Trusted by thousands of legal professionals
              worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <button
                onClick={() => navigate("/register")}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                Register as Advocate
                <FaArrowRight />
              </button>
              <button
                onClick={() => navigate("/register-client")}
                className="btn-secondary text-lg px-8 py-4"
              >
                Register as Client
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center text-white animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-2 text-3xl">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sky-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for legal professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="why-us"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Legal Professionals Trust AdvoDesk
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Security, compliance, and reliability you can count on
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                <FaShieldAlt className="inline-block text-sky-600 mr-3" />
                Enterprise-Grade Security
              </h3>
              <div className="space-y-4">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <span className="text-lg text-gray-700">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-sky-100 to-purple-100 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-sky-600" />
                    Professional Support
                  </h4>
                  <p className="text-gray-600">
                    Dedicated account managers and 24/7 technical support
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaUserTie className="text-purple-600" />
                    Legal Expertise
                  </h4>
                  <p className="text-gray-600">
                    Built by lawyers, for lawyers - we understand your needs
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaChartLine className="text-green-600" />
                    Proven Results
                  </h4>
                  <p className="text-gray-600">
                    Average 40% increase in productivity for our users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our clients have to say about AdvoDesk
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-sky-100 mb-8">
            Join thousands of legal professionals who trust AdvoDesk
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-sky-600 hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Start Your Free Trial
            <FaArrowRight />
          </button>
          <p className="text-sm text-sky-100 mt-4">
            No credit card required • Full access to all features
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaGavel className="text-2xl text-sky-400" />
                <span className="text-xl font-bold text-white">AdvoDesk</span>
              </div>
              <p className="text-gray-400">
                Professional legal case management for modern law firms
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AdvoDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
