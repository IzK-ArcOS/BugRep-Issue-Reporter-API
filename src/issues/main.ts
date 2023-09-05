import { Octokit } from "octokit";
import { Report } from "../report/interface";

export async function createIssue(report: Report, token: string) {
  const octo = new Octokit({ auth: token });
  const title = report.title;
  const body = `${report.body}\n\n> References: br$${report.issueid}`;

  try {
    return await octo.rest.issues.create({
      title,
      body,
      owner: "IzK-ArcOS",
      repo: "ArcOS-Frontend",
      labels: ["bugrep"],
    });
  } catch {
    return null;
  }
}
