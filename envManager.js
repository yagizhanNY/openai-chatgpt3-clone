const fs = require("fs");

const dir = "src/environment";
const file = "environment.ts";
const prodFile = "environment.prod.ts";

const content = `${process.env.API_DETAILS}`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    console.log("src does not exist, creating now...", process.cwd());
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  try {
    fs.writeFileSync(`${dir}/${file}`, content);
    fs.writeFileSync(`${dir}/${prodFile}`, content);

    if (fs.existsSync(`${dir}/${file}`)) {
      console.log("environment.ts created successfully", process.cwd());
      const str = fs.readFileSync(`${dir}/${file}`, "utf8").toString();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
