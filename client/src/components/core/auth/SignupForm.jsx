import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { signUp } from "../../../services/operation/authApi.js"
import { setSignupData } from "../../../slices/authSlice.js"
import { ACCOUNT_TYPE } from "../../../utils/constants.js"
import Tab from "../../common/Tab"
import { motion } from "framer-motion"
// const acckey = process.env.ACCESS_KEY;

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {isOwner} = useSelector((state)=>state.auth);

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.USER) // defualt student

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accesskey:""
    
  })

  const [showPassword, setShowPassword] = useState(false)

  const { firstName, lastName, email, password,accesskey } = formData

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault()

    
    if(accountType===ACCOUNT_TYPE.OWNER ){
      if(accesskey!==import.meta.env.VITE_ACCESS_KEY){
        return toast.error("Invalid Access Key");
      }
      else{
          const signupData = {
            ...formData,
            accountType,
          }
      
          // Call signUp directly instead of sendOtp
          dispatch(signUp(accountType, formData.firstName, formData.lastName, formData.email, formData.password, navigate))
      
          // Reset
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          })
      
          setAccountType(ACCOUNT_TYPE.USER)
      }
    }

    else{
      const signupData = {
        ...formData,
        accountType,
      }
  
      // Call signUp directly instead of sendOtp
      dispatch(signUp(accountType, formData.firstName, formData.lastName, formData.email, formData.password, navigate))
  
      // Reset
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      })
  
      setAccountType(ACCOUNT_TYPE.USER)
    }



    
  }

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "User",
      type: ACCOUNT_TYPE.USER,
    },
    {
      id: 2,
      tabName: "Owner",
      type: ACCOUNT_TYPE.OWNER,
    },
  ]


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
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      {/* Form */}
      <motion.form 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        onSubmit={handleOnSubmit} 
        className="flex w-full flex-col gap-y-4"
      >
        <div className="flex gap-x-4">
          <motion.label variants={itemVariants} className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-slate-300">
              First Name <sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="w-full rounded-[0.5rem] bg-slate-800/50 p-[12px] text-slate-100 placeholder:text-slate-500"
            />
          </motion.label>
          <motion.label variants={itemVariants} className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-slate-300">
              Last Name <sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="w-full rounded-[0.5rem] bg-slate-800/50 p-[12px] text-slate-100 placeholder:text-slate-500"
            />
          </motion.label>
        </div>
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
        <div className="flex gap-x-4">
          <motion.label variants={itemVariants} className="relative w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-slate-300">
              Create Password <sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-[0.5rem] bg-slate-800/50 p-[12px] pr-10 text-slate-100 placeholder:text-slate-500"
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
        </div>

        {
          isOwner &&
          <motion.label variants={itemVariants} className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-slate-300">
            Access Key <sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type="text"
              name="accesskey"
              value={accesskey}
              onChange={handleOnChange}
              placeholder="Enter access key"
              className="w-full rounded-[0.5rem] bg-slate-800/50 p-[12px] text-slate-100 placeholder:text-slate-500"
            />
          </motion.label>
        }

        <motion.button
          variants={itemVariants}
          type="submit"
          className="mt-6 rounded-[8px] bg-gradient-to-r from-blue-500 to-purple-600 py-[10px] px-[12px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all"
        >
          Create Account
        </motion.button>
      </motion.form>
    </div>
  )
}

export default SignupForm