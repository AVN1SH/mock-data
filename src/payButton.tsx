"use client";
import { onClose } from "@/lib/modelSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import nProgress from "nprogress";
import confetti from 'canvas-confetti';


interface Props {
  subjectCode?: string[];
  session?: string[];
  semester?: number;
  courseCode?: string;
  handwrittenNotesId?: string;
  coinsUsed?: boolean;
  type: string;
}

const RazorpayButton = ({ subjectCode, session, semester, type, courseCode, handwrittenNotesId, coinsUsed, projectId, projectData, disabled }: Props & { projectId?: string, projectData?: any, disabled?: boolean }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { status, data } = useSession();
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (status !== "authenticated") {
      dispatch(onClose());
      nProgress.start();
      return router.push("/sign-in");
    }
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const orderData = await axios.post("/api/razorpay", {
        type,
        session,
        semester,
        subjectCode,
        courseCode,
        handwrittenNotesId,
        coinsUsed,
        projectId,
        projectData
      });

      if (orderData.status === 200) {

        const options: any = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
          name: "Grab Notes",
          currency: orderData.data.currency,
          amount: orderData.data.amount,
          order_id: orderData.data.id,
          description: "Test Transaction",
          method: {
            netbanking: true,
            card: true,
            upi: true,
            wallet: false,
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment was cancelled.", {
                description: "You closed the payment window before completing the transaction.",
                action: {
                  label: "ok",
                  onClick: () => { },
                },
              });
              console.log("User closed Razorpay popup");
            }
          },
          handler: async function (response: any) {
            const res = await axios.post("/api/verify-payment", {
              data: response,
            })
            if (res.data.success) {
              confetti({
                particleCount: 100,
                spread: 70,
                angle: 120,
                origin: { y: 1.1, x: 1 },
              });
              toast.success("Purchased Succesfully", {
                description: "Now you can access those contents.",
                action: {
                  label: "ok",
                  onClick: () => { },
                },
              })
              router.refresh();
            } else {
              toast("Sorry, Your payment might distrupt.", {
                description: "Please try again or wait if money deducted from your bank.",
                action: {
                  label: "ok",
                  onClick: () => { },
                },
              })
            }
          },
          prefill: {
            name: data?.user.name,
            email: data?.user.email,
            // contact: data?.user.number,
          },
          theme: { color: "#3399cc" },
        };
        dispatch(onClose());
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error("Payment failed! Please try again.");
          console.log(response)
        });
        rzp.open();
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Something went wrong..!, Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong..!, Try again.");
      setLoading(false);
      console.log(error);
    }

  };

  return (
    <button onClick={handlePayment} disabled={loading || disabled} className="px-10 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-full cursor-pointer text-neutral-800 dark:text-neutral-100 font-semibold flex items-center gap-2 hover:bg-sky-500 hover:dark:bg-sky-500 duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
      {loading ? <div className="flex items-center gap-2">Processing<Loader2 className="size-3 text-green-500 animate-spin duration-300" /></div> : "Pay Now"}
    </button>
  );
};

export default RazorpayButton;