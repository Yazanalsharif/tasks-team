USE task_manager;

CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(250) NOT NULL DEFAULT 'No Name',
    email VARCHAR(250) UNIQUE NOT NULL,
    user_password VARCHAR(250) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE teams (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamname VARCHAR(50) NOT NULL DEFAULT 'teamname',
    own INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (own) REFERENCES users(id)
);

CREATE TABLE tasks (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    task VARCHAR(255) NOT NULL DEFAULT 'task',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    task_type INT NOT NULL,
    user_id INT,
    team_id INT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(team_id) REFERENCES teams(id)
);

CREATE TABLE group_map(
    user_id INT NOT NULL,
    team_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY(team_id) REFERENCES teams(id),
    PRIMARY KEY (user_id, team_id)
);

SELECT
    *
FROM
    users
    INNER join teams ON users.id = teams.own
WHERE
    teamname = 'group'
ALTER TABLE
    users
ALTER COLUMN
    email VARCHAR(10) COLLATE SQL_Latin1_General_CP1_CS_AS
SELECT
    username,
    teamname,
    task,
    completed
FROM
    users
    INNER JOIN group_map ON users.id = user_id
    INNER JOIN teams ON group_map.team_id = teams.id
    LEFT JOIN tasks ON group_map.team_id = tasks.team_id
WHERE
    users.id = 90
    AND teams.id = 24;

SELECT
    teamname
FROM
    users
    INNER JOIN group_map ON users.id = user_id
    INNER JOIN teams ON teams.id = team_id
WHERE
    users.id = 90
    AND teams.id = 24;

SELECT
    username,
    teamname,
    task,
    completed
FROM
    users
    INNER JOIN group_map ON users.id = user_id
    INNER JOIN teams ON group_map.team_id = teams.id
    LEFT JOIN tasks ON group_map.team_id = tasks.team_id
WHERE
    users.id = 90;

SELECT
    username,
    email,
    id
FROM
    users
    INNER JOIN tasks ON users.id = own
WHERE
    own = ?
SELECT
    teamname,
    teams.id
FROM
    group_map
    INNER JOIN teams ON team_id = teams.id
WHERE
    user_id = ?
SELECT
    username,
    teamname,
    task,
    completed,
    tasks.id AS taskId
FROM
    users
    INNER JOIN group_map ON users.id = user_id
    INNER JOIN teams ON group_map.team_id = teams.id
    LEFT JOIN tasks ON group_map.team_id = tasks.team_id
WHERE
    users.id = ?
    AND completed = ?
ORDER BY
    tasks.id DESC;

SELECT
    username,
    teams.id AS teamId,
    task,
    completed,
    tasks.id AS taskId
FROM
    users
    INNER JOIN group_map ON users.id = user_id
    INNER JOIN teams ON group_map.team_id = teams.id
    LEFT JOIN tasks ON group_map.team_id = tasks.team_id
WHERE
    users.id = 101
    AND completed = false
ORDER BY
    tasks.id DESC;

/* GET NUMBER OF USERS TO SPECIFIC TEAM*/
SELECT
    COUNT(*)
FROM
    teams
    INNER JOIN group_map ON teams.id = team_id
GROUP BY
    team_id;

/*Get All users to specific team*/
SELECT
    username,
    email,
    users.id AS user_id
FROM
    users
    INNER JOIN group_map ON users.id = user_id
WHERE
    team_id = 29;