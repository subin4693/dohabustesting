import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../assets/DOHA Bus Logo YB large.png";
import Loader from "../../../components/Loader";
import DatePicker from "react-datepicker";
const Index = () => {
  const lang = useSelector((state) => state.language.lang);
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tickets/all`);
        console.log(res.data.data.tickets);
        setData(res.data.data.tickets);
        setFilteredData(res.data.data.tickets); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("Invoices", filteredData);
  const getStartAndEndDate = (filter) => {
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (filter === "week") {
      // Get the start and end of the current week (Sunday to Saturday)
      const startOfWeek = now.getDate() - now.getDay(); // Sunday
      startDate = new Date(now.setDate(startOfWeek));
      endDate = new Date(now.setDate(startOfWeek + 6)); // Saturday
    } else if (filter === "Month") {
      // Get the start and end of the current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
    } else if (filter === "Year") {
      // Get the start and end of the current year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31); // Last day of the year
    }

    // If filter is "All", no date filtering is needed
    return { startDate, endDate };
  };

  // Apply filters on data
  useEffect(() => {
    const filtered = data.filter((invoice) => {
      const invoiceDate = new Date(invoice.createdAt);

      // Search Query Filter
      const matchesSearchQuery =
        invoice.plan.title.en
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.category.title.en
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.firstName.toLowerCase().includes(searchQuery.toLowerCase());

      // Date Range Filter
      let startDateToUse = startDate;
      let endDateToUse = endDate;

      if (!startDate && !endDate) {
        const { startDate: filterStartDate, endDate: filterEndDate } =
          getStartAndEndDate(selectedFilter);
        startDateToUse = filterStartDate;
        endDateToUse = filterEndDate;
      }

      const isWithinDateRange =
        (!startDateToUse ||
          invoiceDate >= new Date(startDateToUse).setHours(0, 0, 0, 0)) &&
        (!endDateToUse ||
          invoiceDate <= new Date(endDateToUse).setHours(23, 59, 59, 999));

      return matchesSearchQuery && isWithinDateRange;
    });

    setFilteredData(filtered);
  }, [searchQuery, data, startDate, endDate, selectedFilter]);

  const generatePDF = (invoice) => {
    setLoadingInvoice((prevState) => ({
      ...prevState,
      [invoice._id]: true,
    }));
    const invoiceElement = document.getElementById("invoice");

    html2canvas(invoiceElement).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");

      const borderWidth = 10;
      const borderColor = [255, 255, 0];
      const titleColor = [255, 178, 44];
      const contactColor = [255, 178, 44];
      const payableToColor = titleColor;

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.setFillColor(...borderColor);
      pdf.rect(0, 5, borderWidth, pdfHeight, "F");

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...borderColor);

      const dateIssued = `Issued Date: ${new Date().toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric" }
      )}`;
      const invoiceNumber = `INVOICE#: ${invoice._id}`;

      const invoiceText = "INVOICE";
      const invoiceTextWidth = pdf.getTextWidth(invoiceText);

      pdf.setFontSize(30);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(invoiceText, borderWidth + 10, 40);

      const verticalOffset = 5;
      const rightAlignX = pdfWidth - borderWidth - 100;

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(dateIssued, rightAlignX, 35 - verticalOffset);
      pdf.text(invoiceNumber, rightAlignX, 45 - verticalOffset);

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("CUSTOMER CONTACT", borderWidth + 10, 55);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Name: ${invoice.firstName} `, borderWidth + 10, 65);
      pdf.text(`Email: ${invoice.email}`, borderWidth + 10, 75);

      pdf.autoTable({
        startY: 80,
        head: [["Booking Details", ""]],
        body: [
          [
            "Booked Day:",
            new Date(invoice.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          ],
          ["Guest:", `${invoice.adultQuantity + invoice.childQuantity}`],
          ["Name:", `${invoice.firstName} `],
          ["Plan Title:", invoice.plan.title?.[lang] || "N/A"],
          ["Category Title:", invoice.category.title?.[lang] || "N/A"],
          ["Pickup:", invoice.pickupLocation || "N/A"],
          ["Drop:", invoice.dropLocation || "N/A"],
          [
            "Add Ons:",
            invoice?.addonFeatures?.length > 0
              ? invoice.addonFeatures.join(", ")
              : "No Add-ons",
          ],
          ["Status:", invoice.status],
          ["Total:", `${invoice.price} QAR`],
        ],
        theme: "striped",
        styles: {
          cellPadding: 5,
          fontSize: 12,
          font: "helvetica",
          halign: "left",
          valign: "middle",
        },
        headStyles: {
          fillColor: [255, 255, 0],
          textColor: [0, 0, 0],
          fontSize: 14,
          fontStyle: "bold",
        },
        margin: { left: borderWidth + 10 },
      });

      const tableHeight = pdf.autoTable.previous.finalY;
      const payableToY = pdfHeight - 45;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("PAYABLE TO:", borderWidth + 10, payableToY);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Company: BOHABUS", borderWidth + 10, payableToY + 7);
      pdf.text("Phone: +974 4442 244", borderWidth + 10, payableToY + 17);
      pdf.text("Location: Doha, Qatar", borderWidth + 10, payableToY + 27);
      pdf.text("Website: www.dohabus.com", borderWidth + 10, payableToY + 37);

      const logoImage = new Image();
      logoImage.src = logo;
      logoImage.onload = () => {
        const logoWidth = 40;
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
        const logoX = borderWidth + 140;
        const logoY = pdfHeight - logoHeight - 12;

        pdf.addImage(logoImage, "PNG", logoX, logoY, logoWidth, logoHeight);
        setLoadingInvoice((prevState) => ({
          ...prevState,
          [invoice._id]: false,
        }));
        pdf.save("invoice.pdf");
      };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center justify-end w-full flex-wrap">
          <select
            className="px-5 rounded-md py-2"
            value={selectedFilter}
            onChange={(e) => {
              setStartDate(null);
              setEndDate(null);
              setSelectedFilter(e.target.value);
            }} // Set selected filter
          >
            <option value="week">Current Week</option>
            <option value="Month">Current Month</option>
            <option value="Year">Current Year</option>
            <option value="All">All</option>
          </select>{" "}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="px-2 py-1 rounded-md shadow border-black"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="px-2 py-1 rounded-md shadow border-black"
          />
          <input
            type="text"
            placeholder="Search invoice"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow-md px-2 py-1"
          />
        </div>
      </div>
      <div className="cards grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3   gap-5 mt-10">
        {filteredData.length > 0 ? (
          filteredData.map((invoice) => (
            <div
              key={invoice._id}
              className="card border-2 p-5 rounded-2xl shadow-lg bg-gray-200 flex flex-col justify-between"
              id="invoice"
            >
              <div className="">
                <img
                  className="w-full h-[300px] object-cover rounded-2xl"
                  src={invoice.plan.coverImage}
                  alt={invoice.plan.title.en}
                />
              </div>
              <div className="w-full h-[200px] mt-2">
                <h1 className="text-3xl mt-1">{invoice.plan.title[lang]}</h1>
                <h2 className="text-xl mt-1">{invoice.category.title[lang]}</h2>
                <h2 className="text-xl mt-1">Name: {invoice.firstName}</h2>
                <h2 className="text-xl mt-1">Email: {invoice.email}</h2>
                <h2 className="text-xl mt-1">
                  Guest: {invoice.adultQuantity + invoice.childQuantity}
                </h2>
                <h2 className="text-xl mt-1">Price: {invoice.price} QAR</h2>
                <h2 className="text-xl mt-1">Status: {invoice.status}</h2>
              </div>
              <button
                onClick={() => generatePDF(invoice)}
                className="mt-16 w-full p-1 border rounded-md hover:bg-dark hover:text-white duration-300 bg-custom-yellow text-xl "
              >
                {loadingInvoice[invoice._id] ? (
                  <div>
                    <Loader w={50} h={50} b={10} />
                  </div>
                ) : (
                  "Download"
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-xl">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Index;
