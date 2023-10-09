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

const db = new Database("gumpdb.sqlite");
const allUsersQuery = db.query<UserInfo, null>("SELECT * FROM user");
const users = allUsersQuery.all(null);
const todaysDate = new Date().toISOString().split("T")[0];
console.log("Today: ", todaysDate);

for (let user of users) {
  console.log(user.github_username);
  const commitsQuery = db.query<CommitActivity, number>(
    `SELECT * FROM commit_activity WHERE user_id = $user`
  );
  const commits = commitsQuery.all(user.user_id);
  const totalCommits = commits.reduce(
    (acc, curr) => acc + curr.total_commits,
    0
  );

  let total_value = 0;
  for (let commit of commits) {
    const commitDate = new Date(commit.date).toISOString().split("T")[0];
    const value = calculateCommitValue(commit, new Date());
    // const daysSinceCommit = Math.floor(
    //   (Date.parse(todaysDate) - Date.parse(commitDate)) / 86400000
    // );
    // const commitValue = commit.total_commits * 0.01;
    // const decay = Math.pow(0.9, daysSinceCommit);
    // const value = commitValue * decay;
    total_value += value;
    // console.log(
    //   commitDate,
    //   commit.total_commits,
    //   commitValue,
    //   daysSinceCommit,
    //   decay,
    //   value
    // );
  }

  console.log("User Commits:", totalCommits);
  // console.log("Stonk value: ", totalCommits * 0.01);
  console.log("Total value: ", total_value);
}

//  `SELECT * FROM commit_activity WHERE user_id = 2 AND date BETWEEN "2008-01-01T00:00:00Z" AND "2009-12-31T23:59:59Z"`
// const db = new Database("gumpdb.sqlite");
// const nintQuery = db.query<CommitActivity, null>(
//   `SELECT * FROM commit_activity WHERE user_id = 2`
// );
// const gumpQuery = db.query<CommitActivity, null>(
//   `SELECT * FROM commit_activity WHERE user_id = 1`
// );

// const nintData = nintQuery.all(null);
// const gumpData = gumpQuery.all(null);

// const data = [nintData, gumpData];

// // console.log(nintData);
// console.log();
