import fs from "fs";
import path from "path";

const readTemplateFile = () => {
  try {
    const templatePath = path.join(__dirname, "../views", "page-account.ejs");
    const templateData = fs.readFileSync(templatePath, "utf8");
    return templateData;
  } catch (err) {
    throw new Error("Error reading template file: " + err.message);
  }
};

export { readTemplateFile };
