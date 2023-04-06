const fs = require("fs");
const path = require("path");

const dir = "src/environments";
const file = "environment.ts";
const prodFile = "environment.prod.ts";

const content = `${process.env.API_DETAILS}`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    console.log("src does not exist, creating now...", process.cwd());
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
      console.log("Folder created successfully " + dir, process.cwd());
    });
  }

  try {
    fs.writeFileSync(path.join(dir, file), content);
    fs.writeFileSync(path.join(dir, prodFile), content);

    if (fs.existsSync(path.join(dir, file))) {
      console.log("environment.ts created successfully", process.cwd());
      const str = fs.readFileSync(path.join(dir, file), "utf8").toString();
      console.log(str);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
