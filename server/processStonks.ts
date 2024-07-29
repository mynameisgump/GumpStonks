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

const stonksListToCsv = (stonks: [Date, number][]) => {
  let csv = "date,value\n";
  for (let stonk of stonks) {
    csv += `${stonk[0].toISOString()},${stonk[1]}\n`;
  }
  return csv;
};

const stonksForDay = (date: Date, user: UserInfo) => {
  const db = new Database("gumpdb.sqlite");

  const userId = user.user_id;
  const commitsQuery = db.query<CommitActivity, [number, string]>(
    `SELECT * FROM commit_activity WHERE user_id = ?1 AND date <= ?2 ORDER BY date ASC`
  );
  const commits = commitsQuery.all(userId, date.toISOString());

  let total_value = 0;
  for (let commit of commits) {
    const commitDate = new Date(commit.date).toISOString().split("T")[0];
    const value = calculateCommitValue(commit, date);
    total_value += value;
  }
  // Will create a table for the stocks
  // console.log(date, total_value);
  //   const insertStonksQuery = db.query(
  //     "INSERT INTO stonks (user_id, date, value) VALUES (?1, ?2, ?3)"
  //   );
  // insertStonksQuery.run(userId, date.toISOString(), total_value);
  return [date, total_value];
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

type DataAtom = {
  x: Date,
  y: number
}

type NivoData = {
  id: string,
  data: DataAtom[]
}

const main = async () => {
  const db = new Database("gumpdb.sqlite");
  // creatStonksTable(db);
  const allUsersQuery = db.query<UserInfo, null>("SELECT * FROM user");
  const users = allUsersQuery.all(null);
  const todaysDate = new Date().toISOString().split("T")[0];
  // console.log("Date to calc: ", dateToCalc);

  for (let user of users) {
    console.log(user.github_username);
    const userFile = Bun.file(`./csv/${user.github_username}.csv`);
    const userFileJson = Bun.file(`./json/${user.github_username}.json`);
    const fileExists = await userFile.exists();
    const jsonData: NivoData = {id: `${user.github_username}`, data: []}
    if (!fileExists) {
      const dayContributedQuery = db.query<CommitActivity, number>(
        `SELECT date FROM commit_activity WHERE user_id=?1 ORDER BY date ASC`
      );
      const dateObjects = dayContributedQuery.all(user.user_id);
      const allDates = dateObjects.map((date) => date.date);

      const stonks = [];
      const jsonStonks: DataAtom[] = []
      for (let date of allDates) {
        let calculatedValues = stonksForDay(new Date(date), user);
        stonks.push(stonksForDay(new Date(date), user));
        jsonStonks.push({x: calculatedValues[0] as Date, y: calculatedValues[1] as number})
      }
      jsonData.data = jsonStonks
      await Bun.write(userFileJson,JSON.stringify(jsonData))
      console.log(jsonData)
      const stonksCsv = stonksListToCsv(stonks);
      await Bun.write(userFile, stonksCsv);
    }
  }
};

main();
