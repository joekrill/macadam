import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import favicons from "favicons";
import { promises } from "fs";
import { join, resolve } from "path";
import { format } from "prettier";

expand(dotenv.config());

const destinationPath = "public";
const htmlStart = "<!-- favicons:start -->";
const htmlEnd = "<!-- favicons:end -->";

const source = process.argv[2] || "src/app/Logo.svg";

console.log(`Generating favicons from "${source}"...`);

favicons(
  resolve(source),
  {
    logging: true,
    start_url: "/",
    path: process.env.PUBLIC_URL || "",
    appName: process.env.REACT_APP_DISPLAY_NAME,
    appShortName: process.env.REACT_APP_SHORT_NAME,
    appDescription: process.env.REACT_APP_DESCRIPTION,
    theme_color: process.env.REACT_APP_THEME_COLOR,
    version: process.env.REACT_APP_VERSION,
  },
  (err, response) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const indexHtml = join(destinationPath, "index.html");
    console.log("Writing files...");
    Promise.all([
      ...response.images.map(({ contents, name }) =>
        promises.writeFile(join(destinationPath, name), contents)
      ),
      ...response.files.map(({ contents, name }) => {
        const parser = name.endsWith("xml") ? "html" : "json";
        return promises.writeFile(
          join(destinationPath, name),
          format(contents, { parser })
        );
      }),
      promises.readFile(indexHtml).then((buffer) => {
        // Reads the index.html file and replaces the content
        // between the htmlStart and htmlEnd placeholders with the
        // updated favicon data.
        const contents = buffer.toString();
        const start = contents.indexOf(htmlStart) + htmlStart.length;
        const end = contents.indexOf(htmlEnd);
        const result =
          contents.substring(0, start) +
          response.html.join("\r\n") +
          contents.substring(end);

        // Format the result using prettier.
        const output = format(result, { parser: "html" });
        return promises.writeFile(indexHtml, output);
      }),
    ]);

    console.log("Done!");
  }
);
