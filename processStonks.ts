import { Database } from "bun:sqlite";
type UserInfo = {
  user_id: number;
  github_username: string;
};

type CommitActivity = {
  activity_id: number;
  user_id: number;
  date: string;
  total_commits: number;
};

interface Commit {
  user_id: number;
  date: string; // Assuming date is in ISO format, e.g., "2023-10-09T12:34:56Z"
  total_commits: number;
}

let dateToCalc = new Date(new Date().getTime() - 364 * 5 * 24 * 60 * 60 * 1000);

// let creatStonksTable = (db: Database) => {
//   const createStonksTable = db.query(
//     "CREATE TABLE IF NOT EXISTS stonks (stonks_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, date TEXT NOT NULL, value REAL NOT NULL, FOREIGN KEY(user_id) REFERENCES user(user_id));"
//   );
//   createStonksTable.run();
//   return db;
// };

const stonksForDay = (date: Date, user: UserInfo) => {
  const db = new Database("gumpdb.sqlite");
  const userQuery = db.query<UserInfo, [string]>(
    `SELECT * FROM user WHERE github_username = ?1`
  );

  const userId = user.user_id;
  // Filters commits based on date
  const commitsQuery = db.query<CommitActivity, [number, string]>(
    `SELECT * FROM commit_activity WHERE user_id = ?1 AND date <= ?2`
  );
  const commits = commitsQuery.all(userId, date.toISOString());
  const totalCommits = commits.reduce(
    (acc, curr) => acc + curr.total_commits,
    0
  );

  let total_value = 0;
  for (let commit of commits) {
    const commitDate = new Date(commit.date).toISOString().split("T")[0];
    const value = calculateCommitValue(commit, date);
    total_value += value;
  }
  console.log(date, total_value);
  const insertStonksQuery = db.query(
    "INSERT INTO stonks (user_id, date, value) VALUES (?1, ?2, ?3)"
  );
  // insertStonksQuery.run(userId, date.toISOString(), total_value);
  // return total_value;
};

// Good Function
function calculateCommitValue(commit: Commit, currentDate: Date): number {
  const timeDecayFactor = 0.01;
  const recentContributionMultiplier = 2;

  const commitDate = new Date(commit.date);

  const timeDifferenceInDays =
    (currentDate.getTime() - commitDate.getTime()) / (1000 * 3600 * 24);

  const baselineValue = commit.total_commits;

  const timeDecay = 1 / (1 + timeDecayFactor * timeDifferenceInDays);

  let contributionValue = baselineValue * timeDecay;

  if (timeDifferenceInDays <= 30) {
    contributionValue += baselineValue * recentContributionMultiplier;
  }
  return contributionValue;
}

const main = () => {
  const db = new Database("gumpdb.sqlite");
  // creatStonksTable(db);
  const allUsersQuery = db.query<UserInfo, null>("SELECT * FROM user");
  const users = allUsersQuery.all(null);
  const todaysDate = new Date().toISOString().split("T")[0];
  console.log("Date to calc: ", dateToCalc);

  for (let user of users) {
    console.log(user.github_username);

    const dayContributedQuery = db.query<CommitActivity, number>(
      `SELECT date FROM commit_activity WHERE user_id=?1`
    );
    const dateObjects = dayContributedQuery.all(user.user_id);
    // console.log(dateObjects);
    const allDates = dateObjects.map((date) => date.date);

    console.log(allDates);

    for (let date of allDates) {
      stonksForDay(new Date(date), user);
    }
    break;
    // Filters query based on date
    // const commitsQuery = db.query<CommitActivity, [number, string]>(
    //   `SELECT * FROM commit_activity WHERE user_id = ?1 AND date <= ?2`
    // );
    // const commits = commitsQuery.all(user.user_id, dateToCalc.toISOString());
    // console.log("Commits: ", commits.length);
    // const totalCommits = commits.reduce(
    //   (acc, curr) => acc + curr.total_commits,
    //   0
    // );

    // let total_value = 0;
    // for (let commit of commits) {
    //   const commitDate = new Date(commit.date).toISOString().split("T")[0];
    //   const value = calculateCommitValue(commit, dateToCalc);
    //   total_value += value;
    // }
  }
};

main();
