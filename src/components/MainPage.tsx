import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg1.jpg";
import logo from "../assets/logo.png";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-gray-800">
        
        <div className="w-full flex justify-between items-center px-12 py-4">

          {/* ================= LEFT: TITLE ================= */}
          <div className="flex items-baseline gap-4">

            <h1 className="text-4xl font-extrabold tracking-wide text-white">
              CRIS
            </h1>

            <span className="text-base text-gray-300 font-medium tracking-wide">
              Centre for Railway Information Systems
            </span>

          </div>

          {/* ================= RIGHT: LOGO ================= */}
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="CRIS Logo"
              className="
                w-14 
                h-14 
                rounded-full 
                object-cover

                border border-white/30

                shadow-lg
                shadow-black/40

                backdrop-blur-sm

                hover:scale-105
                transition
                duration-300
              "
            />
          </div>

        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative pt-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      >

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            IRVINS Portal
          </h1>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Railways Vigilance ensures transparency, integrity,
            and accountability across operations.
          </p>

          {/* Buttons */}
          <div className="flex gap-6 justify-center flex-wrap">

            <button
              onClick={() => navigate("/form")}
              className="
                px-7 py-3

                bg-blue-600
                hover:bg-blue-700

                rounded-xl

                font-semibold

                transition
                duration-300

                shadow-lg
                hover:shadow-blue-500/30
              "
            >
              Complaint Form
            </button>

            <button
              onClick={() => navigate("/tagging")}
              className="
                px-7 py-3

                bg-gray-700
                hover:bg-gray-800

                rounded-xl

                font-semibold

                transition
                duration-300

                shadow-lg
                hover:shadow-gray-500/20
              "
            >
              Old Complaint Tagging
            </button>

          </div>

        </div>
      </section>

      {/* ================= INFO SECTION ================= */}
      <section className="bg-gray-950 py-20 px-6">

        <div className="max-w-5xl mx-auto text-center space-y-6">

          <h2 className="text-4xl font-bold">
            Railways Vigilance
          </h2>

          <p className="text-gray-300 leading-relaxed text-lg">
            Railways Vigilance is a specialized wing dedicated to ensuring
            integrity, transparency, and accountability across railway operations.
            It plays a crucial role in preventing corruption, detecting
            irregularities, and promoting ethical practices across all departments.
          </p>

          <p className="text-gray-400 leading-relaxed">
            Beyond investigation, vigilance promotes awareness, compliance,
            and responsibility, ensuring the railway system runs efficiently
            and ethically.
          </p>

        </div>

      </section>

      {/* ================= ACTION SECTION ================= */}
      <section className="bg-black py-20 px-6 text-center">

        <h2 className="text-3xl font-bold mb-6">
          Take Action
        </h2>

        <p className="text-gray-400 mb-10">
          Submit complaints or manage existing records efficiently.
        </p>

        <div className="flex gap-6 justify-center flex-wrap">

          <button
            onClick={() => navigate("/form")}
            className="
              px-8 py-4

              bg-green-600
              hover:bg-green-700

              rounded-xl

              text-lg
              font-semibold

              transition
              duration-300

              shadow-lg
              hover:shadow-green-500/30
            "
          >
            Register Complaint
          </button>

          <button
            onClick={() => navigate("/tagging")}
            className="
              px-8 py-4

              bg-gray-700
              hover:bg-gray-800

              rounded-xl

              text-lg
              font-semibold

              transition
              duration-300

              shadow-lg
              hover:shadow-gray-500/20
            "
          >
            Tag Complaints
          </button>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 py-10 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Column 1 */}
          <div>

            <h3 className="text-white font-semibold mb-2">
              Centre for Railway Information Systems
            </h3>

            <p className="text-sm">
              Ministry of Railways, Government of India
            </p>

            <p className="text-sm mt-2">
              Chanakyapuri, New Delhi - 110021
            </p>

          </div>

          {/* Column 2 */}
          <div>

            <h3 className="text-white font-semibold mb-2">
              Contact
            </h3>

            <p className="text-sm">
              Phone: 24104525
            </p>

            <p className="text-sm">
              Fax: 26877893
            </p>

          </div>

          {/* Column 3 */}
          <div>

            <h3 className="text-white font-semibold mb-2">
              Helpdesk
            </h3>

            <p className="text-sm text-blue-400">
              crismershelpdesk@cris.org.in
            </p>

          </div>

        </div>

        <div className="text-center text-xs mt-10 border-t border-gray-800 pt-4">
          © {new Date().getFullYear()} CRIS IRVINS Portal. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default MainPage;