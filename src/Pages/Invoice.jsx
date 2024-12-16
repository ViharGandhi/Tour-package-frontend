import React from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const formatCurrency = (amount) => {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
};

const generateInvoicePDF = async (bookingData, tourPackage) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Create a new page
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // Set up colors
  const primaryColor = rgb(0.2, 0.4, 0.8); // Blue
  const textColor = rgb(0, 0, 0); // Black

  // Page margins
  const margin = 50;

  // Title
  page.drawText('Adventure Booking Invoice', {
    x: margin,
    y: height - margin,
    size: 24,
    font: fontBold,
    color: primaryColor
  });

  // Company Details
  page.drawText('TravelVista Adventures', {
    x: margin,
    y: height - margin - 40,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText('Contact: support@travelvista.com', {
    x: margin,
    y: height - margin - 55,
    size: 10,
    font: font,
    color: textColor
  });

  // Horizontal Line
  page.drawLine({
    start: { x: margin, y: height - margin - 70 },
    end: { x: width - margin, y: height - margin - 70 },
    thickness: 1,
    color: primaryColor
  });

  // Booking Details
  const startY = height - margin - 100;
  const labelX = margin;
  const valueX = margin + 200;

  // Customer Information
  page.drawText('Customer Details:', {
    x: labelX,
    y: startY,
    size: 14,
    font: fontBold,
    color: primaryColor
  });

  page.drawText('Name:', {
    x: labelX,
    y: startY - 30,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(bookingData.name, {
    x: valueX,
    y: startY - 30,
    size: 12,
    font: font,
    color: textColor
  });

  page.drawText('Email:', {
    x: labelX,
    y: startY - 50,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(bookingData.email, {
    x: valueX,
    y: startY - 50,
    size: 12,
    font: font,
    color: textColor
  });

  page.drawText('Phone:', {
    x: labelX,
    y: startY - 70,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(bookingData.phone, {
    x: valueX,
    y: startY - 70,
    size: 12,
    font: font,
    color: textColor
  });

  // Tour Package Details
  page.drawText('Booking Details:', {
    x: labelX,
    y: startY - 120,
    size: 14,
    font: fontBold,
    color: primaryColor
  });

  page.drawText('Tour Package:', {
    x: labelX,
    y: startY - 150,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(tourPackage.title, {
    x: valueX,
    y: startY - 150,
    size: 12,
    font: font,
    color: textColor
  });

  page.drawText('Number of Travelers:', {
    x: labelX,
    y: startY - 170,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(bookingData.travelers.toString(), {
    x: valueX,
    y: startY - 170,
    size: 12,
    font: font,
    color: textColor
  });

  page.drawText('Price per Person:', {
    x: labelX,
    y: startY - 190,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(formatCurrency(tourPackage.price), {
    x: valueX,
    y: startY - 190,
    size: 12,
    font: font,
    color: textColor
  });

  // Total Cost
  const totalCost = tourPackage.price * bookingData.travelers;
  page.drawText('Total Cost:', {
    x: labelX,
    y: startY - 220,
    size: 14,
    font: fontBold,
    color: primaryColor
  });
  page.drawText(formatCurrency(totalCost), {
    x: valueX,
    y: startY - 220,
    size: 14,
    font: fontBold,
    color: textColor
  });

  // Special Requests
  page.drawText('Special Requests:', {
    x: labelX,
    y: startY - 250,
    size: 12,
    font: font,
    color: textColor
  });
  page.drawText(bookingData.specialRequests || 'None', {
    x: valueX,
    y: startY - 250,
    size: 12,
    font: font,
    color: textColor
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();

  // Create and trigger download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `booking_invoice_${bookingData.name.replace(/\s+/g, '_')}.pdf`;
  link.click();
};

// Modify the Invoice component to include PDF download
const Invoice = ({ bookingData, tourPackage }) => {
  const handlePDFDownload = () => {
    generateInvoicePDF(bookingData, tourPackage);
  };

  // Total cost calculation
  const totalCost = tourPackage.price * bookingData.travelers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Booking Confirmed!
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{bookingData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tour Package:</span>
            <span>{tourPackage.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Travelers:</span>
            <span>{bookingData.travelers}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Cost:</span>
            <span>Rs. {totalCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={handlePDFDownload}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Download Invoice PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;