import React from "react";

const Hero = () => {
  return (
    <section className="bg-black text-white h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 relative">
      {/* Overlay gradient if you want */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <header className="w-full absolute top-0 flex justify-between items-center px-8 py-6 z-10">
        <img
          src="/assets/netflix-logo.png"
          alt="Netflix"
          className="w-32 md:w-40"
        />
        <button className="bg-red-600 px-5 py-2 text-sm font-semibold rounded hover:bg-red-700">
          Sign In
        </button>
      </header>

      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold">
          Unlimited movies, TV shows and more.
        </h1>
        <p className="text-xl md:text-2xl mt-4">Watch anywhere. Cancel anytime.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="px-4 py-3 w-full sm:w-96 rounded text-black"
          />
          <button className="bg-red-600 px-6 py-3 rounded text-lg font-semibold hover:bg-red-700">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
