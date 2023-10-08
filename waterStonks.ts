import { Database } from "bun:sqlite";
import dotenv from "dotenv";
dotenv.config();
const usernames = ["mynameisgump", "nint8835", "DanTheMan"];
const date = new Date();
// Beginning "2008-01-01T00:00:00Z"
// End"2009-12-31T23:59:59Z"

const queries = {};

const initGumpDb = async () => {
  const db = new Database("gumpdb.sqlite");
  const createUserTable = db.query(
    "CREATE TABLE IF NOT EXISTS user (user_id INTEGER PRIMARY KEY, github_username TEXT NOT NULL, UNIQUE(user_id,github_username));"
  );
  const createCommitTable = db.query(
    "CREATE TABLE IF NOT EXISTS commit_activity (activity_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, date TEXT NOT NULL, total_commits INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES user(user_id));"
  );

  createUserTable.run();
  createCommitTable.run();
  return db;
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

const getContributionsForYear = async (
  token: string,
  username: string,
  year: number
) => {
  const startDate = new Date(year, 0, 1, 0, 0, 0);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
            user(login: "${username}") {
              name
              contributionsCollection(from: "${startDate.toISOString()}", to: "${endDate.toISOString()}") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
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

  for (let username of usernames) {
    const testInsertUser = db.prepare(
      `INSERT INTO user(github_username) SELECT $username WHERE NOT EXISTS (SELECT 1 FROM user WHERE github_username = $username)`
    );
    testInsertUser.run({ $username: username });

    break;
  }

  usernames.forEach((username) => {
    //     INSERT INTO User (github_username)
    // SELECT 'new_github_username'
    // WHERE NOT EXISTS (
    //     SELECT 1
    //     FROM User
    //     WHERE github_username = 'new_github_username'
    // );
    // const testInsertUser = db.prepare(
    //   `INSERT INTO user(github_username) SELECT $username WHERE NOT EXISTS (SELECT 1 FROM user WHERE github_username = $username)`
    // );
    // testInsertUser.run({ $username: username });
    // const insertUser = db.prepare(
    //   `INSERT OR IGNORE INTO user(github_username) VALUES($username)`
    // );
    // insertUser.run({ $username: username });
    // const yearsContributed = await getYearsContributed(
    //   process.env.GITHUB_TOKEN,
    //   username
    // );
    // const years = yearsContributed.data.user.contributionsCollection.contributionYears;
    // console.log(years);
    // years.forEach(async (year) => {
    //   const contributionsForYear = await getContributionsForYear(
    //     process.env.GITHUB_TOKEN,
    //     username,
    //     year
    //   );
    //   const weeks = contributionsForYear.data.user.contributionsCollection.contributionCalendar.weeks;
    //   weeks.forEach(async (week) => {
    //     const days = week.contributionDays;
    //     days.forEach(async (day) => {
    //       const insertUser = db.prepare(
    //         "INSERT INTO user (github_username) VALUES (?)"
    //       );
    //       insertUser.run(username);
    //       const insertCommit = db.prepare(
    //         "INSERT INTO commit_activity (user_id, date, total_commits) VALUES (?, ?, ?)"
    //       );
    //       insertCommit.run(1, day.date, day.contributionCount);
    //     });
    //   });
    // });
  });
};

main();
