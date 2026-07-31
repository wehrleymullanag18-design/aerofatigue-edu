import { copyFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("out");

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function addCompatibilityFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const childDirectory = path.join(directory, entry.name);
    const pageData = path.join(childDirectory, "__PAGE__.txt");

    if (entry.name.startsWith("__next.") && await exists(pageData)) {
      await copyFile(pageData, path.join(directory, `${entry.name}.__PAGE__.txt`));
    }

    await addCompatibilityFiles(childDirectory);
  }
}

if (await exists(outputDirectory)) {
  await addCompatibilityFiles(outputDirectory);
}
