**Job Titles Fetcher**
=====================

**How it works**
---------------

### Step 1: Read Starting Point

The script reads the `start.txt` file to determine the starting point for fetching job titles.

### Step 2: Fetch Job Titles for Main Language

It fetches job titles for the main language (`en_US`) from the LinkedIn API.

### Step 3: Map Job Titles

It maps the fetched job titles to a simple object with `_id`, `name`, and `translation` properties.

### Step 4: Merge with Existing Job Titles

It reads the existing `job_titles.json` file and merges the new job titles with the existing ones.

### Step 5: Fetch Job Titles for Other Languages

It fetches job titles for other languages (`de_DE`, `es_ES`, `fr_FR`, `nl_NL`) and updates the translations for each job title.

### Step 6: Write to JSON File

It writes the updated job titles to the `job_titles.json` file.

### Step 7: Update Starting Point

It updates the `start.txt` file with the last fetched job title ID.

**Requirements**
---------------

### Libraries

* `axios` library for making API requests
* `fs` library for reading and writing files
* `dotenv` library for loading environment variables

### Environment Variables

* `ACCESS_TOKEN` environment variable for LinkedIn API authentication

**Run the Script**
-----------------

### Run using Node.js

```
node script.js
```