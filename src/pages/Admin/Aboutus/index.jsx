import React, { useState, useEffect } from "react";
import LocalizedInput from "./LocalizedInput";
// import axios from "axios";
const AboutUsForm = () => {
    const [initialData, setInitialData] = useState(false);
    const [formData, setFormData] = useState({
        image: "",
        about: { en: "", ar: "" },
        mission: { en: "", ar: "" },
        vision: { en: "", ar: "" },
    });

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        const lang = dataset.lang;

        if (lang) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: {
                    ...prevData[name],
                    [lang]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            alert("About Us content successfully created/updated!");
        } catch (error) {
            console.error("Error submitting form data:", error);
            alert("There was an error submitting the form.");
        }
    };

    useEffect(() => {
        //api call for about us
    });
    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">
                {initialData ? "Edit About Us" : "Create About Us"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Image</label>
                    <label className="min-w-lg h-[250px] bg-gray-200 w-full flex items-center justify-center cursor-pointer">
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt="Selected"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span>Select an image</span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                <LocalizedInput
                    label="about"
                    value={formData.about.en}
                    onChange={handleChange}
                    lang="en"
                    placeholder="Enter About Us text in English"
                />
                <LocalizedInput
                    label="about"
                    value={formData.about.ar}
                    onChange={handleChange}
                    lang="ar"
                    placeholder="Enter About Us text in Arabic"
                />
                <LocalizedInput
                    label="mission"
                    value={formData.mission.en}
                    onChange={handleChange}
                    lang="en"
                    placeholder="Enter Mission text in English"
                />
                <LocalizedInput
                    label="mission"
                    value={formData.mission.ar}
                    onChange={handleChange}
                    lang="ar"
                    placeholder="Enter Mission text in Arabic"
                />
                <LocalizedInput
                    label="vision"
                    value={formData.vision.en}
                    onChange={handleChange}
                    lang="en"
                    placeholder="Enter Vision text in English"
                />
                <LocalizedInput
                    label="vision"
                    value={formData.vision.ar}
                    onChange={handleChange}
                    lang="ar"
                    placeholder="Enter Vision text in Arabic"
                />

                <button
                    type="submit"
                    className="bg-custom-yellow text-black duration-300 hover:text-white px-4 py-2 mt-4 rounded hover:bg-black"
                >
                    {initialData ? "Update About Us" : "Create About Us"}
                </button>
            </form>
        </div>
    );
};

export default AboutUsForm;