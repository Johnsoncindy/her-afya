import client from "../client";

interface UserPeriodData {
  userId: string;
  cycleHistory: CycleData[];
  lastPeriodStart: Date;
  periodEndDate: Date | null;
  insights: {
    averageCycleLength: number;
    cycleVariation: number;
  };
}
interface UserCycleData {
  cycleData: CycleData;
  userId: string;
}
interface CycleData {
  startDate: Date;
  endDate: Date;
  length: number;
  symptoms: Symptom[];
}

interface Symptom {
  id: string;
  name: string;
  intensity: 1 | 2 | 3;
  date: Date;
}

const endpoint = "/period-tracking";

const createOrUpdatePeriodData = async (periodData: UserPeriodData) =>
  client.put(`${endpoint}/period-data`, periodData);
const getPeriodData = async (userId: string) =>
  client.get(`${endpoint}/period-data/${userId}`);
const addCycleData = async (userCycleData: UserCycleData) =>
  client.post(`${endpoint}/cycles`, userCycleData);
const addSymptom = async (symptomData: any) =>
  client.post(`${endpoint}/symptoms`, symptomData);
const updateInsights = async (insightsData: any) =>
  client.put(`${endpoint}/insights`, insightsData);

export {
  createOrUpdatePeriodData,
  getPeriodData,
  addCycleData,
  addSymptom,
  updateInsights,
};
