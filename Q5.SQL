INSERT INTO Users(username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('mike123', 'mike@example.com', 'hashed246', 'owner'),
('john456', 'john@example.com', 'hashed135', 'owner');


INSERT INTO Dogs(owner_id, name, size)
VALUES (
    (SELECT user_id FROM Users WHERE username = 'alice123'), 'MAX', 'medium'
);
INSERT INTO Dogs(owner_id, name, size)
VALUES (
    (SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'
);
INSERT INTO Dogs(owner_id, name, size)
VALUES (
    (SELECT user_id FROM Users WHERE username = 'mike123'), 'Lucy', 'medium'
);
INSERT INTO Dogs(owner_id, name, size)
VALUES (
    (SELECT user_id FROM Users WHERE username = 'john456'), 'Nancy', 'small'
);
INSERT INTO Dogs(owner_id, name, size)
VALUES (
    (SELECT user_id FROM Users WHERE username = 'cindy123'), 'Lily', 'small'
);


INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
VALUES(
    (SELECT dog_id FROM Dogs WHERE name = 'MAX'), '2025-06-10 08:00:00', '30', 'Parklands', 'open'
);
INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
VALUES(
    (SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', '45', 'Beachside Ave', 'accepted'
);
INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
VALUES(
    (SELECT dog_id FROM Dogs WHERE name = 'Lucy'), '2025-06-12 11:35:00', '20', 'Central Park', 'open'
);
INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
VALUES(
    (SELECT dog_id FROM Dogs WHERE name = 'Nancy'), '2025-06-13 15:20:00', '35', 'Parklands', 'open'
);
INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
VALUES(
    (SELECT dog_id FROM Dogs WHERE name = 'Lily'), '2025-06-15 18:40:00', '40', 'Central Park', 'open'
);