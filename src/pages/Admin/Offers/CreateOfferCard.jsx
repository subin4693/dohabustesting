import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const CreateOffer = ({ closeModal, plans, handleSubmit }) => {
	// State for form fields
	const [couponCode, setCouponCode] = useState("");
	const [startingDate, setStartingDate] = useState("");
	const [endingDate, setEndingDate] = useState("");
	const [childDiscountType, setChildDiscountType] = useState("percentage");
	const [adultDiscountType, setAdultDiscountType] = useState("percentage");
	const [childDiscountPrice, setChildDiscountPrice] = useState("");
	const [adultDiscountPrice, setAdultDiscountPrice] = useState("");
	const [selectedPlan, setSelectedPlan] = useState("");

	const options = plans?.map((plan) => ({
		value: plan._id,
		label: plan?.title?.en,
	}));

	// Add a "Select All" option at the beginning
	const allOption = { value: "all", label: "Select All" };
	const optionsWithSelectAll = [allOption, ...options];

	// Handle change event
	const handleChange = (selectedOptions) => {
		console.log(selectedPlan);
		if (
			selectedOptions &&
			selectedOptions.some((option) => option.value === "all")
		) {
			if (selectedPlan.length === options.length) {
				// If all options are already selected, deselect all
				setSelectedPlan([]);
			} else {
				// Select all options if not already selected
				setSelectedPlan(options.map((option) => option.value));
			}
		} else {
			// Set selected options when "Select All" isn't involved
			const selectedValues = selectedOptions
				? selectedOptions.map((option) => option.value)
				: [];
			setSelectedPlan(selectedValues);
		}
	};
	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Create a New Offer</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit(
						couponCode,
						startingDate,
						endingDate,
						childDiscountType,
						adultDiscountType,
						childDiscountPrice,
						adultDiscountPrice,
						selectedPlan,
					);
				}}
			>
				{/* Coupon Code */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Coupon Code
					</label>
					<input
						type="text"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
						required
					/>
				</div>

				{/* Starting Date */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Starting Date
					</label>
					<input
						type="date"
						value={startingDate}
						onChange={(e) => setStartingDate(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
						min={new Date().toISOString().split("T")[0]} // Set min date to today
						required
					/>
				</div>

				{/* Ending Date */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Ending Date
					</label>
					<input
						type="date"
						value={endingDate}
						onChange={(e) => setEndingDate(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
						min={
							startingDate
								? new Date(
										new Date(startingDate).getTime() +
											86400000,
									)
										.toISOString()
										.split("T")[0]
								: new Date().toISOString().split("T")[0]
						} // Set min date to one day after the starting date
						required
					/>
				</div>

				{/* Child Discount Type and Price */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Child Discount Type
					</label>
					<select
						value={childDiscountType}
						onChange={(e) => setChildDiscountType(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
					>
						<option value="percentage">Percentage</option>
						<option value="price">Fixed Price</option>
					</select>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Child Discount Price
					</label>
					<input
						type="number"
						value={childDiscountPrice}
						onChange={(e) => setChildDiscountPrice(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
					/>
				</div>

				{/* Adult Discount Type and Price */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Adult Discount Type
					</label>
					<select
						value={adultDiscountType}
						onChange={(e) => setAdultDiscountType(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
					>
						<option value="percentage">Percentage</option>
						<option value="price">Fixed Price</option>
					</select>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Adult Discount Price
					</label>
					<input
						type="number"
						value={adultDiscountPrice}
						onChange={(e) => setAdultDiscountPrice(e.target.value)}
						className="border border-gray-300 rounded px-3 py-2 w-full"
					/>
				</div>

				{/* Plan Selection */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						Select Plan
					</label>
					<Select
						isMulti
						value={optionsWithSelectAll.filter((option) =>
							selectedPlan.includes(option.value),
						)}
						onChange={handleChange}
						options={optionsWithSelectAll}
						className="  px-3 py-2 w-full"
						placeholder="Select a plan"
						required
					/>
				</div>
				{/* Submit and Cancel Buttons */}
				<div className="flex justify-end">
					<button
						type="button"
						onClick={closeModal}
						className="bg-red-500 text-white px-4 py-2 rounded mr-2"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Save Offer
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateOffer;