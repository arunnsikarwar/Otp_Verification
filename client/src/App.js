import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, Toaster } from "react-hot-toast";
import LastImage from "./last_page.jpg";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [welcomeText, setWelcomeText] = useState("Welcome Back");
  const [instructionText, setInstructionText] = useState(
    "Please sign in to your Account"
  );
  const [logoSize, setLogoSize] = useState({ width: "264px", height: "50px" });
  const [logoSrc, setLogoSrc] = useState("./AK_logo.jpg");

  async function onSignup() {
    setLoading(true);

    const formatPh = "+" + ph;

    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formatPh }),
      });

      if (response.ok) {
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
        setWelcomeText("Please verify your number");
        setInstructionText("An OTP is sent to your Number successfully");
        setLogoSrc("./otp_image.jpg");
        setLogoSize({ width: "150px", height: "150px" });
      } else {
        // Handle error response from the API
        const data = await response.json();
        setApiResponse(data);
        setLoading(false);
        toast.error(data.message); // Display error message to the user
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("An error occurred while sending OTP.");
    }
  }

  async function onOTPVerify() {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: ph, enteredOTP: otp }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setLoading(false);
        toast.success("OTP Verified Successfully!");
        setLogoSrc("./last_page.jpg");
        setLogoSize({ width: "150px", height: "150px" });
      } else {
        // Handle error response from the API
        const data = await response.json();
        setApiResponse(data);
        setLoading(false);
        toast.error(data.message); // Display error message to the user
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("An error occurred while verifying OTP.");
    }
  }

  async function onResend() {
    setLoading(true);

    try {
      // Simulate OTP resending by making a request to the server
      const formatPh = "+" + ph;
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: formatPh }),
        }
      );
      if (response.ok) {
        setLoading(false);
        toast.success("OTP resent successfully!");
      } else {
        // Handle error response from the API
        const data = await response.json();
        setApiResponse(data);
        setLoading(false);
        toast.error(data.message); // Display error message to the user
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("An error occurred while resending OTP.");
    }
  }

  return (
    <section className="white 500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <div className="text-center justify-center items-center">
            <div className="flex flex-col items-center">
              {" "}
              {/* Wrap the content in a flex container */}
              <img src={LastImage} alt="Last Image" />
              <h1 className="text-black font-medium text-2xl">
                Welcome to Admit Kard
              </h1>
              <p>
                In order to provide you with a custom experience, we need to ask
                you a few questions.
              </p>
              <button className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded">
                Get Started
              </button>
            </div>
          </div>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <div className="text-center">
              <div
                className="w-264 h-50"
                style={{
                  width: logoSize.width,
                  height: logoSize.height,
                  margin: "0 auto",
                }}
              >
                <img src={logoSrc} alt="Logo" />
              </div>
              <h1 className="text-black font-medium text-3xl mb-2">
                {welcomeText}
              </h1>
              <p>{instructionText}</p>
            </div>

            {showOTP ? (
              <>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-black text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
  value={otp}
  onChange={setOtp}
  OTPLength={6}
  otpType="number"
  disabled={false}
  autofocus
  className="otp-container"
  inputStyle={{
    
    border: '1px solid #000', // Add border style here
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
    fontSize: '16px',
    width: '40px',
    textAlign: 'center',
  }}
></OtpInput>

                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Didn't receive the code?{" "}
                  <a href="#" onClick={onResend}>
                    Resend
                  </a>
                </p>
                {apiResponse && (
                  <div className="text-red-500 text-center mt-2">
                    {apiResponse.message}
                  </div>
                )}
              </>
            ) : (
              <>
                <label
                  htmlFor="ph"
                  className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number
                </label>

                <PhoneInput country={"in"} value={ph} onChange={setPh} />

                <legend htmlFor="ph" className="sr-only">
                  Enter Contact Number
                </legend>
                <p className="text-xs text-gray-500 text-center mb-2">
                  We will send you a one-time SMS message. Charges may apply.
                </p>
                <button
                  onClick={onSignup}
                  className="bg-yellow-400 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-md"
                  style={{ borderRadius: "1.5rem" }}
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Sign in with OTP</span>
                </button>
                {apiResponse && (
                  <div className="text-red-500 text-center mt-2">
                    {apiResponse.message}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
