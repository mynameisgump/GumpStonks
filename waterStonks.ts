import dotenv from "dotenv";
dotenv.config();
const usernames = ["mynameisgump"];

const getContributions = async (token: string, username: string) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
            user(login: "${username}") {
              name
              contributionsCollection {
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
const data = await getContributions(process.env.GITHUB_TOKEN!, "mynameisgump");
console.log(data);

console.log("Hello World!");
export default getContributions;
