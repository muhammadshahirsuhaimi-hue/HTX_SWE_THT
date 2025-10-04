CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE developers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE developer_skills (
    developer_id INT REFERENCES developers(id),
    skill_id INT REFERENCES skills(id),
    PRIMARY KEY (developer_id, skill_id)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'to-do',
    assignee_id INT REFERENCES developers(id),
    parent_id INT REFERENCES tasks(id) -- for subtasks later
);

CREATE TABLE task_skills (
    task_id INT REFERENCES tasks(id),
    skill_id INT REFERENCES skills(id),
    PRIMARY KEY (task_id, skill_id)
);
