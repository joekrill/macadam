/// <reference types="../src/vite-env" />
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
      appDescription: process.env.VITE_DESCRIPTION,
      appName: process.env.VITE_DISPLAY_NAME,
      appShortName: process.env.VITE_SHORT_NAME,
      start_url: "/",
      theme_color: process.env.VITE_THEME_COLOR,
      background: process.env.VITE_THEME_COLOR,
      version: process.env.VITE_VERSION,
    });
  } catch (error) {
    console.error("Failed to generate favicons");
    console.error(error);
    return;
  }

  console.log("Writing files...");

  const indexHtml = "index.html";
  await Promise.all([
    ...response.images.map(({ contents, name }) =>
      promises.writeFile(join(destinationPath, name), contents),
    ),
    ...response.files.map(async ({ contents, name }) => {
      const parser = name.endsWith("xml") ? "html" : "json";
      const data = await format(contents, { parser });
      return promises.writeFile(join(destinationPath, name), data);
    }),
    promises.readFile(indexHtml).then(async (buffer) => {
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
      return promises.writeFile(indexHtml, await output);
    }),
  ]);

  console.log("Done!");
};

run();
