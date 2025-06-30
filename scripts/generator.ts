import { config } from "dotenv";
import { resolve } from "path";
import Parse from "parse/node.js";
import fs from "fs";

// Load .dev.vars file
config({ path: resolve(process.cwd(), ".dev.vars") });

Parse.initialize(process.env.PARSE_APP_ID!, process.env.PARSE_JS_KEY!);
Parse.serverURL = process.env.PARSE_SERVER_URL!;

export const getData = async (className: string): Promise<string | null> => {
  const query = new Parse.Query(className);
  query.equalTo("year", parseInt(process.env.YEAR!));
  query.ascending("createdAt");

  try {
    const objects = await query.find();
    return JSON.stringify(
      objects.map((object: Parse.Object) => object.toJSON()),
      null,
      2
    );
  } catch (error) {
    console.error(`Error fetching ${className}:`, error);
    return null;
  }
};

export const getRoleData = async (roleName: string): Promise<string | null> => {
  const query = new Parse.Query(Parse.Role);
  query.equalTo("name", roleName);

  try {
    const role = await query.first();
    if (!role) {
      console.warn(`Role ${roleName} not found`);
      return null;
    }
    const userIds = (await Parse.Cloud.run("getUserIds", {
      id: role.id,
    })) as string[];
    const q = new Parse.Query("Profile");
    const ary = userIds.map((id) => ({
      __type: "Pointer",
      className: "_User",
      objectId: id,
    }));
    q.containedIn("user", ary);
    q.ascending("createdAt");
    const profiles = await q.find();
    return JSON.stringify(
      profiles.map((profile) => {
        const json = profile.toJSON();
        ["objectId", "ACL", "email", "createdAt", "updatedAt"].forEach(
          (key) => delete json[key]
        );
        return json;
      }),
      null,
      2
    );
  } catch (error) {
    console.error(`Error fetching ${roleName}:`, error);
    return null;
  }
};

const createClassData = async (className: string, fileName?: string) => {
  const data = await getData(className);
  if (!fileName) {
    return data;
  }
  saveDataToFile(data, fileName);
};

const saveDataToFile = async (data: string | null, fileName: string) => {
  if (!data) {
    console.error("No data to save");
    return;
  }
  const filePath = `app/data/${fileName}.json`;
  // Check folder exists, if not create it
  if (!fs.existsSync("app/data")) {
    fs.mkdirSync("app/data", { recursive: true });
  }
  fs.writeFileSync(filePath, data);
  console.log(`Data saved to ${filePath}`);
};

const saveRoleDataToFile = async (roleName: string, fileName: string) => {
  const data = await getRoleData(`${roleName}${process.env.YEAR}`);
  if (!data) {
    console.error(`No data for role ${roleName}`);
    return;
  }
  const filePath = `app/data/${fileName}.json`;
  // Check folder exists, if not create it
  if (!fs.existsSync("app/data")) {
    fs.mkdirSync("app/data", { recursive: true });
  }
  fs.writeFileSync(filePath, data);
  console.log(`Role data for ${roleName} saved to ${filePath}`);
};

(async () => {
  await Promise.all(
    ["Sponsor", "Article"].map((className) =>
      createClassData(className, `${className.toLowerCase()}s`)
    )
  );
  await Promise.all(
    ["Organizer", "Speaker"].map((roleName) =>
      saveRoleDataToFile(roleName, `${roleName.toLowerCase()}s`)
    )
  );
})();
