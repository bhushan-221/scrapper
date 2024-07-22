const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;

let start;
let counter = 0;
const fileContent = fs.readFileSync("start.txt", "utf8");
start = parseInt(fileContent);

const languages = ["en_US", "de_DE", "es_ES", "fr_FR", "nl_NL"];

async function getJobTitles(accessToken) {
  const enJobTitles = await fetchJobTitles("en_US", accessToken);

  for (const language of languages.slice(1)) {
    const langJobTitles = await fetchJobTitles(language, accessToken);

    for (const jobTitle of langJobTitles) {
      const enJobTitle = enJobTitles.find(
        (enJob) => enJob._id.$oid === jobTitle._id.$oid,
      );
      if (enJobTitle) {
        const langCode = language.substring(0, 2);
        enJobTitle.translation.push({
          langCode,
          translated: jobTitle.name,
        });
      }
    }
  }

  fs.writeFileSync("job_titles.json", JSON.stringify(enJobTitles, null, 2));
  console.log("Output written to job_titles.json");
}

async function fetchJobTitles(language, accessToken) {
  const url = `https://api.linkedin.com/v2/titles?locale=${language}&start=${start}`;

  try {
    const response = await axios.get(url, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const jobTitles = response.data.elements;
    if (counter == 0) {
      const lastId = jobTitles[jobTitles.length - 1].id;
      start = start = lastId + 1;
      console.log(`Updated start variable: ${start}`);
      fs.writeFileSync("start.txt", `${start}\n`);
    }
    counter = 1;
    return jobTitles.map((title) => {
      const name = title.name.localized[Object.keys(title.name.localized)[0]];
      return {
        _id: { $oid: title.id },
        name,
        translation: [],
      };
    });
  } catch (error) {
    console.error(`Error fetching job titles for ${language}:`, error);
    return [];
  }
}

getJobTitles(accessToken);
