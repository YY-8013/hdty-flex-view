const fs = require("fs");
const path = require("path");
const moment = require("moment");

// 从vue.config.js 获取项目名称
const projectName = process.env.VUE_APP_PROJECT_NAME || "hdty-flex-view-web";
const versionFile = "../public/version.json";

// 读取当前版本
function getCurrentVersion() {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, versionFile), "utf8")
    );
  } catch (e) {
    console.error(" 读取版本文件失败，使用默认值");
    return {
      version: "1.0.0",
      main: "1.0",
      revised: 0,
      datetime: moment().format("YYYYMMDDHHmmss"),
      lastVersion: "1.0.0",
      count: 1,
      versionDir: `/${projectName}`,
      lastVersionDir: `/${projectName}`
    };
  }
}

// 生成新版本
function generateNewVersion(current) {
  const [main, sub, revised] = current.version.split(".").map(Number);
  const newRevised = revised + 1;

  return {
    version: `${main}.${sub}.${newRevised}`,
    main: `${main}.${sub}`,
    revised: newRevised,
    datetime: moment().format("YYYYMMDDHHmmss"),
    lastVersion: current.version,
    count: current.count + 1,
    versionDir: `/${projectName}`,
    lastVersionDir: current.versionDir
  };
}

// 执行版本更新
const currentVersion = getCurrentVersion();
const newVersion = generateNewVersion(currentVersion);

fs.writeFileSync(
  path.resolve(__dirname, versionFile),
  JSON.stringify(newVersion, null, 2)
);

console.log(" 版本更新成功:");
console.log(` 旧版本: ${currentVersion.version}  (${currentVersion.datetime})`);
console.log(` 新版本: ${newVersion.version}  (${newVersion.datetime})`);
console.log(` 项目路径: ${newVersion.versionDir}`);
