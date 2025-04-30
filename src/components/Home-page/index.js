"use client";
import { searchJob } from "@/actions";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const HomePage = ({ ProfileInfo }) => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [jobResult, setJobResult] = useState({ available: "", skills: "",message:"" });
  const [hasSearched, setHasSearched] = useState(false);
  const [showBox,setShowBox]=useState(false)
  const handleSearch = () => {
    setShowBox(true)
    startTransition(async () => {
      setHasSearched(true);
      const result = await searchJob(query);
      setJobResult(result);
    });
  };
  const companies = [
    {
      name: "Microsoft",
      logo: "https://media.glassdoor.com/sql/1651/microsoft-squarelogo-1479856042252.png",
    },
    {
      name: "freelance",
      logo: "https://media.glassdoor.com/sql/392261/freelancer-squarelogo-1503383966970.png",
    },
    {
      name: "Google",
      logo: "https://media.glassdoor.com/sql/9079/google-squarelogo-1441130773284.png",
    },
    {
      name: "IBM",
      logo: "https://media.glassdoor.com/sql/354/ibm-squareLogo-1680100245029.png",
    },
    {
      name: "Cisco",
      logo: "https://media.glassdoor.com/sql/1425/cisco-systems-squareLogo-1702924319691.png",
    },
    {
      name: "Nokia",
      logo: "https://media.glassdoor.com/sql/3494/nokia-squareLogo-1677420008065.png",
    },
    {
      name: "Adobe",
      logo: "https://media.glassdoor.com/sql/1090/adobe-squareLogo-1696430095326.png",
    },
  ];
  const testimonials = [
    {
      name: "SoftWare Enginer",
      text: "Python, Java, C++",
      hearts: 1,
    },
    {
      name: "Data Scientist",
      text: "Python/R, machine learning, data visualization",
      hearts: 1,
    },
    {
      name: "Cybersecurity Analyst",
      text: "Ethical hacking, network security, cryptography, risk management",
      hearts: 1,
    },
    {
      name: "AI/ML Engineer",
      text: "Python, TensorFlow, PyTorch, deep learning, NLP.",
      hearts: 1,
    },
    {
      name: "Full-Stack Developer",
      text: "React, Node.js, databases (e.g., MongoDB, SQL)",
      hearts: 1,
    },
  ];

  // Main content fade-in
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Enhanced container variants with scale
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };
  const testimonialVariants = {
    initial: { x: "100%" }, // Start off-screen to the right
    animate: {
      x: "-100%", // Move left beyond the viewport
      transition: {
        x: {
          repeat: Infinity, // Loop continuously
          repeatType: "loop", // Loop back smoothly
          duration: 30, // Duration for one full cycle (adjust for speed)
          ease: "linear", // Smooth, constant motion
        },
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, type: "spring" },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  };

  // Gradient background animation
  const gradientVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <>
      {/* Main Content */}
      <motion.main variants={pageVariants} initial="hidden" animate="visible"  >
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-md mx-2">
          <motion.div
            className="absolute inset-0 z-0"
            variants={gradientVariants}
            animate="animate"
            style={{
              background: "linear-gradient(45deg, #f3e7ff, #e3f2fd, #f3e7ff)",
              backgroundSize: "200% 200%",
            }}
          />
          <div className="relative z-10 container mx-auto px-4 py-10 flex ">
            <div className="flex flex-wrap items-center gap-12 ">
              <motion.div
                className=" w-5/6 lg:w-5/12 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span variants={itemVariants} className="flex space-x-3">
                  <span className="block w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
                  <span className="hidden lg:font-medium text-gray-600 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                    Your Career Journey Starts Here
                  </span>
                </motion.span>

                <motion.h1
                  variants={itemVariants}
                  className="text-3xl lg:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 text-transparent bg-clip-text"
                >
                  Discover Your <br /> Dream Job
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 max-w-md"
                >
                  Connect with top companies and unlock your career potential
                  with ease
                </motion.p>
                <motion.div variants={itemVariants} className="flex gap-4  ">
                  {ProfileInfo ? (
                    ProfileInfo?.role === "candidate" ? (
                      <Link
                        href={"/jobs"}
                        className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
                      >
                        Browse Jobs
                      </Link>
                    ) : (
                      <Link
                        href={"/jobs"}
                        className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
                      >
                        Post New Job
                      </Link>
                    )
                  ) : (
                    <div className="hidden lg:flex gap-4">
                      <Link
                        href={"/jobs"}
                        className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
                      >
                        Post New Job
                      </Link>
                      <Link
                        href={"/jobs"}
                        className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  )}
        </motion.div>
               
              </motion.div>

              <motion.div
                className="lg:w-7/12 hidden md:block"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <img
                  src="https://static.vecteezy.com/system/resources/previews/000/172/715/original/vector-job-search-via-website.jpg"
                  alt="Job search illustration"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl"
                />
              </motion.div>
            </div>
            
            <div className="border-black h-full w-96 ">
              <div className="flex gap-2">
                <Input
                  placeholder="Kown about job skills..."
                  className="flex-1 text-sm"
                  value={query}
                  onChange={(e) => {
                    setJobResult({});
                    setQuery(e.target.value);
                    setShowBox(false)
                  }}
                />
                <Button
                  size="icon"
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={handleSearch}
                  disabled={isPending}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {(hasSearched || isPending)&& showBox && (
                <div className="bg-slate-300 mt-5 p-3 rounded-sm transition-all duration-300 ease-in-out max-h-[400px] overflow-y-auto">
                  {isPending && (
                    <p className="text-blue-600 mt-2">Searching...</p>
                  )}
                  {jobResult?.skills && (
                    <pre className="whitespace-pre-wrap mt-2 text-sm text-gray-700">
                      {jobResult.skills}
                    </pre>
                  )}
                  {!isPending && hasSearched && !jobResult?.message && (
                    <pre
                      className={`whitespace-pre-wrap mt-2 text-sm font-medium ${
                        jobResult?.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Available: {jobResult?.available ? "yes" : "no"}
                    </pre>
                  )}
                  {
                      jobResult?.message && (
                        <pre className={`whitespace-pre-wrap mt-2 text-sm font-medium text-blue-600`}>
                          {jobResult?.message}
                        </pre>
                      )
                  }
                </div>
              )}
            </div>
          </div>
        </section>
        <motion.div variants={itemVariants} className="flex gap-4 justify-around my-4">
                  {ProfileInfo ? null: (
                    <div className="flex gap-4 lg:hidden ">
                      <Link
                        href={"/jobs"}
                        className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
                      >
                        Post New Job
                      </Link>
                      <Link
                        href={"/jobs"}
                        className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  )}
        </motion.div>
        {/* Popular Jobs Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-blue-300 to-indigo-60 rounded-xl my-8  relative overflow-hidden ">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Popular jobs and skills in demand
            </h2>

            {/* Testimonial Slider with Continuous Animation */}
            <motion.div
              className="flex gap-8 whitespace-nowrap "
              variants={testimonialVariants}
              initial="initial"
              animate="animate"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="inline-block w-[300px] bg-white rounded-2xl p-6 shadow-md border border-gray-200 "
                  whileHover={{ scale: 1.05 }} // Slight scale on hover for interactivity
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-4 min-w-60">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 mb-4 break-words whitespace-normal">
                      {testimonial.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-16  rounded-md bg-gradient-to-br from-purple-600 via-blue-300 to-indigo-60">
          <div className="container mx-auto px-4 ">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-12"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text"
              >
                Top Hiring Companies
              </motion.h2>
              <motion.div
                className="flex flex-wrap justify-center gap-6"
                variants={containerVariants}
              >
                {companies.map((company, index) => (
                  <motion.div
                    key={index}
                    variants={logoVariants}
                    whileHover="hover"
                    className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                  >
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
      </motion.main>
    </>
  );
};

export default HomePage;
