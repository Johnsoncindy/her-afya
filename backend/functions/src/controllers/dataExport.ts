import {Request, Response} from "express";
import PDFDocument from "pdfkit";
import {format} from "date-fns";
import db from "../utils/db";
import {
  Appointment,
  CycleEntry,
  PeriodTracking,
  PregnancyJourney,
  Symptom,
  UserHealthData,
  WeightEntry,
} from "../types/dataExport";

/**
 * Exports user health data as a PDF document.
 * Generates a comprehensive report
 * including pregnancy journey and period tracking data.
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

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=health_report_
      ${format(new Date(), "yyyy-MM-dd")}.pdf`
    );

    doc.pipe(res);

    // Title Page
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Health Report", {align: "center"})
      .moveDown();

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Generated: ${format(new Date(), "MMMM d, yyyy")}`, {
        align: "center",
      })
      .moveDown(2);

    // Pregnancy Journey Section
    if (data.pregnancyJourney) {
      doc.addPage();

      // Section Header
      addSectionHeader(doc, "Pregnancy Journey");

      // Basic Information
      addSubsectionHeader(doc, "Basic Information");
      doc
        .fontSize(12)
        .text(
          `Due Date: ${format(
            new Date(data.pregnancyJourney.dueDate),
            "MMMM d, yyyy"
          )}`
        )
        .text(`Current Week: ${data.pregnancyJourney.currentWeek}`)
        .moveDown();

      // Weight Tracking Summary
      if (data.pregnancyJourney.weightEntries?.length) {
        addSubsectionHeader(doc, "Weight Tracking Summary");

        const weights = data.pregnancyJourney.weightEntries;
        const startWeight = weights[0].weight;
        const currentWeight = weights[weights.length - 1].weight;
        const totalGain = currentWeight - startWeight;

        doc
          .text(`Starting Weight: ${startWeight} kg`)
          .text(`Current Weight: ${currentWeight} kg`)
          .text(`Total Weight Gain: ${totalGain.toFixed(1)} kg`)
          .moveDown();

        doc.text("Recent Weight Entries:", {underline: true}).moveDown();
        weights.slice(-5).forEach((entry: WeightEntry) => {
          doc.text(
            `${format(new Date(entry.date), "MMM d, yyyy")}: ${entry.weight} kg`
          );
        });
        doc.moveDown();
      }

      // Appointments Summary
      if (data.pregnancyJourney.appointments?.length) {
        addSubsectionHeader(doc, "Upcoming Appointments");

        const futureAppointments = data.pregnancyJourney.appointments
          .filter((apt) => new Date(apt.date) > new Date())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        futureAppointments.forEach((apt: Appointment) => {
          doc
            .font("Helvetica-Bold")
            .text(format(new Date(apt.date), "MMM d, yyyy h:mm a"))
            .font("Helvetica")
            .text(`Type: ${apt.type}`)
            .text(`Doctor: ${apt.doctor}`)
            .text(`Location: ${apt.location}`)
            .text(`Notes: ${apt.notes || "None"}`)
            .moveDown();
        });
      }

      // Recent Symptoms
      if (data.pregnancyJourney.symptoms?.length) {
        addSubsectionHeader(doc, "Recent Symptoms");

        const recentSymptoms = data.pregnancyJourney.symptoms
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 10);

        recentSymptoms.forEach((symptom: Symptom) => {
          doc
            .font("Helvetica-Bold")
            .text(format(new Date(symptom.date), "MMM d, yyyy"))
            .font("Helvetica")
            .text(`${symptom.type} - Severity: ${symptom.severity}`)
            .text(`Notes: ${symptom.notes || "None"}`)
            .moveDown();
        });
      }
    }

    // Period Tracking Section
    if (data.periodTracking) {
      doc.addPage();

      addSectionHeader(doc, "Period Tracking");

      // Cycle Summary
      if (data.periodTracking.cycleHistory?.length) {
        const cycles = data.periodTracking.cycleHistory;
        const lengths = cycles.map((c) => c.length);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

        addSubsectionHeader(doc, "Cycle Summary");
        doc
          .fontSize(12)
          .text(`Average Cycle Length: ${avgLength.toFixed(1)} days`)
          .text(`Shortest Cycle: ${Math.min(...lengths)} days`)
          .text(`Longest Cycle: ${Math.max(...lengths)} days`)
          .moveDown();

        // Recent Cycles
        addSubsectionHeader(doc, "Recent Cycles");

        cycles.slice(-5).forEach((cycle: CycleEntry) => {
          doc
            .font("Helvetica-Bold")
            .text(format(new Date(cycle.startDate), "MMM d, yyyy"))
            .font("Helvetica")
            .text(`To: ${format(new Date(cycle.endDate), "MMM d, yyyy")}`)
            .text(`Length: ${cycle.length} days`)
            .text(`Symptoms: ${cycle.symptoms.length}`)
            .moveDown();
        });
      }
    }

    // Footer
    doc
      .fontSize(10)
      .text(
        "This report is for informational purposes only. " +
          "Please consult with your healthcare provider for medical advice.",
        {align: "center"}
      );

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({error: "Failed to generate PDF report"});
  }
};

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
 * Fetches user health data from the database.
 *
 * @param {string} userId - User ID to fetch data for
 * @return {Promise<UserHealthData>} Promise containing user's health data
 */
const fetchUserHealthData = async (userId: string): Promise<UserHealthData> => {
  try {
    const [periodData, pregnancyData] = await Promise.all([
      db.collection("periodData").doc(userId).get(),
      db.collection("pregnancyData").doc(userId).get(),
    ]);

    return {
      periodTracking: periodData.exists ?
        (periodData.data() as PeriodTracking) :
        null,
      pregnancyJourney: pregnancyData.exists ?
        (pregnancyData.data() as PregnancyJourney):
        null,
    };
  } catch (error) {
    console.error("Error fetching user health data:", error);
    throw error;
  }
};
