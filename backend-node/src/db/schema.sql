-- SynapseEDU Learning Hub — MySQL schema (Round 2)
CREATE DATABASE IF NOT EXISTS synapseedu;
USE synapseedu;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS study_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  file_path VARCHAR(255),
  file_type ENUM('pdf','ppt','txt') DEFAULT 'pdf',
  raw_text LONGTEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_topic_id INT NULL,
  prerequisite_topic_id INT NULL,
  estimated_study_time INT DEFAULT 10,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_topic_id) REFERENCES topics(id),
  FOREIGN KEY (prerequisite_topic_id) REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS subtopics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_id INT NOT NULL,
  subtopic VARCHAR(255),
  question_text TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer INT NOT NULL,
  difficulty ENUM('easy','medium','hard') DEFAULT 'easy',
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_attempt_id INT NOT NULL,
  question_id INT NULL,
  subtopic VARCHAR(255),
  difficulty ENUM('easy','medium','hard'),
  selected_option INT,
  is_correct BOOLEAN,
  FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id INT NOT NULL,
  mastery_score DECIMAL(5,2) DEFAULT 0,
  attempts INT DEFAULT 0,
  last_review_date DATE NULL,
  UNIQUE KEY uniq_user_topic (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS revision_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_text JSON,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
