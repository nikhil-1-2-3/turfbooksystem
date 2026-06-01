import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { login } from "../../../services/operation/authApi"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }



  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <motion.form
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <motion.label variants={itemVariants} className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-slate-300">
          Email Address <sup className="text-pink-400">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="w-full rounded-[0.5rem] bg-slate-800/50 p-[12px] text-slate-100 placeholder:text-slate-500"
        />
      </motion.label>
      <motion.label variants={itemVariants} className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-slate-300">
          Password <sup className="text-pink-400">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="w-full rounded-[0.5rem] bg-slate-800/50 p-[12px] pr-12 text-slate-100 placeholder:text-slate-500"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#94a3b8" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#94a3b8" />
          )}
        </span>
      </motion.label>
      <motion.button
        variants={itemVariants}
        type="submit"
        className="mt-6 rounded-[8px] bg-gradient-to-r from-blue-500 to-purple-600 py-[10px] px-[12px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all"
      >
        Sign In
      </motion.button>
    </motion.form>
  )
}

export default LoginForm