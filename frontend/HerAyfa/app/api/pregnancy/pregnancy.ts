import client from "../client";
import { PregnancyData, PregnancySymptom, Appointment, WeightEntry, KickCount, ChecklistItem, Memory } from "@/components/PregnancyJourney/types";

const endpoint = "/pregnancy";

export const getPregnancyData = async (userId: string) =>
  client.get(`${endpoint}/${userId}`);

export const createPregnancyData = async (data: Partial<PregnancyData>) =>
  client.post(endpoint, data);

export const updatePregnancyData = async (userId: string, data: Partial<PregnancyData>) =>
  client.put(`${endpoint}/${userId}`, data);

export const addSymptom = async (userId: string, symptom: PregnancySymptom) =>
  client.post(`${endpoint}/${userId}/symptoms`, symptom);

export const addAppointment = async (userId: string, appointment: Appointment) =>
  client.post(`${endpoint}/${userId}/appointments`, appointment);

export const addWeight = async (userId: string, weight: WeightEntry) =>
  client.post(`${endpoint}/${userId}/weight`, weight);

export const addKickCount = async (userId: string, kickCount: KickCount) =>
  client.post(`${endpoint}/${userId}/kicks`, kickCount);

export const updateChecklist = async (userId: string, checklist: ChecklistItem[]) =>
  client.put(`${endpoint}/${userId}/checklist`, { checklist });

export const addMemory = async (userId: string, memory: Memory) =>
  client.post(`${endpoint}/${userId}/memories`, memory);