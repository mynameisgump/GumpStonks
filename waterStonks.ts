import { Database } from "bun:sqlite";
import dotenv from "dotenv";
dotenv.config();
const usernames = ["mynameisgump"];
const date = new Date();
// Beginning "2008-01-01T00:00:00Z"
// End"2009-12-31T23:59:59Z"
// User Table:

//     user_id (Primary Key): Unique identifier for each GitHub user.
//     github_username: The GitHub username of the user.

// Commit Activity Table:

//     activity_id (Primary Key): Unique identifier for each daily commit activity record.
//     user_id (Foreign Key): References the user_id from the User Table.
//     date: Date of the commit activity.
//     total_commits: Total number of commits made by the user on that day.

const initGumpDb = async () => {
  const db = new Database("gumpdb.sqlite");
  await db.query(
    "CREATE TABLE IF NOT EXISTS user (user_id INTEGER PRIMARY KEY, github_username TEXT NOT NULL);"
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS commit_activity (activity_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, date TEXT NOT NULL, total_commits INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES user(user_id));"
  );
  return db;
};

const getDateJoinedGithub = async (token: string, username: string) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
            user(login: "${username}") {
              name
              createdAt
            }
          }`,
  };
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data;
};

const getYearsContributed = async (token: string, username: string) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
            user(login: "${username}") {
              name
              contributionsCollection {
                contributionYears
              }
            }
          }`,
  };
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data;
};

const getContributions = async (token: string, username: string) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
            user(login: "${username}") {
              name
              contributionsCollection(from: "2008-01-01T00:00:00Z", to: "2009-12-31T23:59:59Z"){
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      weekday
                    }
                  }
                }
              }
            }
          }`,
  };
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data;
};

const main = async () => {
  const db = await initGumpDb();

  // const data = await getContributions(process.env.GITHUB_TOKEN!, "nint8835");
  // console.log("Test");
  // const data = await getYearsContributed(process.env.GITHUB_TOKEN!, "nint8835");
  // console.log(data);

  // const path = "./nint8835.txt";
  // await Bun.write(path, JSON.stringify(data));
  // console.log("Hello World!");

  // const query = db.query("select 'Hello world' as message;");
  // query.get(); // => { message: "Hello world" }
};

main();
export default getContributions;
