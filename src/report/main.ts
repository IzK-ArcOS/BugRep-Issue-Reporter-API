import axios from "axios";
import { Report } from "./interface";

export async function getReport(
  id: string,
  token: string
): Promise<Report | null> {
  try {
    const report = (
      await axios.get(
        `https://pb.arcapi.nl/api/collections/bugrep/records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).data as Report;

    return report;
  } catch (e) {
    console.log(id, token);
    return null;
  }
}
