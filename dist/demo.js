// "Try it out for yourself": a clickable example of the app's screens, with made-up subjects and data.
// Nothing here calls the AI, saves anything or leaves the page. Example marks come from simple keyword checks.
(function () {
  var box = document.querySelector('[data-demo]');
  if (!box) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  // ---- example data -------------------------------------------------------------------------------------------
  // A question: t text, m marks, topic, crit [label, keys, marks, n] (n = how many different keys must appear),
  // a an example answer. Keys are matched against the answer with spaces removed, in lower case.
  var SUBS = {
    maths: {
      name: 'Maths', sprite: 'p-europa', col: '#4A78C2', topics: ['Functions', 'Calculus', 'Probability', 'Statistics'],
      bank: [
        { t: 'Differentiate y = 3x² + 5x − 2.', m: 2, topic: 'Calculus', crit: [['Differentiates 3x² to get 6x', ['6x'], 1], ['Differentiates 5x − 2 to get 5, so dy/dx = 6x + 5', ['6x+5'], 1]], a: 'dy/dx = 6x + 5' },
        { t: 'Find the x-intercepts of y = x² − 5x + 6.', m: 2, topic: 'Functions', crit: [['Factorises to (x − 2)(x − 3)', ['(x-2)(x-3)', '(x-3)(x-2)'], 1], ['States x = 2 and x = 3', ['x=2', 'x=3'], 1, 2]], a: '(x − 2)(x − 3) = 0, so x = 2 or x = 3' },
        { t: 'Two fair dice are rolled. Find the probability that the total is 7.', m: 2, topic: 'Probability', crit: [['Counts 6 ways out of 36', ['6/36', '6outof36'], 1], ['Simplifies to 1/6', ['1/6'], 1]], a: 'There are 6 ways out of 36, so P = 6/36 = 1/6' },
        { t: 'Find the median of 3, 8, 5, 12, 7.', m: 2, topic: 'Statistics', crit: [['Puts the data in order', ['3,5,7,8,12'], 1], ['States that the median is 7', ['medianis7', 'median=7', 'median:7'], 1]], a: 'In order: 3, 5, 7, 8, 12. The median is 7.' },
        { t: 'Find ∫ (4x³ + 2) dx.', m: 2, topic: 'Calculus', crit: [['Integrates 4x³ to get x⁴', ['x^4'], 1], ['Integrates 2 to get 2x, and adds + C', ['2x+c'], 1]], a: 'x⁴ + 2x + C' },
        { t: 'State the gradient and the y-intercept of y = 4 − 3x.', m: 2, topic: 'Functions', crit: [['Gradient is −3', ['-3'], 1], ['y-intercept is 4', ['intercept=4', 'interceptis4', '(0,4)', 'intercept:4'], 1]], a: 'The gradient is −3 and the y-intercept is 4.' }
      ],
      files: [['Formula sheet', 'Handout'], ['Exercise 4C solutions', 'Solutions']]
    },
    english: {
      name: 'English', sprite: 'p-gj', col: '#C04A8C', topics: ['Close reading', 'Poetry', 'Creative writing', 'Essay writing'],
      bank: [
        { t: 'Name the technique in this line and explain its effect: "The city breathed slowly, its lights blinking awake."', m: 3, topic: 'Close reading', crit: [['Names the technique: personification', ['personif'], 1], ['Refers to the words used', ['breath', 'blink', 'awake'], 1], ['Explains the effect on the reader', ['effect', 'suggest', 'reader', 'alive', 'makes', 'creates'], 1]], a: 'The line uses personification: the city "breathed" like a living thing. This suggests the city is alive and calm at night, and makes the reader feel its slow rhythm.' },
        { t: 'Explain how repetition can build a mood in a poem. Give a short example of your own.', m: 2, topic: 'Poetry', crit: [['Explains what repetition does', ['emphas', 'stress', 'build', 'reinforc', 'echo'], 1], ['Gives an example', ['"', 'forexample', 'e.g', 'suchas'], 1]], a: 'Repetition stresses an idea each time it returns, so the mood builds. For example, "alone, alone, all alone" makes the loneliness heavier with every word.' },
        { t: 'Write an opening sentence that uses the weather to show how a character feels.', m: 2, topic: 'Creative writing', crit: [['Uses an image of the weather', ['rain', 'storm', 'sun', 'cloud', 'wind', 'fog', 'snow', 'thunder', 'drizzle'], 1], ['Links it to a feeling', ['felt', 'feel', 'heart', 'anger', 'sad', 'fear', 'hope', 'joy', 'alone', 'lonel', 'calm', 'dread'], 1]], a: 'The rain had not stopped for three days, and neither had the dread sitting heavy in her heart.' },
        { t: 'Write a thesis statement for this question: How does a text you have studied explore belonging?', m: 3, topic: 'Essay writing', crit: [['Answers the question directly', ['belong'], 1], ['Makes an argument, not just a topic', ['because', 'shows', 'reveal', 'suggest', 'argue', 'through'], 1], ['Names how the text does it', ['character', 'imagery', 'structure', 'narrat', 'symbol', 'language', 'setting', 'technique'], 1]], a: 'Through its shifting setting and the main character\'s silences, the text reveals that belonging is earned slowly, not given.' },
        { t: 'What is the difference between tone and mood?', m: 2, topic: 'Close reading', crit: [['Tone is the writer\'s attitude', ['attitude', 'writer', 'author', 'speaker', 'voice'], 1], ['Mood is the feeling or atmosphere for the reader', ['reader', 'atmosphere', 'feel'], 1]], a: 'Tone is the writer\'s attitude to the subject. Mood is the atmosphere the reader feels.' }
      ],
      texts: [['Your novel', 'Prose fiction'], ['Your poetry collection', 'Poetry'], ['Your film', 'Film']]
    },
    history: {
      name: 'History', sprite: 'p-titan', col: '#D9822B', topics: ['Sources', 'Causes and effects', 'Change over time', 'Key people'],
      bank: [
        { t: 'What is the difference between a primary and a secondary source?', m: 2, topic: 'Sources', crit: [['A primary source was made at the time', ['atthetime', 'samatime', 'firsthand', 'first-hand', 'fromthetime', 'during'], 1], ['A secondary source was made later, looking back', ['later', 'after', 'lookingback', 'interpret', 'historian'], 1]], a: 'A primary source was made at the time, by someone who was there. A secondary source was made later, looking back on it.' },
        { t: 'Explain how the purpose of a source can affect how useful it is.', m: 3, topic: 'Sources', crit: [['Says what purpose means: why it was made', ['why', 'purpose', 'madeto', 'aim', 'intend'], 1], ['Links purpose to bias or reliability', ['bias', 'reliab', 'one-sided', 'persuad', 'propaganda', 'exaggerat'], 1], ['Explains that it can still be useful', ['useful', 'still', 'attitude', 'tellsus', 'shows'], 1]], a: 'Purpose is why a source was made. A poster made to persuade may be biased, so it is less reliable about facts, but it is still useful because it shows what its makers wanted people to believe.' },
        { t: 'Explain the difference between a long-term and a short-term cause.', m: 2, topic: 'Causes and effects', crit: [['A long-term cause builds up over years', ['years', 'overtime', 'build', 'decades', 'underlying'], 1], ['A short-term cause sets the event off', ['trigger', 'spark', 'immediate', 'justbefore', 'setoff', 'setsoff'], 1]], a: 'A long-term cause builds up over years, like growing tension. A short-term cause is the trigger that sets the event off.' },
        { t: 'Explain what "continuity" means in history, with an example.', m: 2, topic: 'Change over time', crit: [['Continuity is what stayed the same', ['stayedthesame', 'staysthesame', 'didnotchange', "didn'tchange", 'unchanged', 'continued', 'same'], 1], ['Gives an example', ['forexample', 'e.g', 'suchas', 'like'], 1]], a: 'Continuity is what stayed the same while other things changed. For example, most people still worked on farms even after new factories opened.' },
        { t: 'Why do historians use more than one source about the same person?', m: 2, topic: 'Key people', crit: [['Sources can be biased or limited', ['bias', 'one-sided', 'limited', 'perspective', 'viewpoint', 'opinion', 'different'], 1], ['Comparing them gives a fuller, more reliable picture', ['compar', 'check', 'corroborat', 'fuller', 'reliab', 'balanc', 'accura'], 1]], a: 'Each source has its own perspective and can be biased. Comparing several gives a fuller and more reliable picture of the person.' }
      ],
      files: [['Source booklet', 'Handout'], ['Notes on causes', 'Class notes']]
    },
    science: {
      name: 'Science', sprite: 'p-cnc', col: '#C8462E', topics: ['Cells', 'Chemical reactions', 'Forces', 'Working scientifically'],
      bank: [
        { t: 'In an experiment, what is the difference between the independent and the dependent variable?', m: 2, topic: 'Working scientifically', crit: [['The independent variable is the one you change', ['change', 'vary', 'manipulat'], 1], ['The dependent variable is the one you measure', ['measur', 'observ', 'result'], 1]], a: 'The independent variable is the one you change. The dependent variable is the one you measure.' },
        { t: 'Balance this equation: H₂ + O₂ → H₂O', m: 2, topic: 'Chemical reactions', crit: [['Puts a 2 in front of H₂O', ['2h2o'], 1], ['Puts a 2 in front of H₂', ['2h2+o2'], 1]], a: '2H₂ + O₂ → 2H₂O' },
        { t: 'Name two parts found in plant cells but not in animal cells.', m: 2, topic: 'Cells', crit: [['Names one: cell wall, chloroplast or large vacuole', ['cellwall', 'chloroplast', 'vacuole'], 1], ['Names a second one', ['cellwall', 'chloroplast', 'vacuole'], 1, 2]], a: 'A cell wall and chloroplasts.' },
        { t: 'A 2 kg trolley speeds up at 3 m/s². Find the net force on it.', m: 2, topic: 'Forces', crit: [['Uses F = ma', ['f=ma', '2×3', '2x3', '2*3'], 1], ['Gets 6 N', ['6n'], 1]], a: 'F = ma = 2 × 3 = 6 N' },
        { t: 'What does a mitochondrion do in a cell?', m: 2, topic: 'Cells', crit: [['Releases energy (makes ATP)', ['energy', 'atp'], 1], ['Through respiration', ['respiration'], 1]], a: 'It releases energy for the cell, as ATP, through respiration.' },
        { t: 'Why should an experiment be repeated several times?', m: 2, topic: 'Working scientifically', crit: [['To check the results are reliable', ['reliab', 'consisten', 'repeatab'], 1], ['To spot errors and outliers, or to take an average', ['error', 'outlier', 'average', 'mean', 'random'], 1]], a: 'Repeating checks that the results are reliable, and lets you spot outliers and take an average.' }
      ],
      files: [['Practical write-up', 'Class notes'], ['Data booklet', 'Handout']]
    }
  };
  var ORDER = ['maths', 'english', 'history', 'science'];
  var TABS = [['paper', 'Example paper'], ['today', 'Today'], ['week', 'Timetable'], ['focus', 'Focus'], ['notes', 'Notes'], ['essay', 'Essay lab'], ['texts', 'My texts']];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // Free times by weekday: [name, start, end, at] in minutes after midnight.
  var FREE = [
    [['After school', 960, 1080, 'Home']],
    [['After school', 960, 1050, 'Home']],
    [['Study period', 660, 710, 'School'], ['After school', 990, 1110, 'Home']],
    [['After school', 960, 1080, 'Home']],
    [['After school', 945, 1020, 'Home']],
    [['Morning', 570, 720, 'Home']],
    [['Afternoon', 840, 960, 'Home']]
  ];
  // Essay lab: the question, the words a check looks for, and an example to paste in
  var ESSAY = {
    english: { q: 'How does a text you have studied explore the idea of belonging?', keys: ['belong', 'explor', 'idea'],
      ex: 'Through its shifting settings and the main character\'s silences, the text explores the idea that belonging is earned slowly, not given.\n\nIn the opening chapter, the narrator describes the town as "a door that never quite opens". This image of a closed door shows how distant she feels from the people around her.\n\nBy the final scene the same door is "left on the latch", and this small change shows that she now belongs, because she has chosen to stay.' },
    history: { q: 'Assess the main causes of a conflict you have studied.', keys: ['cause', 'conflict', 'main'],
      ex: 'The conflict had several causes, but the main one was the long build-up of distrust between the two sides.\n\nAs one source puts it, leaders "talked of peace while preparing for war". This shows that the long-term cause was fear, which made every later event more dangerous.\n\nThe short-term trigger was a single border incident, but it only led to war because the deeper causes were already in place.' }
  };
  var essayOf = function () { return ESSAY[S.sub] || ESSAY.english; };
  var KINDS = ['Analytical essay', 'Creative writing', 'Discursive writing', 'Persuasive writing'];

  // ---- state (lives only in this page) --------------------------------------------------------------------------
  var S = {
    sub: 'maths', tab: 'paper', paper: null, gen: false, open: 0, ans: {}, marks: {}, ticks: {},
    focus: { mins: 30, topic: '', endAt: 0, left: 0, paused: false, set: null },
    notes: {}, noteTopic: 0, essay: { kind: 0, text: '', checked: null }, off: {},
    hours: 20, share: { maths: 25, english: 25, history: 25, science: 25 }, added: {}
  };
  var timer = 0;

  // ---- helpers --------------------------------------------------------------------------------------------------
  var sub = function () { return SUBS[S.sub]; };
  var norm = function (s) { return String(s).toLowerCase().replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/₂/g, '2').replace(/[“”]/g, '"').replace(/\s+/g, ''); };
  var clock = function (m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am', h12 = ((h + 11) % 12) + 1; return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap; };
  var hm = function (mins) { mins = Math.round(mins); var h = Math.floor(mins / 60), m = mins % 60; return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min'; };
  var words = function (t) { return (String(t).trim().match(/\S+/g) || []).length; };
  var tag = '<span class="dm-tag">Example</span>';
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
  var dayIndex = function (d) { return (d.getDay() + 6) % 7; };
  var shareSum = function () { return ORDER.reduce(function (n, k) { return n + S.share[k]; }, 0); };
  var subHours = function (k) { var t = shareSum(); return t ? S.hours * 60 * S.share[k] / t : 0; };

  function markAnswer(q, text) {
    var a = norm(text), got = 0;
    var rows = q.crit.map(function (c) {
      var hits = c[1].filter(function (k) { return a.indexOf(norm(k)) > -1; }).length, ok = hits >= (c[3] || 1);
      if (ok) got += c[2];
      return { label: c[0], got: ok ? c[2] : 0, of: c[2] };
    });
    return { rows: rows, got: got };
  }

  // ---- screens --------------------------------------------------------------------------------------------------
  function paperHTML() {
    var s = sub();
    if (S.gen) return '<div class="dm-card dm-gen" aria-live="polite"><b>Making your example paper…</b><ol class="dm-steps"><li>Reading the pages</li><li>Finding each question and its marks</li><li>Sorting the questions into topics</li></ol></div>';
    if (!S.paper) return '<div class="dm-card dm-empty"><h4>Make an example paper for ' + esc(s.name) + '</h4>' +
      '<p>In the app, you upload a real past paper with its solutions or marking guidelines, and Varda reads it into questions sorted by topic. Here, press the button to make an example one.</p>' +
      '<button class="dm-btn pri" data-a="gen">Make an example paper</button></div>';
    var total = S.paper.reduce(function (n, i) { return n + s.bank[i].m; }, 0);
    var html = '<div class="dm-head"><div><h4>Example paper: ' + esc(s.name) + '</h4><p class="dm-mut">' + S.paper.length + ' questions · ' + total + ' marks · made just now</p></div><button class="dm-btn" data-a="gen">Make another</button></div><div class="dm-qs">';
    S.paper.forEach(function (bi, n) {
      var q = s.bank[bi], id = S.sub + bi, mk = S.marks[id], open = S.open === n;
      html += '<div class="dm-q' + (open ? ' open' : '') + '"><button class="dm-qrow" data-a="openq" data-n="' + n + '" aria-expanded="' + open + '">' +
        '<span class="dm-qn">Q' + (n + 1) + '</span><span class="dm-qt">' + esc(q.t) + '</span><span class="dm-qm">' + (mk ? mk.got + ' / ' + q.m : q.m + (q.m === 1 ? ' mark' : ' marks')) + '</span></button>';
      if (open) {
        html += '<div class="dm-qbody"><div class="dm-mut small">' + esc(q.topic) + '</div>' +
          '<label class="dm-lab" for="dm-ans">Your answer</label><textarea id="dm-ans" class="dm-in" rows="3" data-i="ans" data-id="' + id + '" placeholder="Type your answer">' + esc(S.ans[id] || '') + '</textarea>' +
          '<div class="dm-row"><button class="dm-btn pri" data-a="mark" data-n="' + n + '">Mark my answer</button><button class="dm-btn ghost" data-a="fill" data-n="' + n + '">Fill in an example answer</button></div>';
        if (mk) {
          html += '<div class="dm-mark" aria-live="polite">' + mk.rows.map(function (r) {
            return '<div class="dm-crit"><span>' + esc(r.label) + '</span><span class="m">' + r.got + ' / ' + r.of + '</span><div class="dm-meter"><i class="' + (r.got < r.of ? 'part' : '') + '" style="width:' + (r.of ? (r.got / r.of * 100) : 0) + '%"></i></div></div>';
          }).join('') +
            '<div class="dm-total"><span class="big">' + mk.got + '</span><span class="dm-mut">out of ' + q.m + '</span><span class="dm-ai">Example mark</span></div>' +
            (mk.got < q.m ? '<div class="dm-fb"><b>To get the next mark:</b> ' + esc(mk.rows.filter(function (r) { return r.got < r.of; })[0].label.replace(/^./, function (c) { return c.toLowerCase(); })) + '.</div>' : '<div class="dm-fb ok"><b>Full marks.</b> In the app, this question would now count towards ' + esc(q.topic) + ' on your planet.</div>') +
            '<p class="dm-mut small">Example answer: ' + esc(q.a) + '</p></div>';
        }
        html += '</div>';
      }
      html += '</div>';
    });
    return html + '</div><p class="dm-note">This example mark comes from simple keyword checks. In the app, Varda marks your answer against the solutions or marking guidelines you upload, and labels every mark as AI.</p>';
  }

  function todayBlocks() {
    var s = sub(), others = ORDER.filter(function (k) { return k !== S.sub; });
    return [
      ['4:00 pm', 'Homework: exercise from class', s.name + ' · due tomorrow', 30],
      ['4:35 pm', s.name + ': ' + s.topics[1], 'Topic practice · a topic you have not tried yet', 25],
      ['5:05 pm', SUBS[others[0]].name + ': flashcards', 'Cards that are due today', 10],
      ['5:20 pm', SUBS[others[1]].name + ': ' + SUBS[others[1]].topics[0], 'Practice from your own papers', 20],
      ['5:45 pm', 'Mistake logbook: test yourself', '3 of your rules · say each one from memory', 5]
    ];
  }

  function todayHTML() {
    var b = todayBlocks(), done = b.filter(function (x, i) { return S.ticks[S.sub + i]; }).length;
    return '<div class="dm-head"><div><h4>Today</h4><p class="dm-mut">After school · 4:00 pm to 6:00 pm · homework on top</p></div>' + tag + '</div>' +
      '<div class="dm-prog"><div class="dm-meter"><i style="width:' + (done / b.length * 100) + '%"></i></div><span class="dm-mut small" aria-live="polite">' + done + ' of ' + b.length + ' done</span></div>' +
      '<ul class="dm-blocks">' + b.map(function (x, i) {
        var on = !!S.ticks[S.sub + i];
        return '<li class="' + (on ? 'done' : '') + '"><label><input type="checkbox" data-a="tick" data-n="' + i + '"' + (on ? ' checked' : '') + '><span class="dm-time">' + x[0] + '</span><span class="dm-bt"><b>' + esc(x[1]) + '</b><span class="dm-mut small">' + esc(x[2]) + ' · ' + x[3] + ' min</span></span></label></li>';
      }).join('') + '</ul><p class="dm-note">In the app, your plan is built each day from your free times, exam dates, homework and the topics you have lost marks on. Tick a block to mark it done.</p>';
  }

  function donut() {
    var r = 46, c = 2 * Math.PI * r, at = 0, segs = '';
    var tot = shareSum();
    ORDER.forEach(function (k) {
      var f = tot ? S.share[k] / tot : 0; if (!f) return;
      segs += '<circle r="' + r + '" cx="60" cy="60" fill="none" stroke="' + SUBS[k].col + '" stroke-width="16" stroke-dasharray="' + (f * c - 1.5).toFixed(2) + ' ' + c.toFixed(2) + '" stroke-dashoffset="' + (-at * c).toFixed(2) + '" transform="rotate(-90 60 60)"></circle>';
      at += f;
    });
    return '<svg class="dm-donut" viewBox="0 0 120 120" aria-hidden="true"><circle r="46" cx="60" cy="60" fill="none" stroke="#EFEDE7" stroke-width="16"></circle>' + segs +
      '<circle r="31" cx="60" cy="60" fill="#F6CF5A"></circle><text x="60" y="58" text-anchor="middle" class="dm-dn">' + (Math.round(S.hours * 10) / 10) + ' h</text><text x="60" y="72" text-anchor="middle" class="dm-ds">this week</text></svg>';
  }

  function weekHTML() {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var freeMin = 0;
    var rows = DAYS.map(function (d, i) {
      var off = S.off[i];
      if (!off) FREE[i].forEach(function (f) { freeMin += f[2] - f[1]; });
      return '<div class="dm-day' + (off ? ' off' : '') + '"><span class="dm-dname">' + d + '</span><span class="dm-slots">' +
        (off ? '<span class="dm-mut">Day off</span>' : FREE[i].map(function (f) { return '<span class="dm-slot"><b>' + f[0] + '</b> ' + clock(f[1]) + ' to ' + clock(f[2]) + ' <em>' + f[3] + '</em></span>'; }).join('')) +
        '</span><button class="dm-btn sm" data-a="off" data-n="' + i + '" aria-pressed="' + !!off + '">' + (off ? 'Use free times' : 'Day off') + '</button></div>';
    }).join('');
    var ranked = ORDER.slice().sort(function (a, b) { return S.share[b] - S.share[a]; }).filter(function (k) { return S.share[k] > 0; });
    var next = [];
    for (var n = 0; n < 8; n++) {
      var d = new Date(today); d.setDate(today.getDate() + n);
      var wi = dayIndex(d), f = FREE[wi][FREE[wi].length - 1];
      var pick = ranked.length ? [ranked[n % ranked.length], ranked[(n + 1) % ranked.length]].filter(function (k, j, a) { return a.indexOf(k) === j; }).map(function (k) { return SUBS[k].name; }) : [];
      var plan = (wi < 5 ? ['Homework'] : []).concat(pick);
      next.push('<li><span class="dm-date">' + (n === 0 ? 'Today' : d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })) + '</span><span>' +
        (S.off[wi] ? '<span class="dm-mut">Day off</span>' : esc(f[0] + ' ' + clock(f[1]) + ': ' + (plan.length ? plan.join(', ') : 'nothing planned'))) + '</span></li>');
    }
    var split = ORDER.map(function (k) {
      return '<div class="dm-split"><span class="dm-dot" style="background:' + SUBS[k].col + '"></span><label for="dm-sh-' + k + '">' + SUBS[k].name + '</label>' +
        '<input type="range" id="dm-sh-' + k + '" min="0" max="100" step="5" value="' + S.share[k] + '" data-i="share" data-k="' + k + '"><span class="dm-val" data-v="' + k + '">' + hm(subHours(k)) + '</span></div>';
    }).join('');
    return '<div class="dm-grid2">' +
      '<div class="dm-card"><div class="dm-head"><h4>Free times by weekday</h4>' + tag + '</div><div class="dm-days">' + rows + '</div><p class="dm-mut small" aria-live="polite">Free time this week: <b>' + hm(freeMin) + '</b></p></div>' +
      '<div class="dm-card"><div class="dm-head"><h4>Today and the next 7 days</h4>' + tag + '</div><ul class="dm-next">' + next.join('') + '</ul></div>' +
      '</div><div class="dm-card dm-sun"><div class="dm-head"><h4>The Sun: your week</h4>' + tag + '</div><div class="dm-sunrow"><div data-donut>' + donut() + '</div><div class="dm-sunctl">' +
      '<label class="dm-lab" for="dm-hours">Hours this week: <b data-v="hours">' + S.hours + '</b></label><input type="range" id="dm-hours" min="0" max="40" step="0.5" value="' + S.hours + '" data-i="hours">' +
      '<div class="dm-row"><button class="dm-btn sm" data-a="even">Even split</button></div><div class="dm-splits">' + split + '</div></div></div>' +
      '<p class="dm-note">Slide to give a subject more or less of your week. In the app, each day\'s plan fits into your free times and keeps to this split.</p></div>';
  }

  function focusHTML() {
    var s = sub(), F = S.focus;
    if (F.set) {
      var left = F.paused ? F.left : Math.max(0, Math.round((F.endAt - Date.now()) / 1000));
      return '<div class="dm-card dm-focus"><div class="dm-head"><div><h4>Focus session: ' + esc(s.name) + '</h4><p class="dm-mut">' + F.mins + ' minutes' + (F.topic ? ' · ' + esc(F.topic) : '') + '</p></div>' + tag + '</div>' +
        '<div class="dm-timer" role="timer" aria-live="off"><span data-v="timer">' + fmtSec(left) + '</span></div>' +
        '<div class="dm-row center"><button class="dm-btn" data-a="pause">' + (F.paused ? 'Resume' : 'Pause') + '</button><button class="dm-btn ghost" data-a="stop">End session</button></div>' +
        '<h5>Your set for this session</h5><ol class="dm-set">' + F.set.map(function (q) { return '<li><span>' + esc(q.t) + '</span><span class="dm-mut small">' + esc(q.topic) + ' · ' + q.min + ' min</span></li>'; }).join('') + '</ol>' +
        '<p class="dm-note">In the app, the questions come from your own uploaded papers and fill exactly the time you picked. Each one is marked as you go.</p></div>';
    }
    return '<div class="dm-card"><div class="dm-head"><div><h4>Focus session</h4><p class="dm-mut">Pick how long you have and what to work on. You get a set of questions that fills exactly that time.</p></div>' + tag + '</div>' +
      '<div class="dm-lab">How long</div><div class="dm-chips" role="radiogroup" aria-label="How long">' + [20, 30, 45, 60].map(function (m) { return '<button class="dm-chip" role="radio" aria-checked="' + (F.mins === m) + '" data-a="mins" data-n="' + m + '">' + (m === 60 ? '1 hour' : m + ' min') + '</button>'; }).join('') + '</div>' +
      '<div class="dm-lab">Topic</div><div class="dm-chips" role="radiogroup" aria-label="Topic">' + [''].concat(s.topics).map(function (t) { return '<button class="dm-chip" role="radio" aria-checked="' + (F.topic === t) + '" data-a="ftopic" data-t="' + esc(t) + '">' + (t ? esc(t) : 'Any topic') + '</button>'; }).join('') + '</div>' +
      '<button class="dm-btn pri" data-a="start">Start ' + (F.mins === 60 ? '1 hour' : F.mins + ' min') + '</button></div>';
  }
  function fmtSec(t) { var m = Math.floor(t / 60), s = t % 60; return m + ':' + (s < 10 ? '0' : '') + s; }

  function notesHTML() {
    var s = sub(), n = S.notes[S.sub] || (S.notes[S.sub] = {}), cur = s.topics[S.noteTopic] || s.topics[0];
    var have = s.topics.filter(function (t) { return (n[t] || '').trim(); }).length;
    return '<div class="dm-notes"><div class="dm-card dm-nlist"><div class="dm-lab">' + esc(s.name) + ' topics</div><ul>' + s.topics.map(function (t, i) {
      var w = words(n[t] || '');
      return '<li><button data-a="ntopic" data-n="' + i + '" aria-current="' + (i === S.noteTopic) + '"><span>' + esc(t) + '</span><span class="dm-cnt">' + (w ? w + ' w' : '') + '</span></button></li>';
    }).join('') + '</ul><p class="dm-mut small" data-v="cover">' + have + ' of ' + s.topics.length + ' topics have notes</p></div>' +
      '<div class="dm-card"><div class="dm-head"><h4>' + esc(cur) + '</h4>' + tag + '</div><label class="dm-lab" for="dm-note">Your note</label>' +
      '<textarea id="dm-note" class="dm-in" rows="8" data-i="note" placeholder="Type a note for ' + esc(cur) + '. In the app you can add maths, headings and photos of your working.">' + esc(n[cur] || '') + '</textarea>' +
      '<p class="dm-mut small"><span data-v="nwords">' + words(n[cur] || '') + '</span> words · kept on this page only</p>' +
      '<p class="dm-note">In the app, notes save as you type, and Quiz me asks you questions on a note to answer from memory.</p></div></div>';
  }

  function essayHTML() {
    var E = S.essay, q = essayOf().q, own = !!ESSAY[S.sub];
    var c = E.checked;
    return '<div class="dm-card"><div class="dm-head"><div><h4>' + (S.sub === 'history' ? 'Extended response lab' : 'Essay lab') + '</h4><p class="dm-mut">Timed writing, marked against criteria.</p></div>' + tag + '</div>' +
      (own ? '' : '<p class="dm-note top">In the app, the Essay lab is part of English-type subjects, and humanities subjects call it the Extended response lab. This is how it looks for English.</p>') +
      '<div class="dm-lab">Kind of writing</div><div class="dm-chips" role="radiogroup" aria-label="Kind of writing">' + KINDS.map(function (k, i) { return '<button class="dm-chip" role="radio" aria-checked="' + (E.kind === i) + '" data-a="kind" data-n="' + i + '">' + k + '</button>'; }).join('') + '</div>' +
      '<div class="dm-lab">Question</div><p class="dm-qbox">' + esc(q) + '</p>' +
      '<label class="dm-lab" for="dm-essay">Paste or type your essay</label><textarea id="dm-essay" class="dm-in" rows="8" data-i="essay" placeholder="Paste a paragraph or a whole essay here">' + esc(E.text) + '</textarea>' +
      '<p class="dm-mut small"><span data-v="ewords">' + words(E.text) + '</span> words · aim for about 800 in 40 minutes</p>' +
      '<div class="dm-row"><button class="dm-btn pri" data-a="echeck">Check it</button><button class="dm-btn ghost" data-a="efill">Use an example</button></div>' +
      (c ? '<div class="dm-mark" aria-live="polite">' + c.map(function (r) { return '<div class="dm-crit"><span>' + esc(r[0]) + '</span><span class="m">' + esc(r[1]) + '</span><div class="dm-meter"><i class="' + (r[2] < 1 ? 'part' : '') + '" style="width:' + Math.round(r[2] * 100) + '%"></i></div></div>'; }).join('') +
        '<div class="dm-total"><span class="dm-ai">Example check</span></div></div>' : '') +
      '<p class="dm-note">This example only counts words and looks for the question\'s key words and quotes. In the app, Varda marks your essay against your own criteria, or general criteria made by the app that are clearly labelled as not official.</p></div>';
  }

  function essayCheck(text, keys) {
    var w = words(text), paras = String(text).split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length;
    var lower = String(text).toLowerCase(), found = keys.filter(function (k) { return lower.indexOf(k) > -1; }).length;
    var quotes = (String(text).match(/["“][^"”]{3,}["”]/g) || []).length;
    return [
      ['Length', w + ' of about 800 words', Math.min(1, w / 800)],
      ['Paragraphs', paras + (paras === 1 ? ' paragraph' : ' paragraphs'), Math.min(1, paras / 4)],
      ['Uses the question\'s key words', found + ' of ' + keys.length, keys.length ? found / keys.length : 0],
      ['Quotes as evidence', quotes + (quotes === 1 ? ' quote' : ' quotes'), Math.min(1, quotes / 3)]
    ];
  }

  function textsHTML() {
    var s = sub(), eng = S.sub === 'english', list = (eng ? s.texts : s.files).concat(S.added[S.sub] || []);
    return '<div class="dm-card"><div class="dm-head"><div><h4>' + (eng ? 'My texts' : 'Files') + '</h4><p class="dm-mut">' + (eng ? 'The texts you study, with your own copies of them and anything your teacher handed out.' : 'Your notes and handouts for ' + esc(s.name) + '.') + '</p></div>' + tag + '</div>' +
      (eng ? '' : '<p class="dm-note top">In the app, ' + esc(s.name) + ' calls this page Files. English-type subjects call it My texts, and add a text tutor, quote finder and question maker that read your texts.</p>') +
      '<ul class="dm-texts">' + list.map(function (t) { return '<li><b>' + esc(t[0]) + '</b><span class="dm-mut small">' + esc(t[1]) + '</span>' + (eng ? '<button class="dm-btn sm" data-a="tutor" data-t="' + esc(t[0]) + '">Text tutor</button>' : '') + '</li>'; }).join('') + '</ul>' +
      '<p class="dm-mut small" data-v="tutor" aria-live="polite"></p>' +
      '<form class="dm-add" data-f="addtext"><label class="dm-lab" for="dm-tt">Add a ' + (eng ? 'text' : 'file') + '</label><div class="dm-row"><input id="dm-tt" class="dm-in" maxlength="60" placeholder="' + (eng ? 'e.g. Your play' : 'e.g. Revision sheet') + '" required>' +
      '<select class="dm-in" aria-label="Kind">' + (eng ? ['Drama', 'Prose fiction', 'Poetry', 'Nonfiction', 'Film'] : ['Handout', 'Class notes', 'Solutions']).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select><button class="dm-btn">Add</button></div></form></div>';
  }

  var VIEWS = { paper: paperHTML, today: todayHTML, week: weekHTML, focus: focusHTML, notes: notesHTML, essay: essayHTML, texts: textsHTML };

  // ---- frame --------------------------------------------------------------------------------------------------
  // Remember which control had focus, so a redraw puts it back there
  var ATTRS = ['a', 'n', 't', 'i', 'k'];
  function keyOf(el) {
    if (!el || el === box || !box.contains(el)) return null;
    var k = { id: el.id }; ATTRS.forEach(function (x) { k[x] = el.getAttribute('data-' + x); }); return k;
  }
  function refocus(k) {
    if (!k) return;
    var el = k.id ? document.getElementById(k.id) : null;
    if (!el) { var sel = ''; ATTRS.forEach(function (x) { if (k[x] != null) sel += '[data-' + x + '="' + String(k[x]).replace(/["\\]/g, '\\$&') + '"]'; }); el = sel ? box.querySelector(sel) : null; }
    if (el) el.focus({ preventScroll: true });
  }

  function render(keepFocus) {
    var was = keepFocus ? keyOf(document.activeElement) : null;
    box.innerHTML =
      '<div class="dm-bar"><div class="dm-subs" role="radiogroup" aria-label="Pick an example subject">' + ORDER.map(function (k) {
        var s = SUBS[k]; return '<button class="dm-sub" role="radio" aria-checked="' + (S.sub === k) + '" data-a="sub" data-t="' + k + '"><span class="sprite xs ' + s.sprite + '" style="--s:.38"></span>' + s.name + '</button>';
      }).join('') + '</div><span class="dm-flag">Example app</span></div>' +
      '<div class="dm-tabs" role="tablist" aria-label="Example screens">' + TABS.map(function (t) {
        var on = S.tab === t[0]; return '<button role="tab" id="dm-tab-' + t[0] + '" aria-controls="dm-panel" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-a="tab" data-t="' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="dm-panel" id="dm-panel" role="tabpanel" aria-labelledby="dm-tab-' + S.tab + '">' + VIEWS[S.tab]() + '</div>';
    refocus(was);
  }

  function tick() {
    var F = S.focus, el = box.querySelector('[data-v="timer"]');
    if (!F.set || F.paused) return;
    var left = Math.max(0, Math.round((F.endAt - Date.now()) / 1000));
    if (el) el.textContent = fmtSec(left);
    if (!left) { clearInterval(timer); timer = 0; if (el) el.textContent = 'Time is up'; }
  }

  function focusSet() {
    var s = sub(), pool = s.bank.filter(function (q) { return !S.focus.topic || q.topic === S.focus.topic; });
    if (!pool.length) pool = s.bank;
    var out = [], left = S.focus.mins, i = 0;
    while (left > 0 && i < 12) { var q = pool[i % pool.length], m = Math.min(left, Math.max(4, q.m * 4 + (i % 3) * 2)); out.push({ t: q.t, topic: q.topic, min: m }); left -= m; i++; }
    return out;
  }

  var ACTS = {
    sub: function (el) { S.sub = el.getAttribute('data-t'); S.paper = null; S.open = 0; S.essay.checked = null; S.noteTopic = 0; stopFocus(); render(true); },
    tab: function (el) { S.tab = el.getAttribute('data-t'); render(true); },
    gen: function () {
      S.gen = true; S.paper = null; render(); var s = sub();
      setTimeout(function () { S.gen = false; S.paper = shuffle(s.bank.map(function (q, i) { return i; })).slice(0, 4); S.open = 0; render(); var a = box.querySelector('#dm-ans'); if (a) a.focus({ preventScroll: true }); }, reduce ? 50 : 1100);
    },
    openq: function (el) { var n = +el.getAttribute('data-n'); S.open = S.open === n ? -1 : n; render(true); },
    fill: function (el) { var q = sub().bank[S.paper[+el.getAttribute('data-n')]], id = S.sub + S.paper[+el.getAttribute('data-n')]; S.ans[id] = q.a; render(true); },
    mark: function (el) {
      var bi = S.paper[+el.getAttribute('data-n')], q = sub().bank[bi], id = S.sub + bi;
      if (!(S.ans[id] || '').trim()) { var a = box.querySelector('#dm-ans'); if (a) { a.focus(); a.setAttribute('aria-invalid', 'true'); a.placeholder = 'Type an answer first, or fill in the example'; } return; }
      S.marks[id] = markAnswer(q, S.ans[id]); render(true);
    },
    tick: function (el) { var k = S.sub + el.getAttribute('data-n'); S.ticks[k] = !S.ticks[k]; render(true); },
    off: function (el) { var n = +el.getAttribute('data-n'); S.off[n] = !S.off[n]; render(true); },
    even: function () { ORDER.forEach(function (k) { S.share[k] = 25; }); render(true); },
    mins: function (el) { S.focus.mins = +el.getAttribute('data-n'); render(true); },
    ftopic: function (el) { S.focus.topic = el.getAttribute('data-t'); render(true); },
    start: function () { var F = S.focus; F.set = focusSet(); F.endAt = Date.now() + F.mins * 60000; F.paused = false; clearInterval(timer); timer = setInterval(tick, 1000); render(); var b = box.querySelector('[data-a="pause"]'); if (b) b.focus({ preventScroll: true }); },
    pause: function () {
      var F = S.focus;
      if (F.paused) { F.endAt = Date.now() + F.left * 1000; F.paused = false; clearInterval(timer); timer = setInterval(tick, 1000); }
      else { F.left = Math.max(0, Math.round((F.endAt - Date.now()) / 1000)); F.paused = true; }
      render(true);
    },
    stop: function () { stopFocus(); render(); },
    ntopic: function (el) { S.noteTopic = +el.getAttribute('data-n'); render(true); },
    kind: function (el) { S.essay.kind = +el.getAttribute('data-n'); render(true); },
    efill: function () { S.essay.text = essayOf().ex; S.essay.checked = null; render(); },
    echeck: function () { S.essay.checked = essayCheck(S.essay.text, essayOf().keys); render(true); },
    tutor: function (el) { var o = box.querySelector('[data-v="tutor"]'); if (o) o.textContent = 'In the app, the text tutor answers your questions about ' + el.getAttribute('data-t').replace(/^Your /, 'your ') + ', using your own copy of it. It is off in this example.'; }
  };
  function stopFocus() { clearInterval(timer); timer = 0; S.focus.set = null; S.focus.paused = false; }

  box.addEventListener('click', function (e) {
    var el = e.target.closest('[data-a]');
    if (!el || !box.contains(el) || el.tagName === 'INPUT') return;
    var f = ACTS[el.getAttribute('data-a')]; if (f) { e.preventDefault(); f(el); }
  });
  box.addEventListener('change', function (e) {
    var el = e.target; if (el.getAttribute('data-a') === 'tick') ACTS.tick(el);
    if (el.getAttribute('data-i') === 'hours' || el.getAttribute('data-i') === 'share') render(true);
  });
  box.addEventListener('input', function (e) {
    var el = e.target, i = el.getAttribute('data-i'), v = function (k) { return box.querySelector('[data-v="' + k + '"]'); };
    if (i === 'ans') { S.ans[el.getAttribute('data-id')] = el.value; el.removeAttribute('aria-invalid'); }
    else if (i === 'note') {
      var s = sub(), n = S.notes[S.sub], cur = s.topics[S.noteTopic]; n[cur] = el.value;
      v('nwords').textContent = words(el.value);
      v('cover').textContent = s.topics.filter(function (t) { return (n[t] || '').trim(); }).length + ' of ' + s.topics.length + ' topics have notes';
      var c = box.querySelectorAll('.dm-cnt')[S.noteTopic]; if (c) c.textContent = words(el.value) ? words(el.value) + ' w' : '';
    } else if (i === 'essay') { S.essay.text = el.value; v('ewords').textContent = words(el.value); }
    else if (i === 'hours' || i === 'share') {
      if (i === 'hours') { S.hours = +el.value; v('hours').textContent = S.hours; } else S.share[el.getAttribute('data-k')] = +el.value;
      ORDER.forEach(function (k) { var o = v(k); if (o) o.textContent = hm(subHours(k)); });
      var d = box.querySelector('[data-donut]'); if (d) d.innerHTML = donut();
    }
  });
  box.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, t = f.querySelector('input').value.trim(), k = f.querySelector('select').value;
    if (!t) return;
    (S.added[S.sub] = S.added[S.sub] || []).push([t, k + ' · added just now']);
    render(); var inp = box.querySelector('#dm-tt'); if (inp) inp.focus({ preventScroll: true });
  });
  // Tabs: arrow keys move between them, like real tabs
  box.addEventListener('keydown', function (e) {
    var el = e.target; if (el.getAttribute('role') !== 'tab' || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End')) return;
    e.preventDefault();
    var i = TABS.map(function (t) { return t[0]; }).indexOf(S.tab), n = e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    S.tab = TABS[n][0]; render(); box.querySelector('#dm-tab-' + S.tab).focus();
  });

  render();
})();
