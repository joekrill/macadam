import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import favicons, { FaviconResponse } from "favicons";
import { promises } from "fs";
import { join, resolve } from "path";
import { format } from "prettier";

expand(dotenv.config());

const destinationPath = "public";
const htmlStart = "<!-- favicons:start -->";
const htmlEnd = "<!-- favicons:end -->";

const source = process.argv[2] || "src/app/Logo.svg";

const run = async () => {
  console.log(`Generating favicons from "${source}"...`);

  let response: FaviconResponse;

  try {
    response = await favicons(resolve(source), {
      // logging: true,
      appDescription: process.env.REACT_APP_DESCRIPTION,
      appName: process.env.REACT_APP_DISPLAY_NAME,
      appShortName: process.env.REACT_APP_SHORT_NAME,
      path: process.env.PUBLIC_URL || "",
      start_url: "/",
      theme_color: process.env.REACT_APP_THEME_COLOR,
      version: process.env.REACT_APP_VERSION,
    });
  } catch (error) {
    console.error("Failed to generate favicons");
    console.error(error);
    return;
  }

  console.log("Writing files...");

  const indexHtml = join(destinationPath, "index.html");
  await Promise.all([
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
};

run();
