# gumpstonks

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Baby database plans:

- Need a github user with their ID
- Total number of commits across their history

# Beginning Process:

- For each user
  - Grab their contribution years
  - For each contribution year
    - Grab all the the contributions made on each day
    - save each day alonside number of contributions into the sql database where the key is their github username
    -

# Chat GPT Database Schema:

User Table:

    user_id (Primary Key): Unique identifier for each GitHub user.
    github_username: The GitHub username of the user.

Commit Activity Table:

    activity_id (Primary Key): Unique identifier for each daily commit activity record.
    user_id (Foreign Key): References the user_id from the User Table.
    date: Date of the commit activity.
    total_commits: Total number of commits made by the user on that day.

With this schema, you can store information about GitHub users and their daily commit activities. Each user can have multiple records in the Commit Activity Table, one for each day, with the user_id linking them back to the corresponding user in the User Table. This way, you can calculate and analyze their daily commit patterns.
