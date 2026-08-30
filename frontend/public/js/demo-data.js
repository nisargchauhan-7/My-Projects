/* ============================================================
   Seeded demo dataset — Subject: Computer Networks
   Mirrors the Node/MySQL seed so the preview works fully offline.
   ============================================================ */
window.DEMO = {
  subject: { id: 'cn', name: 'Computer Networks', material: 'Computer_Networks_Unit4_Transport_Layer.pdf' },

  // initialMastery drives the first-load learning profile
  topics: [
    {
      id: 't1', idx: 1, name: 'OSI Model', initialMastery: 91, estMin: 8,
      summary: 'The OSI (Open Systems Interconnection) model is a 7-layer conceptual framework that standardises how data moves across a network, from physical signalling up to application-level exchange.',
      keyConcepts: ['7 layered architecture', 'Encapsulation & decapsulation', 'Layer isolation / abstraction', 'PDUs at each layer'],
      definitions: [
        { term: 'Encapsulation', def: 'Each layer adds its own header (and sometimes trailer) to the data unit received from the layer above.' },
        { term: 'PDU', def: 'Protocol Data Unit — the named data unit at a layer (segment, packet, frame, bit).' }
      ],
      examples: ['Layer 7 Application → HTTP request', 'Layer 4 Transport → TCP segment', 'Layer 3 Network → IP packet', 'Layer 2 Data Link → Ethernet frame'],
      related: ['t2'], subtopics: ['Layer functions', 'Encapsulation', 'PDUs']
    },
    {
      id: 't2', idx: 2, name: 'TCP/IP', initialMastery: 78, estMin: 9,
      summary: 'The TCP/IP suite is the practical 4-layer model powering the Internet. TCP provides reliable, connection-oriented, ordered delivery; IP handles best-effort routing of packets between hosts.',
      keyConcepts: ['Connection-oriented TCP', 'Three-way handshake', 'Reliable ordered delivery', 'Best-effort IP'],
      definitions: [
        { term: 'Three-way handshake', def: 'SYN → SYN-ACK → ACK sequence used to establish a TCP connection.' },
        { term: 'Segment', def: 'The TCP PDU containing a portion of the byte stream plus TCP header.' }
      ],
      examples: ['Client sends SYN, server replies SYN-ACK, client sends ACK', 'Sequence & acknowledgement numbers track the byte stream'],
      related: ['t1', 't3', 't5'], subtopics: ['Handshake', 'Reliability', 'Ports & sockets']
    },
    {
      id: 't3', idx: 3, name: 'Flow Control', initialMastery: 64, estMin: 8,
      summary: 'Flow control prevents a fast sender from overwhelming a slow receiver. In TCP this is achieved with a sliding window advertised by the receiver (rwnd).',
      keyConcepts: ['Sliding window', 'Receiver window (rwnd)', 'Buffer management', 'End-to-end (sender↔receiver)'],
      definitions: [
        { term: 'rwnd', def: 'Receiver Window — the amount of free buffer space the receiver advertises to the sender.' },
        { term: 'Sliding window', def: 'A window of bytes the sender may transmit without waiting for an ACK.' }
      ],
      examples: ['Receiver advertises rwnd = 4000 bytes; sender limits in-flight data accordingly', 'If the receiver buffer fills, rwnd shrinks toward 0'],
      related: ['t5'], subtopics: ['Sliding window', 'rwnd', 'Buffering']
    },
    {
      id: 't4', idx: 4, name: 'Routing', initialMastery: 61, estMin: 10,
      summary: 'Routing determines the path packets take across interconnected networks. Algorithms build forwarding tables using link-state or distance-vector approaches.',
      keyConcepts: ['Forwarding table', 'Link-state (OSPF)', 'Distance-vector (RIP)', 'Shortest path'],
      definitions: [
        { term: 'Distance-vector', def: 'Routers share their distance estimates to destinations with neighbours (e.g. RIP).' },
        { term: 'Link-state', def: 'Routers flood link information and each computes shortest paths (e.g. OSPF, Dijkstra).' }
      ],
      examples: ['Dijkstra computes shortest paths in link-state routing', 'RIP counts hops as its metric'],
      related: ['t2'], subtopics: ['Link-state', 'Distance-vector', 'Forwarding']
    },
    {
      id: 't5', idx: 5, name: 'Congestion Control', initialMastery: 42, estMin: 10,
      summary: 'Congestion control limits the total data injected into the network to avoid overloading routers. Unlike flow control (receiver-limited), congestion control responds to the state of the network itself using the congestion window (cwnd).',
      keyConcepts: ['Congestion window (cwnd)', 'Network-driven (not receiver-driven)', 'Packet loss as a congestion signal', 'Slow start + congestion avoidance', 'AIMD'],
      definitions: [
        { term: 'cwnd', def: 'Congestion Window — sender-side limit on unacknowledged data, adjusted based on perceived network congestion.' },
        { term: 'Effective window', def: 'min(cwnd, rwnd) — the actual amount the sender may transmit.' }
      ],
      examples: ['On packet loss (timeout), TCP treats it as congestion and reduces cwnd', 'The sender may send min(cwnd, rwnd) bytes'],
      related: ['t3', 't6', 't7', 't8'], subtopics: ['cwnd', 'Loss detection', 'Slow start', 'AIMD']
    },
    {
      id: 't6', idx: 6, name: 'AIMD Algorithm', initialMastery: 36, estMin: 10,
      summary: 'AIMD (Additive Increase, Multiplicative Decrease) is the core control law of TCP congestion avoidance. It grows the congestion window slowly (add 1 MSS per RTT) but cuts it aggressively (halve) on loss — producing the classic TCP "sawtooth" and fair sharing of bandwidth.',
      keyConcepts: ['Additive increase (+1 MSS / RTT)', 'Multiplicative decrease (cwnd ← cwnd / 2)', 'Sawtooth behaviour', 'Fairness & convergence'],
      definitions: [
        { term: 'Additive Increase', def: 'While no loss, cwnd increases by 1 MSS each RTT — cautious probing for more bandwidth.' },
        { term: 'Multiplicative Decrease', def: 'On a loss event, cwnd is multiplied by a factor (typically ½) — a fast back-off.' }
      ],
      examples: ['cwnd grows 10→11→12 MSS per RTT (additive)', 'On loss cwnd 12 → 6 MSS (multiplicative)', 'Repeated cycles form the TCP sawtooth'],
      related: ['t5', 't8'], subtopics: ['Additive increase', 'Multiplicative decrease', 'TCP congestion window', 'Fairness']
    },
    {
      id: 't7', idx: 7, name: 'Slow Start', initialMastery: 55, estMin: 7,
      summary: 'Slow start ramps a new connection quickly: cwnd starts small and doubles every RTT (exponential growth) until it reaches the slow-start threshold (ssthresh) or a loss occurs, then TCP switches to congestion avoidance.',
      keyConcepts: ['Exponential growth', 'ssthresh', 'Transition to congestion avoidance', 'cwnd ← 1 MSS on timeout'],
      definitions: [
        { term: 'ssthresh', def: 'Slow-start threshold — the cwnd value at which TCP switches from slow start to congestion avoidance.' }
      ],
      examples: ['cwnd doubles: 1 → 2 → 4 → 8 MSS each RTT', 'At ssthresh TCP moves to additive increase'],
      related: ['t5', 't6', 't8'], subtopics: ['Exponential growth', 'ssthresh', 'Reset on timeout']
    },
    {
      id: 't8', idx: 8, name: 'TCP Congestion Avoidance', initialMastery: 48, estMin: 8,
      summary: 'Congestion avoidance is the phase after slow start where cwnd grows linearly (additive increase) to probe for bandwidth gently, and reacts to loss via multiplicative decrease — i.e. it applies AIMD.',
      keyConcepts: ['Linear (additive) growth', 'Applies AIMD', 'Fast retransmit / fast recovery', 'Triple duplicate ACK'],
      definitions: [
        { term: 'Fast retransmit', def: 'Retransmitting a segment after 3 duplicate ACKs, without waiting for a timeout.' }
      ],
      examples: ['Three duplicate ACKs trigger fast retransmit', 'cwnd grows by 1 MSS per RTT in this phase'],
      related: ['t5', 't6', 't7'], subtopics: ['Additive increase', 'Fast retransmit', 'Fast recovery']
    }
  ],

  // Questions per topic. subtopic used for weak-concept detection.
  questions: {
    t1: [
      { id:'q1', d:'easy', st:'Layer functions', text:'How many layers are defined in the OSI model?', options:['4','5','7','9'], correct:2, explain:'The OSI model has 7 layers, from Physical (1) up to Application (7).' },
      { id:'q2', d:'easy', st:'PDUs', text:'Which PDU is used at the Network layer?', options:['Frame','Packet','Segment','Bit'], correct:1, explain:'The Network layer works with packets; frames are Layer 2, segments Layer 4.' },
      { id:'q3', d:'medium', st:'Encapsulation', text:'During encapsulation, what does each layer add to the data from the layer above?', options:['A checksum only','Its own header (and possibly trailer)','A new IP address','Nothing'], correct:1, explain:'Encapsulation means each layer prepends its own header (and sometimes a trailer).' },
      { id:'q4', d:'medium', st:'Layer functions', text:'Which layer is responsible for end-to-end reliable delivery in OSI?', options:['Network','Transport','Session','Data Link'], correct:1, explain:'The Transport layer (Layer 4) handles end-to-end delivery and reliability.' },
      { id:'q5', d:'hard', st:'Layer functions', text:'Encryption and data formatting are primarily handled at which OSI layer?', options:['Application','Presentation','Session','Transport'], correct:1, explain:'The Presentation layer (6) handles translation, encryption and formatting.' }
    ],
    t2: [
      { id:'q1', d:'easy', st:'Handshake', text:'TCP is best described as:', options:['Connectionless','Connection-oriented','Broadcast-only','Stateless'], correct:1, explain:'TCP is connection-oriented and reliable.' },
      { id:'q2', d:'easy', st:'Handshake', text:'Which sequence establishes a TCP connection?', options:['ACK → SYN → FIN','SYN → SYN-ACK → ACK','SYN → FIN → ACK','ACK → ACK → ACK'], correct:1, explain:'The three-way handshake is SYN, SYN-ACK, ACK.' },
      { id:'q3', d:'medium', st:'Reliability', text:'How does TCP ensure ordered delivery?', options:['Using IP addresses','Using sequence & acknowledgement numbers','Using MAC addresses','It does not'], correct:1, explain:'Sequence and ACK numbers let TCP reorder and confirm bytes.' },
      { id:'q4', d:'medium', st:'Ports & sockets', text:'A socket is uniquely identified by:', options:['MAC address','IP + port pair','Only a port','Only an IP'], correct:1, explain:'A socket = IP address + port (a connection = pair of sockets).' },
      { id:'q5', d:'hard', st:'Reliability', text:'IP provides which kind of service to TCP?', options:['Reliable ordered delivery','Best-effort, unreliable delivery','Encrypted delivery','Guaranteed bandwidth'], correct:1, explain:'IP is best-effort; TCP layers reliability on top of it.' }
    ],
    t3: [
      { id:'q1', d:'easy', st:'rwnd', text:'Flow control primarily prevents overwhelming the:', options:['Router','Receiver','Sender','Switch'], correct:1, explain:'Flow control protects a slow receiver from a fast sender.' },
      { id:'q2', d:'easy', st:'Sliding window', text:'What does rwnd stand for?', options:['Router window','Receiver window','Rate window','Reliable window'], correct:1, explain:'rwnd is the receiver window advertised by the receiver.' },
      { id:'q3', d:'medium', st:'Sliding window', text:'The sliding window lets the sender transmit:', options:['One byte at a time','Multiple bytes before waiting for an ACK','Only after every ACK','Unlimited data'], correct:1, explain:'The window allows several unacknowledged bytes in flight.' },
      { id:'q4', d:'medium', st:'Buffering', text:'If the receiver buffer fills up, rwnd will:', options:['Grow','Shrink toward zero','Stay fixed','Become negative'], correct:1, explain:'A full buffer causes the advertised window to shrink toward 0.' },
      { id:'q5', d:'hard', st:'rwnd', text:'Flow control is best described as:', options:['Network-driven','Receiver-driven (end-to-end)','Router-driven','Random'], correct:1, explain:'Flow control is receiver-driven; congestion control is network-driven.' }
    ],
    t4: [
      { id:'q1', d:'easy', st:'Forwarding', text:'A forwarding table maps a destination to a(n):', options:['Password','Outgoing interface / next hop','Port number','MAC vendor'], correct:1, explain:'It maps destinations to the next hop / outgoing interface.' },
      { id:'q2', d:'easy', st:'Distance-vector', text:'RIP is an example of which routing type?', options:['Link-state','Distance-vector','Static only','Source routing'], correct:1, explain:'RIP is a distance-vector protocol using hop count.' },
      { id:'q3', d:'medium', st:'Link-state', text:'OSPF computes shortest paths using:', options:['Bellman-Ford','Dijkstra','Round robin','Random walk'], correct:1, explain:'OSPF (link-state) uses Dijkstra’s shortest path algorithm.' },
      { id:'q4', d:'hard', st:'Distance-vector', text:'The "count to infinity" problem is associated with:', options:['Link-state','Distance-vector','Flow control','Slow start'], correct:1, explain:'Count-to-infinity is a classic distance-vector convergence problem.' }
    ],
    t5: [
      { id:'q1', d:'easy', st:'cwnd', text:'Which mechanism is associated with TCP congestion control?', options:['AIMD','DNS','ARP','DHCP'], correct:0, explain:'AIMD (Additive Increase Multiplicative Decrease) drives TCP congestion control. DNS, ARP and DHCP are unrelated.' },
      { id:'q2', d:'easy', st:'Loss detection', text:'TCP interprets packet loss as a sign of:', options:['A faster link','Network congestion','A new connection','Encryption'], correct:1, explain:'TCP treats loss (timeouts / dup ACKs) as a congestion signal.' },
      { id:'q3', d:'medium', st:'cwnd', text:'The amount a sender can transmit is:', options:['rwnd only','cwnd only','min(cwnd, rwnd)','max(cwnd, rwnd)'], correct:2, explain:'The effective window is min(cwnd, rwnd).' },
      { id:'q4', d:'medium', st:'cwnd', text:'Congestion control differs from flow control because it responds to the:', options:['Receiver buffer','State of the network','Sender CPU','DNS cache'], correct:1, explain:'Congestion control is network-driven; flow control is receiver-driven.' },
      { id:'q5', d:'hard', st:'Slow start', text:'After a timeout, TCP typically sets cwnd to:', options:['Double its value','1 MSS and restarts slow start','Its maximum','Zero permanently'], correct:1, explain:'A timeout resets cwnd to 1 MSS and re-enters slow start.' }
    ],
    t6: [
      { id:'q1', d:'easy', st:'Additive increase', text:'In AIMD, the "AI" (additive increase) means cwnd is:', options:['Doubled each RTT','Increased by 1 MSS each RTT','Halved each RTT','Kept constant'], correct:1, explain:'Additive increase adds roughly 1 MSS to cwnd per RTT.' },
      { id:'q2', d:'easy', st:'Multiplicative decrease', text:'In AIMD, the "MD" (multiplicative decrease) on loss typically:', options:['Halves cwnd','Adds 1 MSS','Triples cwnd','Sets cwnd to max'], correct:0, explain:'Multiplicative decrease multiplies cwnd by ½ on a loss event.' },
      { id:'q3', d:'medium', st:'TCP congestion window', text:'If cwnd = 16 MSS and a loss occurs, AIMD sets cwnd to about:', options:['32 MSS','17 MSS','8 MSS','1 MSS'], correct:2, explain:'Multiplicative decrease halves 16 → 8 MSS.' },
      { id:'q4', d:'medium', st:'Fairness', text:'The AIMD control law tends to make competing flows:', options:['Diverge','Converge to a fair share','Stop entirely','Use random rates'], correct:1, explain:'AIMD converges flows toward an equal, fair bandwidth share.' },
      { id:'q5', d:'hard', st:'Additive increase', text:'The classic TCP "sawtooth" graph of cwnd over time is produced by:', options:['Slow start only','Additive increase then multiplicative decrease cycles','Flow control','Random loss'], correct:1, explain:'Gentle additive rises and sharp multiplicative drops create the sawtooth.' },
      { id:'q6', d:'hard', st:'Multiplicative decrease', text:'Why is decrease multiplicative rather than additive?', options:['To react quickly and relieve congestion fast','To be slower','To increase throughput on loss','It is arbitrary'], correct:0, explain:'A multiplicative (aggressive) cut relieves congestion quickly, while additive increase probes gently — giving stability.' }
    ],
    t7: [
      { id:'q1', d:'easy', st:'Exponential growth', text:'During slow start, cwnd grows:', options:['Linearly','Exponentially (doubles each RTT)','Not at all','Randomly'], correct:1, explain:'Slow start doubles cwnd every RTT — exponential growth.' },
      { id:'q2', d:'easy', st:'ssthresh', text:'Slow start ends when cwnd reaches:', options:['rwnd','ssthresh','MSS','zero'], correct:1, explain:'At ssthresh TCP switches to congestion avoidance.' },
      { id:'q3', d:'medium', st:'Exponential growth', text:'Starting at cwnd = 1 MSS, after 3 RTTs of slow start cwnd is about:', options:['3 MSS','4 MSS','8 MSS','16 MSS'], correct:2, explain:'1 → 2 → 4 → 8 MSS (doubling each RTT).' },
      { id:'q4', d:'hard', st:'Reset on timeout', text:'After a timeout, ssthresh is typically set to:', options:['cwnd × 2','Half the current cwnd','1 MSS','Unlimited'], correct:1, explain:'ssthresh is set to half of cwnd at the loss, then cwnd → 1 MSS.' }
    ],
    t8: [
      { id:'q1', d:'easy', st:'Additive increase', text:'In congestion avoidance, cwnd grows:', options:['Exponentially','Linearly (≈1 MSS/RTT)','Not at all','Randomly'], correct:1, explain:'Congestion avoidance uses linear (additive) growth.' },
      { id:'q2', d:'easy', st:'Fast retransmit', text:'How many duplicate ACKs trigger fast retransmit?', options:['1','2','3','10'], correct:2, explain:'Three duplicate ACKs trigger fast retransmit.' },
      { id:'q3', d:'medium', st:'Fast recovery', text:'Congestion avoidance implements which control law?', options:['AIMD','Round robin','Token bucket','Leaky bucket'], correct:0, explain:'Congestion avoidance applies AIMD (additive increase, multiplicative decrease).' },
      { id:'q4', d:'hard', st:'Fast retransmit', text:'Fast retransmit improves performance by:', options:['Waiting for a timeout','Retransmitting before a timeout using dup ACKs','Ignoring losses','Doubling cwnd'], correct:1, explain:'It resends the lost segment on 3 dup ACKs without waiting for the timeout.' }
    ]
  },

  // Grounded tutor knowledge base (keyword-matched). Each entry cites the source material.
  tutorKB: [
    {
      keys:['difference','flow','congestion'],
      topic:'t5',
      answer:'Great question — and an important distinction from your material.\n\n**Flow control** protects the *receiver*. It stops a fast sender from overflowing the receiver’s buffer, using the receiver-advertised window (rwnd). It is an **end-to-end, receiver-driven** mechanism.\n\n**Congestion control** protects the *network*. It stops senders from overloading routers in the path, using the sender’s congestion window (cwnd) and reacting to signals like packet loss. It is **network-driven**.\n\nThe sender is limited by **min(cwnd, rwnd)** — so both act together.',
      sources:['Flow Control — p.3', 'Congestion Control — p.5']
    },
    {
      keys:['aimd','additive','multiplicative'],
      topic:'t6',
      answer:'From your notes: **AIMD = Additive Increase, Multiplicative Decrease**, the control law behind TCP congestion avoidance.\n\n• **Additive Increase:** while there is no loss, cwnd increases by ~1 MSS every RTT — gently probing for spare bandwidth.\n• **Multiplicative Decrease:** on a loss event, cwnd is cut (typically halved) — a fast back-off to relieve congestion.\n\nRepeated cycles create the classic TCP **sawtooth**, and this asymmetry (slow up, fast down) is what makes competing flows converge to a **fair** share.',
      sources:['AIMD Algorithm — p.6', 'Congestion Control — p.5']
    },
    {
      keys:['slow','start'],
      topic:'t7',
      answer:'**Slow start** (from your material) ramps a new connection up quickly: cwnd begins around 1 MSS and **doubles every RTT** (exponential growth) until it hits **ssthresh** or a loss occurs. At that point TCP switches to **congestion avoidance** (linear growth via AIMD). After a timeout, cwnd resets to 1 MSS and slow start begins again.',
      sources:['Slow Start — p.7']
    },
    {
      keys:['cwnd','window','congestion window'],
      topic:'t5',
      answer:'The **congestion window (cwnd)** is the sender-side limit on how much unacknowledged data may be in flight, adjusted to match what the *network* can handle. It works alongside the receiver window (rwnd) — the sender may transmit at most **min(cwnd, rwnd)** bytes. cwnd grows during slow start and congestion avoidance, and shrinks on loss.',
      sources:['Congestion Control — p.5']
    },
    {
      keys:['osi','layer'],
      topic:'t1',
      answer:'The **OSI model** in your notes is a 7-layer framework (Physical, Data Link, Network, Transport, Session, Presentation, Application). Each layer serves the one above and uses **encapsulation** — adding its own header as data descends. The Transport layer (4) provides end-to-end delivery; the Network layer (3) routes packets.',
      sources:['OSI Model — p.1']
    },
    {
      keys:['handshake','tcp','connection'],
      topic:'t2',
      answer:'TCP is **connection-oriented**: it opens a connection with the **three-way handshake** — SYN → SYN-ACK → ACK. It then delivers a reliable, ordered byte stream using **sequence and acknowledgement numbers**, riding on top of best-effort IP.',
      sources:['TCP/IP — p.2']
    }
  ]
};
