import { TComplaintCategory } from "@/modules/complaints/types";

export { cn } from "cn";

export const formatComplaintCategory = (
  complaintCategory: TComplaintCategory,
) => {
  return complaintCategory.toUpperCase().split("_").join(" ");
};

/**
 * Formats a 24-hour time string (e.g. "14:00", "09:30", "10:30")
 * into a friendly 12-hour format with AM or PM (e.g. "2:00 PM", "9:30 AM", "10:30 AM").
 */
export function formatTime(timeStr: string): string {
  if (!timeStr) return "";

  // Return unchanged if already has AM or PM
  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    return timeStr.trim();
  }

  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ? minutesStr.padStart(2, "0") : "00";

  if (isNaN(hours)) return timeStr;

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12; // 00:00 -> 12:00 AM, 12:00 -> 12:00 PM

  return `${hours}:${minutes} ${period}`;
}

/**
 * Checks whether a meeting is upcoming based on its date AND end time compared to now.
 * A meeting whose end time has already passed (even earlier today) returns false (Past).
 */
export function isMeetingUpcoming(dateStr: string, endTimeStr: string, status?: string): boolean {
  if (status === "completed" || status === "cancelled") {
    return false;
  }
  if (!dateStr || !endTimeStr) {
    return false;
  }

  // Parse hours and minutes from endTimeStr
  let hours = 0;
  let minutes = 0;

  if (endTimeStr.includes("AM") || endTimeStr.includes("PM")) {
    const isPM = endTimeStr.includes("PM");
    const clean = endTimeStr.replace(/AM|PM/gi, "").trim();
    const parts = clean.split(":");
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  } else {
    const parts = endTimeStr.split(":");
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10) || 0;
  }

  const dateParts = dateStr.split("-").map(Number);
  if (dateParts.length < 3) return false;

  const meetingEndDateTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes, 0);
  const now = new Date();

  return meetingEndDateTime > now;
}
