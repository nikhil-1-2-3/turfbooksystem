import Template from "../components/core/auth/Template";
import { useSelector } from "react-redux";
import signupImg from "../assets/images/signupImg.jpeg";

function Signup() {
  const {loading} = useSelector((state)=>state.auth);
  return (
    loading?(<div className=" h-[100vh] flex justify-center items-center"><div class="custom-loader"></div></div>):(
    <Template
      title="Sign in to explore your game-changing journey."
      description1="Build skills for today, tomorrow, and beyond."
      description2="Where passion meets performance."
      image={signupImg}
      formType="signup"
    />
    )
  )
}

export default Signup