const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;

// as specified in the jira
const languages = ["en_US", "zh_CN", "es_ES", "nl_NL", "fr_FR"];

async function getJobTitles(accessToken) {
  for (const language of languages) {
    const url = `https://api.linkedin.com/v2/titles?locale=${language}&start=25`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const jobTitles = response.data.elements;
      const jobTitlesFormat = jobTitles.map((title) => {
        const name = title.name.localized[Object.keys(title.name.localized)[0]];
        // the translation output format is not specified and hence i left it blank
        const translation = [
          {
            langCode: "de",
            translated: "",
          },
          {
            langCode: "es",
            translated: "",
          },
          {
            langCode: "fr",
            translated: "",
          },
          {
            langCode: "nl",
            translated: "",
          },
        ];
        return {
          _id: { $oid: title.id },
          name,
          translation,
        };
      });
      const outputFile = `job_titles_${language}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(jobTitlesFormat, null, 2));
      console.log(`Output written to ${outputFile}`);
    } catch (error) {
      console.error(`Error fetching job titles for ${language}:`, error);
    }
  }
}

getJobTitles(accessToken);
