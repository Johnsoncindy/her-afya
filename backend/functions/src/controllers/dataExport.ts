import {format} from "date-fns";
import {Request, Response} from "express";
import PDFDocument from "pdfkit";
import {
  PeriodTracking,
  PregnancyJourney,
  UserHealthData,
} from "../types/dataExport";
import db from "../utils/db";

/**
 * Exports user health data as a PDF document.
 * Generates a comprehensive report including pregnancy journey etc.
 *
 * @param {Request} req - Express request object containing userId in params
 * @param {Response} res - Express response object used to send the PDF
 * @return {Promise<void>} Promise that resolves when PDF generation is complete
 */
export const exportUserDataAsPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {userId} = req.params;
    const data = await fetchUserHealthData(userId);
    const doc = new PDFDocument({size: "A4", margin: 50});
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      const base64Data = pdfBuffer.toString("base64");
      res.json({
        data: base64Data,
        filename: `health_report_${format(new Date(), "yyyy-MM-dd")}.pdf`,
      });
    });

    // Title Section
    addCompactTitle(doc);

    // Pregnancy Journey Section
    if (data.pregnancyJourney) {
      addSectionHeader(doc, "Pregnancy Journey");

      // Calculate current week based on due date
      const dueDate = new Date(data.pregnancyJourney.dueDate);
      const lastPeriod = new Date(data.pregnancyJourney.lastPeriodDate);
      const currentWeek = Math.floor(
        (new Date().getTime() -
          lastPeriod.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );

      // Basic Information Grid
      const startY = doc.y;
      const colWidth = (doc.page.width - 100) / 2;

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Due Date", 50, startY)
        .font("Helvetica")
        .text(format(dueDate, "MMMM d, yyyy"), 50, doc.y);

      doc
        .font("Helvetica-Bold")
        .text("Current Week", 50 + colWidth, startY)
        .font("Helvetica")
        .text(
          `Week ${currentWeek >= 0 ? currentWeek : 0}`,
          50 + colWidth,
          doc.y - 14
        );

      doc.moveDown(2);

      // Weight Section - Single Entry Handling
      if (data.pregnancyJourney.weightEntries?.length) {
        addSubsectionHeader(doc, "Weight Tracking");

        const weights = data.pregnancyJourney.weightEntries;
        const latestWeight = weights[weights.length - 1];

        doc
          .fontSize(10)
          .text(`Current Weight: ${latestWeight.weight} kg`)
          .text(`Last Recorded: ${format(
            new Date(latestWeight.date), "MMMM d, yyyy")}`);

        doc.moveDown();
      }

      // Symptoms Section with improved handling
      if (data.pregnancyJourney.symptoms?.length) {
        addSubsectionHeader(doc, "Recent Symptoms");

        const symptoms = data.pregnancyJourney.symptoms;
        const symptomsMap = new Map<string, {count: number; lastDate: Date}>();

        // Aggregate symptoms
        symptoms.forEach((symptom) => {
          const existing = symptomsMap.get(symptom.type);
          const date = new Date(symptom.date);
          if (!existing || date > existing.lastDate) {
            symptomsMap.set(symptom.type, {
              count: (existing?.count || 0) + 1,
              lastDate: date,
            });
          }
        });

        // Display symptoms summary
        symptomsMap.forEach((data, type) => {
          doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text(type, {continued: true})
            .font("Helvetica")
            .text(
              ` - Last recorded: ${format(data.lastDate, "MMM d, yyyy")}` +
              (data.count > 1 ? ` (${data.count} occurrences)` : "")
            );
        });

        doc.moveDown();
      }

      // Kick Counts Section
      if (data.pregnancyJourney.kickCounts?.length) {
        addSubsectionHeader(doc, "Kick Count Summary");

        const kicks = data.pregnancyJourney.kickCounts;
        const totalKicks = kicks.reduce((sum, k) => sum + (k.count || 0), 0);
        const sessionsCount = kicks.length;

        doc
          .fontSize(10)
          .text(`Total Recorded Kicks: ${totalKicks}`)
          .text(`Number of Sessions: ${sessionsCount}`)
          .text(`Last Session: ${format(
            new Date(kicks[kicks.length - 1].date), "MMM d, yyyy")}`);

        doc.moveDown();
      }

      // Appointments Section with better date handling
      if (data.pregnancyJourney.appointments?.length) {
        addSubsectionHeader(doc, "Upcoming Appointments");

        const now = new Date();
        const appointments = data.pregnancyJourney.appointments
          .filter((apt) => new Date(apt.date) > now)
          .sort((a, b) => new Date(a.date).getTime() -
            new Date(b.date).getTime());

        if (appointments.length > 0) {
          appointments.forEach((apt) => {
            const aptDate = new Date(apt.date);
            doc
              .fontSize(10)
              .font("Helvetica-Bold")
              .text(format(aptDate, "MMM d, yyyy h:mm a"), {continued: true})
              .font("Helvetica")
              .text(` - ${apt.type.replace(/_/g, " ").toUpperCase()}`)
              .text(`With: Dr. ${apt.doctor} at ${apt.location}`, {indent: 20})
              .text(apt.notes ? `Notes: ${apt.notes}` : "", {indent: 20});
          });
        } else {
          doc.text("No upcoming appointments scheduled");
        }

        doc.moveDown();
      }
    }

    // Period Tracking Section with improved validation
    if (data.periodTracking?.cycleHistory?.length) {
      doc.addPage();
      addSectionHeader(doc, "Cycle Analysis");

      const cycles = data.periodTracking.cycleHistory
        .filter((c) => c.length > 0) // Filter out invalid cycles
        .sort((a, b) => new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime());

      if (cycles.length > 0) {
        // Calculate valid statistics
        const lengths = cycles.map((c) => c.length);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

        doc
          .fontSize(12)
          .text(`Average Cycle Length: ${avgLength.toFixed(1)} days`)
          .text(`Recent Cycles: ${cycles.length}`);

        doc.moveDown();

        // Recent cycles in compact format
        addSubsectionHeader(doc, "Recent Cycles");
        cycles.slice(0, 5).forEach((cycle) => {
          doc
            .fontSize(10)
            .text(
              `${format(new Date(cycle.startDate), "MMM d")} - ` +
              `${format(new Date(cycle.endDate), "MMM d, yyyy")} ` +
              `(${cycle.length} days)`
            );
        });
      } else {
        doc.text("Not enough cycle data for analysis");
      }
    }

    // Footer
    doc
      .moveDown()
      .fontSize(9)
      .text(
        "This report contains your personal health information. " +
        "Please consult with your healthcare provider for medical advice.",
        {align: "center"}
      );

    addFooter(doc);
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      error: "Failed to generate health report",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * Adds a compact title section to the PDF document.
 *
 * @param {PDFKit.PDFDocument} doc - PDFKit document instance
 * @return {void} Nothing
 */
function addCompactTitle(doc: PDFKit.PDFDocument): void {
  // Add decorative header
  doc.rect(0, 0, doc.page.width, 80).fill("#0a7ea4");

  // Add title and date in header
  doc
    .fontSize(24)
    .fillColor("white")
    .text("Health Report", 50, 25)
    .fontSize(12)
    .text(`Generated: ${format(new Date(), "MMMM d, yyyy")}`, 50, doc.y)
    .fillColor("black") // Reset color for rest of document
    .moveDown();
}

/**
 * Adds a section header to the PDF document with consistent styling.
 *
 * @param {PDFKit.PDFDocument} doc - PDFKit document instance
 * @param {string} text - Header text to display
 * @return {void} Nothing
 */
function addSectionHeader(doc: PDFKit.PDFDocument, text: string): void {
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(text, {underline: true})
    .moveDown();
}

/**
 * Adds a subsection header to the PDF document with consistent styling.
 *
 * @param {PDFKit.PDFDocument} doc - PDFKit document instance
 * @param {string} text - Subsection header text to display
 * @return {void} Nothing
 */
function addSubsectionHeader(doc: PDFKit.PDFDocument, text: string): void {
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(text)
    .moveDown()
    .fontSize(12)
    .font("Helvetica");
}

/**
 * Adds page numbers to the footer of each page in the PDF document.
 *
 * @param {PDFKit.PDFDocument} doc - PDFKit document instance
 * @return {void} Nothing
 */
function addFooter(doc: PDFKit.PDFDocument): void {
  try {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      // Add page number
      doc
        .fontSize(8)
        .text(
          `Page ${i + 1} of ${range.count}`,
          0,
          doc.page.height - 20,
          {align: "center"}
        );
    }
  } catch (error) {
    console.error("Error adding page numbers:", error);
  }
}

/**
 * Fetches user health data from the database.
 *
 * @param {string} userId - User ID to fetch data for
 * @return {Promise<UserHealthData>} Promise containing user's health data
 */
const fetchUserHealthData = async (userId: string): Promise<UserHealthData> => {
  try {
    const [periodData, pregnancyData] = await Promise.all([
      db.collection("userPeriodData").doc(userId).get(),
      db.collection("pregnancyData").doc(userId).get(),
    ]);

    return {
      periodTracking: periodData.exists ?
        (periodData.data() as PeriodTracking) : null,
      pregnancyJourney: pregnancyData.exists ?
        (pregnancyData.data() as PregnancyJourney) : null,
    };
  } catch (error) {
    console.error("Error fetching user health data:", error);
    throw error;
  }
};
