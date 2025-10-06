INSERT INTO skills (name) VALUES ('Frontend'), ('Backend');

INSERT INTO developers (name) VALUES ('Alice'), ('Bob'), ('Carol'), ('Dave');

-- Map skills to devs
INSERT INTO developer_skills VALUES 
    (1, 1),  -- Alice - Frontend
    (2, 2),  -- Bob - Backend
    (3, 1), (3, 2), -- Carol - Frontend + Backend
    (4, 2);  -- Dave - Backend
