import dotenv from "dotenv";
dotenv.config();
const usernames = ["mynameisgump"];
const date = new Date();
// Beginning "2008-01-01T00:00:00Z"
// End"2009-12-31T23:59:59Z"

import { Database } from "bun:sqlite";

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
  // const data = await getContributions(process.env.GITHUB_TOKEN!, "nint8835");
  console.log("Test");
  // const data = await getYearsContributed(process.env.GITHUB_TOKEN!, "nint8835");
  // console.log(data);

  // const path = "./nint8835.txt";
  // await Bun.write(path, JSON.stringify(data));
  // console.log("Hello World!");
};

main();
export default getContributions;
