// Demo/fallback dataset (Computer Networks). Used to seed MySQL and as a runtime fallback
// when the DB or Gemini is unavailable, so the Learning Hub is always demonstrable.
const TOPICS = [
  { topic_id: 1, name: 'OSI Model', mastery: 91, est: 8, subtopics: ['Layer functions', 'Encapsulation', 'PDUs'] },
  { topic_id: 2, name: 'TCP/IP', mastery: 78, est: 9, subtopics: ['Handshake', 'Reliability', 'Ports & sockets'] },
  { topic_id: 3, name: 'Flow Control', mastery: 64, est: 8, subtopics: ['Sliding window', 'rwnd', 'Buffering'] },
  { topic_id: 4, name: 'Routing', mastery: 61, est: 10, subtopics: ['Link-state', 'Distance-vector', 'Forwarding'] },
  { topic_id: 5, name: 'Congestion Control', mastery: 42, est: 10, subtopics: ['cwnd', 'Loss detection', 'Slow start', 'AIMD'] },
  { topic_id: 6, name: 'AIMD Algorithm', mastery: 36, est: 10, subtopics: ['Additive increase', 'Multiplicative decrease', 'TCP congestion window', 'Fairness'] },
  { topic_id: 7, name: 'Slow Start', mastery: 55, est: 7, subtopics: ['Exponential growth', 'ssthresh', 'Reset on timeout'] },
  { topic_id: 8, name: 'TCP Congestion Avoidance', mastery: 48, est: 8, subtopics: ['Additive increase', 'Fast retransmit', 'Fast recovery'] }
];

const QUESTIONS = {
  5: [
    { question_text: 'Which mechanism is associated with TCP congestion control?', options: ['AIMD', 'DNS', 'ARP', 'DHCP'], correct_answer: 0, difficulty: 'easy', subtopic: 'cwnd' },
    { question_text: 'TCP interprets packet loss as a sign of:', options: ['A faster link', 'Network congestion', 'A new connection', 'Encryption'], correct_answer: 1, difficulty: 'easy', subtopic: 'Loss detection' },
    { question_text: 'The amount a sender can transmit is:', options: ['rwnd only', 'cwnd only', 'min(cwnd, rwnd)', 'max(cwnd, rwnd)'], correct_answer: 2, difficulty: 'medium', subtopic: 'cwnd' },
    { question_text: 'Congestion control responds to the:', options: ['Receiver buffer', 'State of the network', 'Sender CPU', 'DNS cache'], correct_answer: 1, difficulty: 'medium', subtopic: 'cwnd' },
    { question_text: 'After a timeout, TCP typically sets cwnd to:', options: ['Double its value', '1 MSS and restarts slow start', 'Its maximum', 'Zero permanently'], correct_answer: 1, difficulty: 'hard', subtopic: 'Slow start' }
  ],
  6: [
    { question_text: 'In AIMD, additive increase means cwnd is:', options: ['Doubled each RTT', 'Increased by 1 MSS each RTT', 'Halved each RTT', 'Kept constant'], correct_answer: 1, difficulty: 'easy', subtopic: 'Additive increase' },
    { question_text: 'In AIMD, multiplicative decrease on loss typically:', options: ['Halves cwnd', 'Adds 1 MSS', 'Triples cwnd', 'Sets cwnd to max'], correct_answer: 0, difficulty: 'easy', subtopic: 'Multiplicative decrease' },
    { question_text: 'If cwnd = 16 MSS and a loss occurs, AIMD sets cwnd to about:', options: ['32 MSS', '17 MSS', '8 MSS', '1 MSS'], correct_answer: 2, difficulty: 'medium', subtopic: 'TCP congestion window' },
    { question_text: 'AIMD tends to make competing flows:', options: ['Diverge', 'Converge to a fair share', 'Stop entirely', 'Use random rates'], correct_answer: 1, difficulty: 'medium', subtopic: 'Fairness' },
    { question_text: 'The TCP "sawtooth" of cwnd over time is produced by:', options: ['Slow start only', 'Additive increase then multiplicative decrease cycles', 'Flow control', 'Random loss'], correct_answer: 1, difficulty: 'hard', subtopic: 'Additive increase' }
  ]
};

const TUTOR_KB = [
  { keys: ['difference', 'flow', 'congestion'], topicId: 5, answer: 'Flow control protects the receiver (using the receiver window rwnd) and is receiver-driven/end-to-end. Congestion control protects the network (using the congestion window cwnd, reacting to loss) and is network-driven. The sender is limited by min(cwnd, rwnd).', sources: ['Flow Control — p.3', 'Congestion Control — p.5'] },
  { keys: ['aimd', 'additive', 'multiplicative'], topicId: 6, answer: 'AIMD = Additive Increase, Multiplicative Decrease. cwnd increases by ~1 MSS per RTT with no loss, and is halved on loss. This asymmetry produces the TCP sawtooth and drives flows to a fair share.', sources: ['AIMD Algorithm — p.6'] }
];

module.exports = { TOPICS, QUESTIONS, TUTOR_KB, SUBJECT: { name: 'Computer Networks', material: 'Computer_Networks_Unit4_Transport_Layer.pdf' } };
