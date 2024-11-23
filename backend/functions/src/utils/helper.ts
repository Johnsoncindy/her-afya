import {CycleEntry, WeightEntry} from "../types/dataExport";

interface ChartDimensions {
  maxWeight: number;
  minWeight: number;
  weightRange: number;
}

interface CycleChartDimensions {
  maxLength: number;
  minLength: number;
  lengthRange: number;
}

/**
 * Safely calculates weight chart dimensions from weight entries.
 * Handles invalid values and edge cases by providing fallback values.
 *
 * @param {WeightEntry[]} weights - Array of weight entries to analyze
 * @return {ChartDimensions} Object containing maxWeight, minWeight, weightRange
 * @throws {Error} When weight values are invalid
 * @example
 * const dimensions = calculateChartDimensions(weightEntries);
 * console.log(dimensions.maxWeight); // Maximum weight value
 * console.log(dimensions.minWeight); // Minimum weight value
 * console.log(dimensions.weightRange); // Range between max and min
 */
export function calculateChartDimensions(
  weights: WeightEntry[]
): ChartDimensions {
  try {
    const weightValues = weights.map((w) => {
      const weight = Number(w.weight);
      if (isNaN(weight)) {
        throw new Error(`Invalid weight value: ${w.weight}`);
      }
      return weight;
    });

    const maxWeight = Math.max(...weightValues);
    const minWeight = Math.min(...weightValues);

    // Ensure we have a valid range
    if (maxWeight === minWeight) {
      return {
        maxWeight: maxWeight + 1,
        minWeight: Math.max(0, minWeight - 1),
        weightRange: 2,
      };
    }

    return {
      maxWeight,
      minWeight,
      weightRange: maxWeight - minWeight,
    };
  } catch (error) {
    console.error("Error calculating weight dimensions:", error);
    // Return default values if calculation fails
    return {
      maxWeight: 100,
      minWeight: 0,
      weightRange: 100,
    };
  }
}

/**
 * Calculates the vertical position of a data point on a chart.
 * Handles invalid values by returning the bottom of the chart.
 *
 * @param {number} value - The value to plot
 * @param {number} min - The minimum value in the dataset
 * @param {number} range - The range of values (max - min)
 * @param {number} chartStartY - The Y coordinate where the chart begins
 * @param {number} chartHeight - The height of the chart in points
 * @return {number} The calculated Y coordinate for the data point
 * @example
 * const yPosition = calculateChartPosition(75, 50, 100, 100, 200);
 */
export function calculateChartPosition(
  value: number,
  min: number,
  range: number,
  chartStartY: number,
  chartHeight: number
): number {
  if (isNaN(value) || isNaN(min) || range === 0) {
    return chartStartY + chartHeight; // Default to bottom of chart
  }
  return chartStartY + chartHeight - ((value - min) / range) * chartHeight;
}

/**
 * Calculates dimensions for cycle length chart from cycle entries.
 * Handles invalid values and edge cases by providing fallback values.
 * Adds padding to single-value datasets to ensure visible range.
 *
 * @param {CycleEntry[]} cycles - Array of cycle entries to analyze
 * @return {CycleChartDimensions} Object containing maxLength, minLength, ect
 * @throws {Error} When cycle length values are invalid
 * @example
 * const dimensions = calculateCycleChartDimensions(cycleEntries);
 * console.log(dimensions.maxLength); // Maximum cycle length
 * console.log(dimensions.minLength); // Minimum cycle length
 * console.log(dimensions.lengthRange); // Range between max and min
 */
export function calculateCycleChartDimensions(
  cycles: CycleEntry[]
): CycleChartDimensions {
  try {
    const lengths = cycles.map((c) => {
      const length = Number(c.length);
      if (isNaN(length)) {
        throw new Error(`Invalid cycle length: ${c.length}`);
      }
      return length;
    });

    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);

    // Ensure we have a valid range
    if (maxLength === minLength) {
      return {
        maxLength: maxLength + 5,
        minLength: Math.max(0, minLength - 5),
        lengthRange: 10,
      };
    }

    return {
      maxLength,
      minLength,
      lengthRange: maxLength - minLength,
    };
  } catch (error) {
    console.error("Error calculating cycle dimensions:", error);
    return {
      maxLength: 40,
      minLength: 20,
      lengthRange: 20,
    };
  }
}
