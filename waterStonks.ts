import dotenv from "dotenv";
dotenv.config();
const usernames = ["mynameisgump"];
const date = new Date();

const getContributions = async (token: string, username: string) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
            user(login: "${username}") {
              name
              contributionsCollection(from: "2008-09-28T23:05:23Z", to: "2023-10-02T23:05:23Z"){
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
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
const data = await getContributions(process.env.GITHUB_TOKEN!, "nint8835");
const path = "./nint8835.txt";
await Bun.write(path, JSON.stringify(data));
console.log("Hello World!");
export default getContributions;
