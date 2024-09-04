import React, { useState, useEffect } from "react";
import CreateOfferCard from "./CreateOfferCard";
import OfferCard from "./OfferCard";
import axios from "axios";

const Offers = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL; // Make sure to set your BASE_URL properly
    const [isOpen, setIsOpen] = useState(false);
    const [plans, setPlans] = useState([]);
    const [offers, setOffers] = useState([]);

    const handleStatus = async (id) => {
        console.log(id);
        try {
            const res = await axios.put(BASE_URL + "/offers/" + id);
            const updatedOffer = res.data.data.offer;

            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer._id === updatedOffer._id ? updatedOffer : offer,
                ),
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (
        couponCode,
        startingDate,
        endingDate,
        childDiscountType,
        adultDiscountType,
        childDiscountPrice,
        adultDiscountPrice,
        selectedPlan,
    ) => {
        console.log({
            couponCode,
            startingDate,
            endingDate,
            childDiscountType,
            adultDiscountType,
            childDiscountPrice,
            adultDiscountPrice,
            selectedPlan,
        });
        try {
            const res = await axios.post(BASE_URL + "/offers", {
                couponCode,
                startingDate,
                endingDate,
                childDiscountType,
                adultDiscountType,
                childDiscountPrice,
                adultDiscountPrice,
                plan: selectedPlan,
            });
            console.log(res.data.data.offer);
            setOffers((prev) => [...prev, res.data.data.offer]);
            setIsOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(BASE_URL + "/offers");
                console.log(response.data.data.offers);
                setOffers(response.data.data.offers);

                const res = await axios.get(BASE_URL + "/plans/plan-titles");
                console.log("new plan--->");
                console.log(res.data.data.plans);
                setPlans(res.data.data.plans);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);

    return (
        <div>
            {/* Button to open the CreateOffer component */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Create offer
            </button>

            {/* Render the OfferCard for each offer in the data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer, index) => (
                    <OfferCard
                        key={index}
                        offer={offer}
                        handleStatus={handleStatus}
                    />
                ))}
            </div>

            {/* Conditionally render the CreateOffer component as a modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <CreateOfferCard
                            closeModal={() => setIsOpen(false)}
                            plans={plans}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
