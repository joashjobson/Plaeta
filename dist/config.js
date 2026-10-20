/* =====================================================================
   PLAETA WEBSITE SETTINGS
   This is the only file you need to edit to change prices, plan limits,
   the app link or your contact details. Change the text between the
   quote marks, keep the commas, then upload the site again.
   ===================================================================== */
window.PLAETA = {
  // Where the "Open Plaeta" buttons go (the app lives at /app on this same site)
  appUrl: '/app/',

  // Your details (shown in the footer and the legal pages)
  businessName: 'Plaeta',
  contactEmail: 'hello@example.com',

  // How long uploaded past papers are kept before they are deleted
  paperDays: 60,

  // Price plans. Monthly only. "papers" is the number of past papers a
  // student can upload each month. "worlds" is how many worlds the little
  // solar system on the plan's card shows (1 to 7). Set "recommended: true"
  // on one plan to highlight it. Keep these the same as config/plans.json.
  currency: 'A$',
  plans: [
    { id: 'basic',    name: 'Moon',   price: 12, papers: 10, worlds: 1, blurb: 'For one or two subjects you want to lift.' },
    { id: 'standard', name: 'Planet', price: 22, papers: 20, worlds: 3, blurb: 'Steady practice across your whole course.', recommended: true },
    { id: 'full',     name: 'Nebula', price: 33, papers: 30, worlds: 5, blurb: 'For trial exams and the final stretch.' }
  ],

  // What every plan includes (shown under each price)
  included: [
    'Varda is included, with fair-use limits on essay marking',
    'Every question in your papers can be marked',
    'All your subjects, each with its own planet',
    'Syllabus upload and topic tick-off',
    'Timetable, notes, flashcards, logbook, tutor and Focus sessions',
    'Cancel any time in one step'
  ]
};
