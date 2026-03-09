import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generateTicketPDF = (booking: any) => {
    const doc = new jsPDF() as any;
    const pnr = booking.pnr || 'N/A';
    const flight = booking.flight || booking.flights || {};
    const returnFlight = booking.returnFlight || booking.return_flights || null;
    const multiCityFlights = booking.multiCityFlights || booking.multi_city_flights || [];
    const passengers = booking.passengers || [];

    // Theme Colors
    const primaryColor: [number, number, number] = [14, 165, 233]; // #0ea5e9
    const secondaryColor: [number, number, number] = [71, 85, 105]; // #475569

    if (multiCityFlights.length > 0) {
        multiCityFlights.forEach((f: any, i: number) => {
            if (i > 0) doc.addPage();
            const legTitle = `Multi-City Segment ${i + 1}`;
            renderFlightPage(doc, legTitle, f, booking, passengers, pnr, primaryColor, secondaryColor, false, i);
        });
    } else {
        // Page 1: Outbound
        renderFlightPage(doc, 'Outbound Flight', flight, booking, passengers, pnr, primaryColor, secondaryColor, true);

        // Page 2: Return (if applicable)
        if (returnFlight) {
            doc.addPage();
            renderFlightPage(doc, 'Return Flight', returnFlight, booking, passengers, pnr, [2, 132, 199], secondaryColor, false);
        }
    }

    doc.save(`SkyBook_Ticket_${pnr}.pdf`);
};

const renderFlightPage = (doc: any, title: string, flight: any, booking: any, passengers: any, pnr: string, primaryColor: [number, number, number], secondaryColor: [number, number, number], isOutbound: boolean, legIndex?: number) => {
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`SkyBook - ${title}`, 15, 25);
    doc.setFontSize(12); doc.text(`PNR: ${pnr}`, 160, 25);

    // Flight Info Section
    doc.setTextColor(...secondaryColor); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Flight Information', 15, 55);
    doc.setDrawColor(200, 200, 200); doc.line(15, 58, 195, 58);

    let dateValue = booking.travel_date;
    if (legIndex !== undefined && booking.searchParams?.multiCityLegs) {
        dateValue = booking.searchParams.multiCityLegs[legIndex].date;
    } else if (!isOutbound && booking.return_date) {
        dateValue = booking.return_date;
    }

    const flightDetails = [
        ['Airline', flight.airline || 'N/A'],
        ['Flight Number', flight.flight_number || 'N/A'],
        ['Route', `${flight.source_airport || 'N/A'} to ${flight.destination_airport || 'N/A'}`],
        ['Departure', flight.departure_time || 'N/A'],
        ['Arrival', flight.arrival_time || 'N/A'],
        ['Date', dateValue ? format(new Date(dateValue), 'dd MMM yyyy') : 'N/A'],
        ['Class', booking.seatClass || booking.seat_class || 'Economy'],
    ];

    autoTable(doc, {
        startY: 65,
        head: [['Field', 'Details']],
        body: flightDetails,
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 15, right: 15 },
    });

    // Passenger Section
    const passengerStartY = (doc as any).lastAutoTable.finalY + 15;
    doc.setTextColor(...secondaryColor); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Passenger Details', 15, passengerStartY);
    doc.line(15, passengerStartY + 3, 195, passengerStartY + 3);

    const passengerRows = passengers.map((p: any) => [
        p.name || 'N/A',
        p.gender || 'N/A',
        p.seat_no || p.seatPreference || 'TBA',
        p.meal_preference || p.mealPreference || 'None',
    ]);

    autoTable(doc, {
        startY: passengerStartY + 8,
        head: [['Name', 'Gender', 'Seat', 'Meal']],
        body: passengerRows,
        theme: 'grid',
        headStyles: { fillColor: primaryColor },
        margin: { left: 15, right: 15 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10); doc.setTextColor(150, 150, 150); doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing SkyBook. Have a safe journey!', 105, finalY, { align: 'center' });
};
