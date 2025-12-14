// backend/oumi_eval/run_eval.js
import { exec } from "child_process";
import path from "path";

export function runOumiEvaluation() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join("oumi_eval", "run_eval.py");

    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        try {
          const match = stdout.match(/\{.*\}/);
          resolve(JSON.parse(match[0].replace(/'/g, '"')));
        } catch {
          reject("Failed to parse OUMI output");
        }
      }
    });
  });
}
