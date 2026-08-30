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
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  material VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS study_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject_code VARCHAR(32),
  file_name VARCHAR(255),
  file_type ENUM('pdf','ppt','txt') DEFAULT 'pdf',
  raw_text LONGTEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  subject_code VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  idx INT DEFAULT 0,
  estimated_study_time INT DEFAULT 10,
  initial_mastery INT DEFAULT 50
);

CREATE TABLE IF NOT EXISTS subtopics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_code VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_code VARCHAR(32) NOT NULL,
  subtopic VARCHAR(255),
  question_text TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer INT NOT NULL,
  difficulty ENUM('easy','medium','hard') DEFAULT 'easy'
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_code VARCHAR(32) NOT NULL,
  score INT NOT NULL,
  correct INT NOT NULL,
  total_questions INT NOT NULL,
  attempt_number INT DEFAULT 1,
  difficulty VARCHAR(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_attempt_id INT NOT NULL,
  subtopic VARCHAR(255),
  difficulty ENUM('easy','medium','hard'),
  selected_option INT,
  is_correct BOOLEAN,
  FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_code VARCHAR(32) NOT NULL,
  mastery_score DECIMAL(5,2) DEFAULT 0,
  attempts INT DEFAULT 0,
  last_review_date DATE NULL,
  UNIQUE KEY uniq_user_topic (user_id, topic_code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mastery_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  overall INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS revision_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_text JSON,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
