import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo/Main_Logo.png";


const { TURF_PAYMENT_API, TURF_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}


export async function buyCourse(token, turf, turfprice,time, userDetails, navigate) {
    // console.log("buyCourse -> courses",import.meta.env.VITE_BASE_URL)
    const toastId = toast.loading("Please wait while we redirect you to payment gateway", {
        position: "bottom-center",
        autoClose: false,
    });
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }
        const orderResponse = await apiConnector("POST", TURF_PAYMENT_API, { turf, turfprice }, {
            Authorisation: `Bearer ${token}`,
        })

        console.log("orderResponse: ", orderResponse);
        if (!orderResponse.data.success) {
            toast.error(orderResponse.data.message)
            console.log("buyTurf -> orderResponse", orderResponse)
            toast.dismiss(toastId);
            return
        }
        let price=orderResponse.data.amount.toString();
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            currency: orderResponse.data.currency,
            amount: orderResponse.data.amount.toString(),
            order_id: orderResponse.data.orderId,
            name: "TurfXL",
            description: "Thank you for Booking Our Turf",
            image: logo,
            prefill: {
                name: userDetails?.firstName + " " + userDetails?.lastName,
                email: userDetails?.email,
            },
            handler: async function (response) {
                console.log("bookTurf -> response", response)
                verifypament(response, turf,price,time, token, navigate);
                sendPaymentSuccessEmail(response, orderResponse.data.amount, token,turf,time);
            },
            theme: {
                color: "#686CFD",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment Failed");
        });
        toast.dismiss(toastId);

    } catch (error) {
        toast.dismiss(toastId);
        toast.error("Something went wrong...! Please Login First");
        console.log("buyTurf -> error", error)
    }
}



async function sendPaymentSuccessEmail(response, amount, token,turf,time) {

    const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
        amount,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        turf,
        time
    }, {
        Authorisation: `Bearer ${token}`,
    });
    if (!res.success) {
        console.log(res.message);
        toast.error(res.message);
    }
}

async function verifypament(response, turf,price,time, token, navigate) {
    const toastId = toast.loading("Please wait while we verify your payment");
    console.log("verifypayment -> turf", turf);
    try {
        // const data = {
        //     amount: response.amount.toString(),
        //     paymentId: response.razorpay_payment_id,
        //     orderId: response.razorpay_order_id,
        //     signature: response.razorpay_signature,
        // };
        const res = await apiConnector("POST", TURF_VERIFY_API, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            turf: turf.turf || turf,
            amount: price || null,
            time:time || null
        }, {
            Authorisation: `Bearer ${token}`,
        });
        console.log("verifypament -> res", res)
        if (!res.data.success) {
            toast.error(res.message);
            return;
        }

        toast.success("Payment Successfull");
        navigate("/");
    }
    catch (err) {
        toast.success("Payment Success");
        console.log(err);
    }
    toast.dismiss(toastId);
}