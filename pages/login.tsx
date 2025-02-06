import { initializeApp } from "firebase/app";
import { getAuth, PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef, useState } from "react";

import styles from "@/styles/Home.module.css";

const firebaseConfig = {
  apiKey: "AIzaSyDszILQKGfE3piws1NDrUMMmctHdstgl1Q",
  authDomain: "bewifi-preview.firebaseapp.com",
  projectId: "bewifi-preview",
  storageBucket: "bewifi-preview.firebasestorage.app",
  messagingSenderId: "637687809783",
  appId: "1:637687809783:web:71dc63f3817440b96475f2",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// ============================================================================

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

type OnboardingStep = "phone" | "verification";

type Props = {};

// ============================================================================

const Login = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  const searchParams = useSearchParams();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<OnboardingStep>("phone");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const redirectUri = searchParams.get("redirect_uri");

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    // Cleanup function
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      // setError(t("onboarding.error.invalidPhoneNumber"));
      setError("Invalid phone number format");
      return;
    }

    if (!recaptchaVerifierRef.current) {
      // setError(t("onboarding.error.recaptchaNotInitialized"));
      setError("Recaptcha not initialized");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifierRef.current
      );
      setVerificationId(verificationId);
      setStep("verification");
    } catch (err) {
      console.error("Phone verification error:", err);
      // setError(t("onboarding.error.phoneNumberSave"));

      // Clear and reinitialize reCAPTCHA
      try {
        if (recaptchaVerifierRef.current) {
          await recaptchaVerifierRef.current.clear();
          // Clear the container
          const container = document.getElementById("recaptcha-container");
          if (container) {
            container.innerHTML = "";
          }
          // Create new container
          const newContainer = document.createElement("div");
          newContainer.id = "recaptcha-container";
          container?.parentNode?.replaceChild(newContainer, container);

          // Initialize new reCAPTCHA
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            { size: "invisible" }
          );
        }
      } catch (clearError) {
        console.error("Error resetting reCAPTCHA:", clearError);
        recaptchaVerifierRef.current = null;
        // setError(t("onboarding.error.recaptchaRefresh"));
      }
    }

    setIsLoading(false);
  };

  const handleVerificationSubmit = async () => {
    if (verificationCode.length !== 6) {
      // setError(t("onboarding.error.invalidVerificationCode"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      window.location.assign(
        `${redirectUri}?verification_id=${verificationId}&verification_code=${verificationCode}&phone_number=${encodeURI(phoneNumber)}`
      );
    } catch (err) {
      console.error("Verification error:", err);
      // setError(t("onboarding.error.invalidVerificationCode"));
    }

    setIsLoading(false);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    handler: () => void
  ) => {
    if (e.key === "Enter" && !isLoading) {
      handler();
    }
  };

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        {/* @ts-ignore */}
        <meta content={t("description")} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
        <link href="/icon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div className={styles.center}>
          <div id="recaptcha-container"></div>

          {step === "phone" && (
            <div>
              <input
                type="tel"
                placeholder={t("onboarding.phonePlaceholder")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handlePhoneSubmit)}
                className="bg-gray-700/50 border-gray-600 focus:border-[#FFC303] focus:ring-[#FFC303]/20 transition-all duration-300"
              />
              <button
                onClick={handlePhoneSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFC303] to-[#FFD54B] hover:from-[#FFD54B] hover:to-[#FFE17B] text-gray-900 font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                Request Verification Code
              </button>
            </div>
          )}

          {step === "verification" && (
            <div>
              <input
                type="text"
                placeholder="Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleVerificationSubmit)}
                maxLength={6}
                className="bg-gray-700/50 border-gray-600 focus:border-[#FFC303] focus:ring-[#FFC303]/20 transition-all duration-300"
              />
              <button
                onClick={handleVerificationSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFC303] to-[#FFD54B] hover:from-[#FFD54B] hover:to-[#FFE17B] text-gray-900 font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                Verify Code
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center animate-shake">
              {error}
            </p>
          )}
        </div>
      </main>
    </>
  );
};

// ============================================================================

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
  revalidate: 60,
});

// ============================================================================

export default Login;
