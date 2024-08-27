import React, { useState } from "react";
import Banner from "../../components/Banner";
import Reviews from "./Reviews";
import { FaBus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuLanguages } from "react-icons/lu";
import singleTour from "../../assets/single-tour.jpg";
import album1 from "../../assets/album1.jpg";
import album2 from "../../assets/album2.jpg";
import album3 from "../../assets/album3.jpg";
import album4 from "../../assets/album4.jpg";
import album5 from "../../assets/album5.jpg";
import album6 from "../../assets/album6.jpg";

import Slider from "./GallerySlider";
import Faq from "./Faq";

import Disc from "./Disc";
import DiscImage from "./DiscImage";

import { IoClose, IoArrowBack, IoArrowForward } from "react-icons/io5";
import { BiCart, BiTime } from "react-icons/bi";
import { useSelector } from "react-redux";

import languagesss from "../../assets/lang.png";
import men from "../../assets/men.png";

const dataa = {
    category: "64f8f2a6e75b3f00457e8abc", // Example ObjectId for the category
    coverImage: "https://example.com/images/cover-image.jpg", // Example cover image URL
    title: {
        en: "Desert Safari Adventure",
        ar: "مغامرة سفاري الصحراء",
    },
    duration: {
        en: "3 Days 2 Nights",
        ar: "3 أيام 2 ليالي",
    },
    typeOfTour: {
        en: "Adventure",
        ar: "مغامرة",
    },
    transportation: {
        en: "4x4 Vehicle",
        ar: "مركبة دفع رباعي",
    },
    language: {
        en: "English, Arabic",
        ar: "الإنجليزية، العربية",
    },
    description: {
        en: "Experience the thrill of a desert safari with dune bashing, camel rides, and more.",
        ar: "استمتع بإثارة رحلة السفاري في الصحراء مع ركوب الكثبان والجمال والمزيد.",
    },
    highlights: [
        {
            en: "Dune Bashing",
            ar: "التزحلق على الكثبان الرملية",
        },
        {
            en: "Camel Riding",
            ar: "ركوب الجمال",
        },
    ],
    includes: [
        {
            en: "Hotel pickup and drop-off",
            ar: "التوصيل من وإلى الفندق",
        },
        {
            en: "Meals and beverages",
            ar: "الوجبات والمشروبات",
        },
    ],
    adultPrice: 100,
    childPrice: 50,
    itinerary: [
        {
            en: "Day 1: Arrival and check-in at the camp",
            ar: "اليوم 1: الوصول وتسجيل الدخول في المخيم",
        },
        {
            en: "Day 2: Desert activities and BBQ dinner",
            ar: "اليوم 2: الأنشطة الصحراوية وعشاء شواء",
        },
        {
            en: "Day 1: Arrival and check-in at the camp",
            ar: "اليوم 1: الوصول وتسجيل الدخول في المخيم",
        },
        {
            en: "Day 1: Arrival and check-in at the camp",
            ar: "اليوم 1: الوصول وتسجيل الدخول في المخيم",
        },
        {
            en: "Day 1: Arrival and check-in at the camp",
            ar: "اليوم 1: الوصول وتسجيل الدخول في المخيم",
        },
        {
            en: "Day 1: Arrival and check-in at the camp",
            ar: "اليوم 1: الوصول وتسجيل الدخول في المخيم",
        },
        {
            en: "Day 1: Arrival and check-in at the camp",
            ar: "اليوم 1: الوصول وتسجيل الدخول في المخيم",
        },
    ],
    faq: [
        {
            question: {
                en: "What is your return policy?",
                ar: "ما هي سياسة الإرجاع الخاصة بكم؟",
            },
            answer: {
                en: "Our return policy allows you to return items within 30 days of purchase.",
                ar: "تسمح لك سياسة الإرجاع لدينا بإرجاع العناصر في غضون 30 يومًا من الشراء.",
            },
        },
        {
            question: {
                en: "How can I track my order?",
                ar: "كيف يمكنني تتبع طلبي؟",
            },
            answer: {
                en: "You can track your order by logging into your account and navigating to 'Track Order'.",
                ar: "يمكنك تتبع طلبك عن طريق تسجيل الدخول إلى حسابك والانتقال إلى 'تتبع الطلب'.",
            },
        },
    ],
    gallerys: [album1, album2, album3, album4, album5, album6],
    availableDays: [1, 2, 4], // Days represented as numbers, e.g., 1 for Sunday, 2 for Monday, etc.
    sessions: ["8:00 AM", "12:00 PM", "4:00 PM"], // Example session times
    adultPrice: 400, // Price for adults
    childPrice: 250, // Price for children
};

const SingleTour = () => {
    const [data, setData] = useState(dataa);
    const lang = useSelector((state) => state.language.lang);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [adultCount, setAdultCount] = useState(0);
    const [childCount, setChildCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [session, setSession] = useState(null);
    // Function to check if a date is Wednesday or Sunday
    const isAvailableDay = (date) => {
        const day = date.getDay(); // Get the day index (0 for Sunday, 1 for Monday, etc.)
        return data?.availableDays.includes(day); // Check if the day index is in the availableDays array
    };

    const album = [album1, album2, album3, album4, album5, album6];
    const handleNextImage = () => {
        setSelectedImage((prevIndex) => (prevIndex + 1) % album.length);
    };

    const handlePreviousImage = () => {
        setSelectedImage(
            (prevIndex) => (prevIndex - 1 + album.length) % album.length,
        );
    };
    const handleTicketCountChange = (type, isIncrement) => {
        if (type === "adult") {
            // Calculate new adult count
            const newCount = isIncrement
                ? adultCount + 1
                : Math.max(adultCount - 1, 0);
            setAdultCount(newCount);
            // Calculate new total price
            setTotalPrice(
                newCount * data.adultPrice + childCount * data.childPrice,
            );
        } else if (type === "child") {
            // Calculate new child count
            const newCount = isIncrement
                ? childCount + 1
                : Math.max(childCount - 1, 0);
            setChildCount(newCount);
            // Calculate new total price
            setTotalPrice(
                adultCount * data.adultPrice + newCount * data.childPrice,
            );
        }
    };

    const handleSession = (sess) => {
        setSession(sess);
    };

    return (
        <div>
            <Banner
                image={singleTour}
                title={"Monster Bus Tour in the Desert"}
                subTitle={"Home | Tours"}
            />
            <div className="flex justify-center items-center px-2  pt-10">
                <div className="flex w-screen md:w-[80vw]   flex-wrap">
                    <div className="w-full md:w-3/4  space-y-10    flex flex-col justify-center ">
                        <div>
                            <h2 className="text-3xl font-bold">
                                About this activity
                            </h2>

                            <div className="relative grid grid-cols-1 md:grid-cols-2 mt-5 bg-custom-yellow w-full md:w-4/5 p-5 gap-3 rounded-lg shadow-xl">
                                {/* <div className=" rotate-[40deg] absolute w-[50px] h-[50px] bg-red-500 bottom-0 left-0"></div> */}
                                <div className="flex  gap-5 items-center ">
                                    <BiTime className="w-[60px] h-[60px]" />
                                    <div>
                                        <h4 className="font-bold text-lg">
                                            Time Duration
                                        </h4>
                                        <p>5 hours</p>
                                    </div>
                                </div>
                                <div className="flex  gap-5 items-center ">
                                    <FaBus className="w-[60px] h-[60px]" />

                                    <div>
                                        <h4 className="font-bold text-lg">
                                            Time Duration
                                        </h4>
                                        <p>5 hours</p>
                                    </div>
                                </div>
                                <div className="flex  gap-5 items-center ">
                                    <img
                                        src={men}
                                        className="w-[70px] h-[70px] object-cover"
                                    />
                                    <div>
                                        <h4 className="font-bold text-lg">
                                            Time Duration
                                        </h4>
                                        <p>5 hours</p>
                                    </div>
                                </div>
                                <div className="flex  gap-5 items-center ">
                                    <img
                                        src={languagesss}
                                        className="w-[70px] h-[70px] object-cover"
                                    />

                                    <div>
                                        <h4 className="font-bold text-lg">
                                            Time Duration
                                        </h4>
                                        <p>5 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">Description</h2>

                            <div className="relative  mt-5 bg-custom-yellow w-full md:w-4/5 p-5  rounded-lg shadow-xl">
                                <p>{data.description[lang]}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">Highlights</h2>

                            <div className="relative  mt-5 bg-custom-yellow w-full md:w-4/5 p-5  rounded-lg shadow-xl">
                                <ul className="list-disc pl-5">
                                    {data.highlights.map((item) => (
                                        <li>{item[lang]}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">
                                What’s Included?
                            </h2>

                            <div className="relative  mt-5 bg-custom-yellow w-full   md:w-4/5 p-5  rounded-lg shadow-xl">
                                <ul className="list-disc pl-5">
                                    {data.includes.map((item) => (
                                        <li>{item[lang]}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">Itinerary</h2>

                            <div className="relative  mt-5  pl-7  w-full md:w-4/5 py-5  rounded-lg ">
                                <ul>
                                    {data.itinerary.map((item, index) => {
                                        if (
                                            index ==
                                                data?.itinerary.length - 2 ||
                                            index == 1
                                        )
                                            return (
                                                <li
                                                    className={` ${index == data?.itinerary.length - 1 ? "pt-[90px]" : "pb-[90px]"}   border-l border-l-4   border-dashed border-black flex  items-center relative`}
                                                >
                                                    <DiscImage />
                                                    <span className="pl-10">
                                                        {item[lang]}
                                                    </span>
                                                </li>
                                            );

                                        return (
                                            <li
                                                className={`${index == data?.itinerary.length - 1 ? " pb-0 " : " pb-[90px] "}  
                                            ${index == 0 || index == data?.itinerary.length - 3 ? " border-dashed  " : "border-solid "}  


                                             border-l border-l-4   border-solid border-black flex  items-center relative`}
                                            >
                                                <Disc />
                                                <span className="pl-10">
                                                    {item[lang]}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4   relative">
                        <div>
                            <h2 className="text-xl font-bold">
                                Choose date and time
                            </h2>
                            <br />
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                filterDate={isAvailableDay} // Disable all days not in availableDays
                                inline
                                dateFormat="MMMM d, yyyy"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl mt-5 font-bold">Sessions</h2>
                            <div className="flex justify-start items-center gap-5 flex-wrap mt-5">
                                {data.sessions.map((sessionL) => (
                                    <button
                                        className={`px-3 py-2 border border-black border-3 rounded-md flex gap-3 items-center ${sessionL == session && " bg-custom-yellow "}`}
                                        onClick={() => handleSession(sessionL)}
                                    >
                                        <BiTime className="w-[25px] h-[25px]" />{" "}
                                        {sessionL}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl mt-5 font-bold">
                                Participants
                            </h2>
                            <div className="p-4 bg-gray-100 rounded-md max-w-md mx-auto">
                                {/* Adult Ticket Section */}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Adult
                                        </h2>
                                        <p>Price: ${data.adultPrice}</p>
                                    </div>
                                    <div className="flex items-center">
                                        {/* Minus Button */}
                                        <button
                                            onClick={() =>
                                                handleTicketCountChange(
                                                    "adult",
                                                    false,
                                                )
                                            }
                                            className="w-10 h-10 bg-gray-300 rounded-full text-lg font-bold mx-2"
                                        >
                                            -
                                        </button>
                                        {/* Display Adult Ticket Count */}
                                        <span className="text-lg font-semibold">
                                            {adultCount}
                                        </span>
                                        {/* Plus Button */}
                                        <button
                                            onClick={() =>
                                                handleTicketCountChange(
                                                    "adult",
                                                    true,
                                                )
                                            }
                                            className="w-10 h-10 bg-gray-300 rounded-full text-lg font-bold mx-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Child Ticket Section */}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Child
                                        </h2>
                                        <p>Price: ${data.childPrice}</p>
                                    </div>
                                    <div className="flex items-center">
                                        {/* Minus Button */}
                                        <button
                                            onClick={() =>
                                                handleTicketCountChange(
                                                    "child",
                                                    false,
                                                )
                                            }
                                            className="w-10 h-10 bg-gray-300 rounded-full text-lg font-bold mx-2"
                                        >
                                            -
                                        </button>
                                        {/* Display Child Ticket Count */}
                                        <span className="text-lg font-semibold">
                                            {childCount}
                                        </span>
                                        {/* Plus Button */}
                                        <button
                                            onClick={() =>
                                                handleTicketCountChange(
                                                    "child",
                                                    true,
                                                )
                                            }
                                            className="w-10 h-10 bg-gray-300 rounded-full text-lg font-bold mx-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Total Price Display */}
                                <div className="mt-4">
                                    <h2 className="text-xl font-bold">
                                        Total Price: ${totalPrice}
                                    </h2>
                                    <br />
                                    <button className="px-4 py-2 font-bold rounded-md bg-custom-yellow text-black hover:text-white hover:bg-black duration-300">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Slider mediaUrls={data?.gallerys} />
            <div className="flex justify-center items-center px-2  mb-10 ">
                <div className="flex    flex-wrap  w-[80vw]">
                    <div className="w-full   space-y-10    flex flex-col justify-center ">
                        <div>
                            <h2 className="text-3xl font-bold mb-5">FAQs</h2>
                            <Faq faqData={data?.faq} lang={lang} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleTour;
