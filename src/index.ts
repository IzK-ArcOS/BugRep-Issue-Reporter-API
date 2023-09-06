import express from "express";
import { Authenticate } from "./auth/main";
import { getReport } from "./report/main";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { createIssue } from "./issues/main";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/issue", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const err = (c: number) => {
    res.statusCode = c;
    res.end();
  };

  if (!req.body || !req.query.id) return err(400);

  const { identity, password } = JSON.parse(req.body);

  if (!identity || !password) return err(400);

  const token = await Authenticate(identity, password);

  if (!token) {
    res.statusCode = 403;
    res.end();

    return;
  }

  const report = await getReport(req.query.id as string, token);

  if (!report) return err(404);

  const issue = await createIssue(report, process.env.GHTOKEN as string);

  if (!issue) return err(500);

  try {
    res.contentType("application/json");
    res.write(JSON.stringify(issue));
    res.end();
  } catch (e) {
    console.log("WARN: couldn't write response!");
    console.log(e);
  }
});

config();

if (!process.env.GHTOKEN) process.exit(1);

app.listen(5689, () => {
  console.log(`API online!`);
});
