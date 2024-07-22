const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;

// as specified in the jira
const languages = ["de_DE", "es_ES", "fr_FR", "nl_NL"];

async function getJobTitles(accessToken) {
  const mainLanguage = "en_US";
  const url = `https://api.linkedin.com/v2/titles?locale=${mainLanguage}&start=25`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const jobTitles = response.data.elements.map((title) => {
      return {
        _id: title.id,
        name: title.name.localized[Object.keys(title.name.localized)[0]],
        translation: [],
      };
    });

    for (const language of languages.filter((lang) => lang !== mainLanguage)) {
      const languageData = await fetchLanguageData(accessToken, language);
      updateTranslations(jobTitles, languageData.data.elements, language);
    }

    const outputFile = `job_titles.json`;
    fs.writeFileSync(outputFile, JSON.stringify(jobTitles, null, 2));
    console.log(`Output written to ${outputFile}`);
  } catch (error) {
    console.error(`Error fetching job titles for ${mainLanguage}:`, error);
  }
}

async function fetchLanguageData(accessToken, language) {
  const url = `https://api.linkedin.com/v2/titles?locale=${language}&start=25`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    console.error(`Error fetching job titles for ${language}:`, error);
  }
}

function updateTranslations(jobTitles, languageData, language) {
  languageData.forEach((languageTitle) => {
    const matchingTitle = jobTitles.find(
      (title) => title._id === languageTitle.id,
    );
    if (matchingTitle) {
      const langCode = language.substring(0, 2);
      matchingTitle.translation.push({
        langCode,
        translated:
          languageTitle.name.localized[
            Object.keys(languageTitle.name.localized)[0]
          ],
      });
    }
  });
}

getJobTitles(accessToken);
