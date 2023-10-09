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
const db = new Database("gumpdb.sqlite");
const allUsersQuery = db.query<UserInfo, null>("SELECT * FROM user");
const users = allUsersQuery.all(null);

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
  console.log("User Commits:", totalCommits);
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
