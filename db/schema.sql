-- Drop tables if re-creating from scratch
DROP TABLE IF EXISTS task_skills CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS developer_skills CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
DROP TABLE IF EXISTS skills CASCADE;

-- Skills table (optional, not required for this version)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Developers table
CREATE TABLE developers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Developer to Skill mapping
CREATE TABLE developer_skills (
    developer_id INT REFERENCES developers(id),
    skill_id INT REFERENCES skills(id),
    PRIMARY KEY (developer_id, skill_id)
);

-- Tasks table with skills as TEXT[]
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'to-do',
    assignee_id INT REFERENCES developers(id),
    parent_id INT REFERENCES tasks(id) ON DELETE SET NULL,
    skills TEXT[]
);

-- Task skills join table
CREATE TABLE task_skills (
    task_id INT REFERENCES tasks(id),
    skill_id INT REFERENCES skills(id),
    PRIMARY KEY (task_id, skill_id)
);