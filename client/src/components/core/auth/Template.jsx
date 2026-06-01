import { useSelector } from "react-redux"
import { motion } from "framer-motion";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

import frameImg from "../../../assets/images/signupImg.jpeg";
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import Spinner from "../../common/spinner/Spinner";

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false, zIndex: 0 },
    fpsLimit: 60,
    background: {
      color: { value: "transparent" },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        resize: true,
      },
      modes: {
        grab: { distance: 150, links: { opacity: 0.5 } },
      },
    },
    particles: {
      color: { value: "#a78bfa" }, // purple-400
      links: {
        color: "#818cf8", // indigo-400
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: {
        value: 0.4,
        animation: { enable: true, speed: 1, minimumValue: 0.1 },
      },
      shape: { type: "circle" },
      size: { 
        value: { min: 1, max: 2 },
        animation: { enable: true, speed: 2, minimumValue: 0.5 }
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative grid min-h-[calc(100vh-3.5rem)] place-items-center overflow-hidden bg-[#0f172a]">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-auto">
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
            className="w-full h-full"
        />
      </div>

      {loading ? (
        <div className="z-10"><Spinner></Spinner></div>
      ) : (
        <div className="z-10 mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto w-11/12 max-w-[450px] md:mx-0 glass2 p-6"
          >
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 mb-6 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-300">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-11/12 max-w-[450px] md:mx-0 hidden md:block"
          >
            <motion.img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
              className="rounded-lg opacity-80"
              whileHover={{ scale: 1.02 }}
            />
            <motion.img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10 rounded-lg shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Template
