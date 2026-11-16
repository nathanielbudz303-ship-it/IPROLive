(function(){
  'use strict';
  var DB_KEY='ehdemo_db_v1', VERSION=2, DAY=864e5;
  var CLOCK=[2026,10,16,9,12];

  var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function today(){return new Date(CLOCK[0],CLOCK[1],CLOCK[2]);}
  function now(){return new Date(CLOCK[0],CLOCK[1],CLOCK[2],CLOCK[3],CLOCK[4]);}
  function pad(n){return String(n).padStart(2,'0');}
  function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function parse(s){var m=/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(s||'');return m?new Date(+m[1],m[2]-1,+m[3],+(m[4]||0),+(m[5]||0)):null;}
  function dayOf(s){var d=parse(s);return d?new Date(d.getFullYear(),d.getMonth(),d.getDate()):null;}
  function daysFrom(s){var d=dayOf(s);return d?Math.round((d-today())/DAY):null;}
  function addDays(d,n){var x=new Date(d.getTime());x.setDate(x.getDate()+n);return x;}
  function clone(o){return o==null?o:JSON.parse(JSON.stringify(o));}
  function fmtDay(s){var d=parse(s);return d?WD[d.getDay()]+', '+MS[d.getMonth()]+' '+d.getDate():'';}
  function fmtTime(s){var d=parse(s);if(!d)return '';var h=d.getHours();return ((h%12)||12)+':'+pad(d.getMinutes())+' '+(h<12?'AM':'PM');}
  function fmtWhen(s){return fmtDay(s)+' · '+fmtTime(s);}
  function ago(s){
    var d=parse(s);if(!d)return '';
    var mins=Math.round((now()-d)/6e4);
    if(mins<1)return 'Just now';
    if(mins<60)return mins+' min ago';
    if(mins<60*24&&d.getDate()===now().getDate())return Math.round(mins/60)+' hr ago';
    if(daysFrom(ymd(d))===-1)return 'Yesterday';
    return fmtDay(s);
  }

  var STUDENT={
    cwid:'A20DEMO42',firstName:'John',lastName:'Smith',preferredName:'John',
    classStanding:'Junior',classYear:'3rd',creditHours:68,
    degree:'B.S. Computer Science',major:'Computer Science',majorGroup:'computing',minor:'Data Science',
    college:'College of Computing',expectedGraduation:'May 2028',classOf:2028,
    citizenshipCategory:'us',enrollment:'Full-time, Fall 2026'
  };
  var COACH={name:'Dana Brooks',initials:'DB',role:'Elevate Success Coach',team:'College of Computing students'};
  var COACH_SLOTS=['2026-11-17T10:00','2026-11-17T15:30','2026-11-18T13:00','2026-11-20T09:30','2026-11-23T11:00'];

  var PROGRAMS=[
    {id:"iit-urp",title:"Undergraduate Research Program (Spring cohort)",org:"Illinois Tech Office of Undergraduate Research",source:"IIT",type:"Research",
     years:["1st","2nd","3rd","4th"],majors:["any"],citizenship:["us","pr","intl"],interests:["research","data","health","sustainability"],
     deadline:"2026-11-20",location:"Chicago (Mies Campus)",paid:true,
     summary:"Pairs undergraduates in any year (first-years welcome) with a faculty mentor for a semester-long project, with a small stipend and a poster session at the end of term.",
     steps:["Browse the faculty project list and shortlist 3 labs","Email one faculty mentor with a 5-sentence intro","Write a 300-word statement of interest","Request one faculty reference","Submit the online application by Nov 20"],
     status:"closing",lastChecked:4,url:"#"},
    {id:"ext-swe-intern",title:"Software Engineering Intern (Summer 2027)",org:"Chicago trading technology firm",source:"External",type:"Internship",
     years:["3rd","4th"],majors:["computing","engineering"],citizenship:["us","pr","intl"],interests:["software","data","finance"],
     deadline:"2026-12-01",location:"Chicago (Loop)",paid:true,
     summary:"A 10-week paid internship on a trading-systems team for rising seniors, with a real production project, weekly code reviews and a mentor.",
     steps:["Put your strongest software project at the top of your resume","Get a resume review at Career Services","Practice 2 medium coding problems a week","Write a 3-sentence answer on why this team","Apply on Handshake by Dec 1"],
     status:"new",lastChecked:7,url:"#"},
    {id:"ext-data-intern",title:"Data Science Intern (Summer 2027)",org:"Chicago health-tech company",source:"External",type:"Internship",
     years:["3rd","4th"],majors:["computing","science"],citizenship:["us","pr","intl"],interests:["data","health","software"],
     deadline:"2026-12-15",location:"Chicago (Fulton Market, hybrid)",paid:true,
     summary:"A summer internship building models and dashboards on de-identified patient-scheduling data, ending with a presentation to the product team.",
     steps:["Pick one data project you can explain in 2 minutes","Put Python and SQL near the top of your resume","Get a resume review at Career Services","Apply on the company careers page by Dec 15"],
     status:"new",lastChecked:3,url:"#"},
    {id:"ext-cyber-intern",title:"Cybersecurity Summer Intern",org:"Midwest energy utility",source:"External",type:"Internship",
     years:["2nd","3rd","4th"],majors:["computing","engineering"],citizenship:["us"],interests:["software","hardware","policy"],
     deadline:"2027-01-12",location:"Chicago suburbs (on site)",paid:true,
     summary:"A paid summer role on a security operations team that protects grid systems, with incident-response training and a final threat-hunting project. US citizens only.",
     steps:["Take a free intro networking or security course if you have not had one","Put any security or systems project on your resume","Request one faculty reference","Apply by Jan 12"],
     status:"updated",lastChecked:26,url:"#"},
    {id:"iit-kaplan-ideate",title:"Kaplan Institute Ideation Sprint",org:"Illinois Tech Kaplan Institute",source:"IIT",type:"Discovery program",
     years:["1st","2nd","3rd","4th"],majors:["any"],citizenship:["us","pr","intl"],interests:["design","business","sustainability"],
     deadline:"2027-01-22",location:"Chicago (Kaplan Institute)",paid:false,
     summary:"A six-week, team-based design-thinking sprint where students prototype solutions for a real Chicago partner organization and pitch them on demo day.",
     steps:["Attend the info session in the Kaplan atrium","Form or join a team of 3 to 5 on the sprint board","Draft a one-paragraph problem statement","Register your team by Jan 22"],
     status:"new",lastChecked:12,url:"#"},
    {id:"iit-extern",title:"Winter Break Externship Program",org:"Illinois Tech Career Services",source:"IIT",type:"Externship",
     years:["1st","2nd","3rd"],majors:["any"],citizenship:["us","pr","intl"],interests:["business","software","finance","policy","design"],
     deadline:"2026-11-14",location:"Chicago area (hybrid)",paid:false,
     summary:"One- to five-day job shadows with IIT alumni hosts over winter break. A low-pressure way to see a workplace before your next internship.",
     steps:["Update your resume with Career Services","Complete the Handshake profile to 100%","Pick 3 host companies in the externship catalog","Submit preferences by Nov 14"],
     status:"closing",lastChecked:2,url:"#"},
    {id:"iit-armour-summer",title:"Armour Summer Research Fellowship",org:"Illinois Tech Armour College of Engineering",source:"IIT",type:"Research",
     years:["2nd","3rd"],majors:["engineering","computing","science"],citizenship:["us","pr","intl"],interests:["research","hardware","sustainability","data"],
     deadline:"2027-02-15",location:"Chicago (on campus)",paid:true,
     summary:"Ten-week, full-time paid summer research in an engineering or science lab, with weekly professional-development workshops and a final symposium.",
     steps:["Identify 2 labs that match your interests","Meet the PI during office hours before winter break","Request one faculty reference","Upload transcript and 1-page research proposal","Submit by Feb 15"],
     status:"updated",lastChecked:35,url:"#"},
    {id:"ext-google-step",title:"STEP Internship",org:"Google",source:"External",type:"Internship",
     years:["1st","2nd"],majors:["computing","engineering"],citizenship:["us","pr","intl"],interests:["software","data"],
     deadline:"2026-11-25",location:"Various US offices",paid:true,
     summary:"A summer internship for first- and second-year students with a passion for computer science, combining a software project with mentorship and skills training.",
     steps:["Polish resume with one coding project at the top","Get a resume review at Career Services","Practice 2 easy coding problems per day","Apply on the careers site before the posted deadline"],
     status:"updated",lastChecked:8,url:"#"},
    {id:"ext-ms-explore",title:"Explore Program",org:"Microsoft",source:"External",type:"Internship",
     years:["1st","2nd"],majors:["computing","engineering"],citizenship:["us","pr","intl"],interests:["software","design","data"],
     deadline:"2026-12-05",location:"Redmond, WA",paid:true,
     summary:"A 12-week summer program that rotates students through software engineering and product management roles on a real product team.",
     steps:["Write a short story-based answer on why you want to explore SWE and PM","Update resume with Career Services","Ask a friend for a mock behavioral interview","Submit the application by early December"],
     status:"new",lastChecked:21,url:"#"},
    {id:"ext-nsf-reu",title:"Summer REU: Data for Urban Systems",org:"NSF-funded REU site (partner university)",source:"External",type:"Research",
     years:["2nd","3rd"],majors:["computing","science","engineering"],citizenship:["us","pr"],interests:["research","data","sustainability","policy"],
     deadline:"2027-02-01",location:"Midwest partner campus (housing provided)",paid:true,
     summary:"A National Science Foundation Research Experience for Undergraduates site where students spend 10 weeks on city-data research with a stipend, housing and travel support.",
     steps:["Read the site's project descriptions and pick top 2","Request one faculty reference","Draft a 1-page personal statement","Order an unofficial transcript","Submit through the REU portal by Feb 1"],
     status:"new",lastChecked:47,url:"#"},
    {id:"ext-gs-insight",title:"Undergraduate Discovery Days",org:"Goldman Sachs",source:"External",type:"Discovery program",
     years:["1st","2nd"],majors:["any"],citizenship:["us","pr","intl"],interests:["finance","business","data"],
     deadline:"2027-01-10",location:"Chicago / virtual",paid:false,
     summary:"A short insight program introducing first- and second-year students to divisions across the firm, with networking sessions and a pathway to future internships.",
     steps:["Watch one recorded division overview","Tailor resume to highlight teamwork and numbers","Prepare a 60-second introduction","Apply online by Jan 10"],
     status:"updated",lastChecked:15,url:"#"},
    {id:"ext-jpm-launch",title:"Launching Leaders Early Insight",org:"JPMorgan Chase",source:"External",type:"Discovery program",
     years:["1st","2nd"],majors:["any"],citizenship:["us","pr"],interests:["finance","business","software"],
     deadline:"2026-12-12",location:"Chicago / New York",paid:true,
     summary:"An early-insight experience for underrepresented first- and second-year students, with mentorship, skill workshops and a scholarship component.",
     steps:["Attend a virtual info session","Draft the short essay on leadership","Get resume reviewed by Career Services","Submit application by mid-December"],
     status:"new",lastChecked:63,url:"#"},
    {id:"ext-anl-suli",title:"Science Undergraduate Laboratory Internship (SULI)",org:"Argonne National Laboratory",source:"External",type:"Internship",
     years:["1st","2nd","3rd","4th"],majors:["engineering","computing","science"],citizenship:["us","pr"],interests:["research","sustainability","hardware","data"],
     deadline:"2027-01-08",location:"Lemont, IL",paid:true,
     summary:"A Department of Energy summer internship placing students on research teams at a national lab, with a stipend and a final research presentation. US citizens and permanent residents only.",
     steps:["Create a DOE application portal account","Request two references (one faculty)","Write the research-interest essay","Pick up to 3 lab preferences, Argonne first","Submit by early January"],
     status:"updated",lastChecked:28,url:"#"},
    {id:"ext-fnal-intern",title:"Summer Undergraduate Internship",org:"Fermilab",source:"External",type:"Internship",
     years:["2nd","3rd","4th"],majors:["engineering","computing","science"],citizenship:["us"],interests:["research","hardware","software"],
     deadline:"2027-01-29",location:"Batavia, IL",paid:true,
     summary:"Hands-on summer work in particle physics, accelerator engineering or computing at Fermilab, with housing assistance for out-of-area students. US citizens only.",
     steps:["Choose a track: physics, engineering or computing","Request one faculty reference","Upload transcript","Submit application by late January"],
     status:"new",lastChecked:72,url:"#"},
    {id:"ext-chi-policy",title:"Civic Futures Fellowship",org:"Chicago civic policy nonprofit",source:"External",type:"Fellowship",
     years:["1st","2nd","3rd","4th"],majors:["any"],citizenship:["us","pr","intl"],interests:["policy","data","sustainability"],
     deadline:"2027-03-01",location:"Chicago (Loop)",paid:true,
     summary:"A part-time spring fellowship supporting city policy research: data collection, community interviews and a short public brief.",
     steps:["Read two recent policy briefs from the organization","Write a 250-word response to the prompt","Get your writing sample reviewed at the Communications Lab","Submit by Mar 1"],
     status:"new",lastChecked:5,url:"#"},
    {id:"ext-design-studio",title:"Summer Design Studio",org:"Chicago architecture & design firm",source:"External",type:"Internship",
     years:["1st","2nd","3rd"],majors:["design","engineering"],citizenship:["us","pr","intl"],interests:["design","sustainability"],
     deadline:"2027-02-20",location:"Chicago (West Loop)",paid:true,
     summary:"An eight-week studio program for early architecture and design students, covering model-making, client presentations and sustainable building practice.",
     steps:["Assemble a 6-page portfolio PDF","Get portfolio feedback from a studio instructor","Write a short cover letter","Submit by Feb 20"],
     status:"updated",lastChecked:54,url:"#"},
    {id:"ext-biomed",title:"Summer Biomedical Research Program",org:"Chicago academic medical center",source:"External",type:"Research",
     years:["1st","2nd","3rd","4th"],majors:["science","engineering","computing"],citizenship:["us","pr","intl"],interests:["health","research","data"],
     deadline:"2027-01-31",location:"Chicago (Near West Side)",paid:true,
     summary:"A paid summer placement in a biomedical lab or clinical-data team, with a weekly seminar series and a research showcase.",
     steps:["List 2 research areas you're curious about","Request one faculty reference","Write a 1-page statement of interest","Submit by Jan 31"],
     status:"new",lastChecked:88,url:"#"},
    {id:"ext-sustain-fellow",title:"Climate Leaders Fellowship",org:"National sustainability nonprofit",source:"External",type:"Fellowship",
     years:["1st","2nd","3rd","4th"],majors:["any"],citizenship:["us","pr","intl"],interests:["sustainability","policy","business"],
     deadline:"2026-12-18",location:"Virtual + Chicago kickoff",paid:true,
     summary:"A year-long, part-time fellowship where students lead a campus or community climate project with coaching and a small project grant.",
     steps:["Sketch a one-paragraph campus project idea","Find one teammate or advisor","Record a 2-minute intro video","Submit by Dec 18"],
     status:"new",lastChecked:17,url:"#"},
    {id:"iit-coop",title:"Co-op Program (Summer + Fall 2027 work terms)",org:"Illinois Tech Career Services",source:"IIT",type:"Internship",
     years:["3rd","4th"],majors:["engineering","computing","science","business"],citizenship:["us","pr","intl"],interests:["hardware","software","data","business"],
     deadline:"2026-12-11",location:"Chicago-area employer partners",paid:true,
     summary:"A paid, full-time work term with an IIT employer partner, earning co-op credit so you stay on track to graduate. Built for juniors and seniors with core courses done.",
     steps:["Attend a co-op orientation with Career Services by Nov 20","Get your resume approved in Handshake","International students: request CPT from the Office of Global Services before you start","Apply to 5+ postings tagged \"Co-op\" in Handshake","Submit applications by Dec 11 and register for the co-op course once you accept"],
     status:"updated",lastChecked:6,url:"#"},
    {id:"ext-reu-energy",title:"Summer REU: Materials for Clean Energy",org:"NSF-funded REU site (partner university)",source:"External",type:"Research",
     years:["3rd"],majors:["engineering","science"],citizenship:["us","pr"],interests:["research","sustainability","hardware"],
     deadline:"2027-02-10",location:"Out-of-state partner campus (housing provided)",paid:true,
     summary:"A 10-week National Science Foundation research experience for students heading into their senior year, with a stipend, housing and travel support. Strong prep for grad school.",
     steps:["Shortlist 2 faculty projects on the site's page","Ask a professor from a junior-level lab course for a reference","Write a 1-page statement linking your coursework to one project","Order an unofficial transcript","Submit through the REU application portal by Feb 10"],
     status:"new",lastChecked:19,url:"#"},
    {id:"ext-chi-eng-consult",title:"Summer Engineering & Consulting Internship",org:"Chicago engineering consulting firm",source:"External",type:"Internship",
     years:["3rd","4th"],majors:["engineering","business","computing"],citizenship:["us","pr","intl"],interests:["hardware","sustainability","business","data"],
     deadline:"2027-01-15",location:"Chicago (Loop)",paid:true,
     summary:"A 12-week paid internship on building-systems and infrastructure projects for Chicago clients, with site visits, modeling work and a path to a full-time offer.",
     steps:["Put one technical project with numbers at the top of your resume","Book a mock interview at Career Services","Prepare a 2-minute walkthrough of that project","International students: confirm CPT eligibility with Global Services","Apply on Handshake by Jan 15"],
     status:"updated",lastChecked:11,url:"#"},
    {id:"ext-newgrad-eng",title:"Engineering Development Program (2027 graduates)",org:"Chicago-area manufacturing company",source:"External",type:"Full-time job",
     years:["4th"],majors:["engineering","computing"],citizenship:["us","pr","intl"],interests:["hardware","software","sustainability"],
     deadline:"2026-12-04",location:"Chicago suburbs (on site)",paid:true,
     summary:"A two-year full-time rotational program for graduating seniors, with three rotations across design, test and manufacturing teams and a mentor for each one.",
     steps:["Lead your resume with your senior design or capstone project","Book a mock interview at Career Services","International students: ask Global Services about OPT timing","Apply on Handshake by Dec 4"],
     status:"new",lastChecked:9,url:"#"},
    {id:"ext-newgrad-swe",title:"Associate Software Engineer (2027 start)",org:"Chicago fintech company",source:"External",type:"Full-time job",
     years:["4th"],majors:["computing","engineering"],citizenship:["us","pr","intl"],interests:["software","data","finance"],
     deadline:"2026-11-30",location:"Chicago (River North, hybrid)",paid:true,
     summary:"A full-time software engineering role for May 2027 graduates on a payments platform team, starting with a six-week onboarding cohort.",
     steps:["Pick 2 projects you can walk through in an interview","Practice 3 medium coding problems a week","Ask a past internship manager to be a reference","International students: confirm your OPT start date with Global Services","Apply by Nov 30"],
     status:"new",lastChecked:13,url:"#"},
    {id:"iit-gradprep",title:"Grad School & Fellowship Prep Cohort",org:"Illinois Tech Career Services",source:"IIT",type:"Grad school prep",
     years:["3rd","4th"],majors:["any"],citizenship:["us","pr","intl"],interests:["research","policy","health","data"],
     deadline:"2027-01-20",location:"Chicago (Mies Campus)",paid:false,
     summary:"A spring cohort for juniors and seniors applying to grad school or national fellowships, with statement-of-purpose workshops, letter planning and a mock admissions panel.",
     steps:["List 3 to 5 programs or fellowships you are considering","Ask two faculty members about letters of recommendation","Draft a one-page statement of purpose","Register for the cohort by Jan 20"],
     status:"new",lastChecked:14,url:"#"}
  ];

  var RESEARCH=[
    {id:'rs-09',title:'Predicting bus bunching from CTA open data',faculty:'Prof. K. Iyer',dept:'Computer Science',
     summary:'Use the CTA\'s public bus-tracker feed to predict when buses will bunch up, then test simple fixes in a small simulator.',
     interests:['software','data','policy'],majors:['computing','science'],years:['2nd','3rd','4th'],hoursPerWeek:10,comp:'Paid',spots:2,applicants:3,postedHoursAgo:6,start:'Spring 2027',
     skillsNice:['Python','Some statistics','Interest in transit']},
    {id:'rs-01',title:'Soft robotic grippers for handling fresh produce',faculty:'Prof. A. Raman',dept:'Mechanical, Materials & Aerospace Engineering',
     summary:'Design and test silicone grippers that pick up fruit without bruising it. You will print molds, cast parts and run grip-force tests.',
     interests:['hardware','sustainability','design'],majors:['engineering'],years:['2nd','3rd','4th'],hoursPerWeek:10,comp:'Paid',spots:2,applicants:14,postedHoursAgo:30,start:'Spring 2027',
     skillsNice:['CAD (SolidWorks or Fusion)','3D printing','Patience with experiments']},
    {id:'rs-02',title:'Lightweight lattice frames for small drones',faculty:'Prof. A. Raman',dept:'Mechanical, Materials & Aerospace Engineering',
     summary:'Compare 3D-printed lattice designs for stiffness and weight, then fly the best one. A good first project: we teach the tools.',
     interests:['hardware','design','data'],majors:['engineering','design','science'],years:['1st','2nd','3rd'],hoursPerWeek:8,comp:'Course credit',spots:3,applicants:6,postedHoursAgo:5,start:'Spring 2027',
     skillsNice:['Any CAD tool','Curiosity about flight','Basic spreadsheets']},
    {id:'rs-03',title:'Fairness checks for campus chatbots',faculty:'Prof. L. Okafor',dept:'Computer Science',
     summary:'Build test sets that check whether student-facing chatbots answer equally well for different groups of students, and report what you find.',
     interests:['software','data','policy'],majors:['any'],years:['1st','2nd','3rd','4th'],hoursPerWeek:10,comp:'Paid',spots:3,applicants:21,postedHoursAgo:52,start:'Spring 2027',
     skillsNice:['Some Python','Careful writing','Interest in ethics']},
    {id:'rs-04',title:'Wearable sweat sensors for athlete hydration',faculty:'Prof. M. Delgado-Ruiz',dept:'Biomedical Engineering',
     summary:'Help validate a flexible sweat patch against lab measurements during Scarlet Hawks training sessions.',
     interests:['health','hardware','data'],majors:['engineering','science'],years:['2nd','3rd','4th'],hoursPerWeek:12,comp:'Paid',spots:2,applicants:9,postedHoursAgo:12,start:'Spring 2027',
     skillsNice:['Lab safety training','Excel or Python','Early-morning availability']},
    {id:'rs-05',title:'Sleep, screens and study habits in the first year',faculty:'Prof. R. Whitfield',dept:'Psychology',
     summary:'Run short surveys and sleep-diary check-ins with first-year students and help analyze how routines relate to grades and stress.',
     interests:['health','data','policy'],majors:['any'],years:['1st','2nd'],hoursPerWeek:6,comp:'Course credit',spots:4,applicants:7,postedHoursAgo:70,start:'Spring 2027',
     skillsNice:['Friendly with people','Attention to detail','Any stats course']},
    {id:'rs-06',title:'Low-carbon cement additives from waste glass',faculty:'Prof. S. Nakamura',dept:'Chemistry',
     summary:'Grind, treat and test recycled glass powders as a partial cement replacement, measuring strength and CO2 savings.',
     interests:['sustainability','hardware'],majors:['science','engineering'],years:['2nd','3rd','4th'],hoursPerWeek:10,comp:'Paid',spots:1,applicants:11,postedHoursAgo:96,start:'Spring 2027',
     skillsNice:['General Chemistry lab','Careful record-keeping']},
    {id:'rs-07',title:'A heat-relief toolkit for Bronzeville blocks',faculty:'Prof. J. Castellanos',dept:'Institute of Design',
     summary:'Interview neighbors, map hot spots and prototype low-cost cooling ideas with a community partner. No design background needed.',
     interests:['design','sustainability','policy'],majors:['any'],years:['1st','2nd','3rd','4th'],hoursPerWeek:8,comp:'Volunteer',spots:5,applicants:4,postedHoursAgo:3,start:'Spring 2027',
     skillsNice:['Listening and note-taking','Sketching (any level)','Spanish is a plus']},
    {id:'rs-08',title:'Scheduling grid batteries with optimization',faculty:'Prof. E. Varga',dept:'Applied Mathematics',
     summary:'Model when a campus battery should charge and discharge to cut cost and emissions, using real price data.',
     interests:['data','finance','sustainability','software'],majors:['computing','science','engineering','business'],years:['2nd','3rd','4th'],hoursPerWeek:10,comp:'Course credit',spots:2,applicants:5,postedHoursAgo:20,start:'Spring 2027',
     skillsNice:['Calculus II','Python or MATLAB','Linear algebra (helpful)']}
  ];

  function seed(){
    return {
      v:VERSION,seq:20,
      profile:{name:'John',year:'3rd',major:'Computer Science',majorGroup:'computing',citizenship:'us',interests:['software','data','research'],portal:['name','year','major','citizenship']},
      saved:['iit-urp','ext-swe-intern','iit-coop','ext-anl-suli','iit-extern','ext-chi-eng-consult'],
      checklists:{'iit-urp':[0,1,2],'iit-coop':[0],'ext-swe-intern':[0,1],'iit-extern':[0,1,2,3],'ext-chi-eng-consult':[0,1,2,4]},
      applications:[
        {id:'app_3',kind:'research',projectId:'rs-03',submitted:'2026-11-10',stage:2,status:'Interview invite',note:'Pick a time by Wed, Nov 18.',
         invite:{from:'Prof. L. Okafor',replyBy:'2026-11-18',where:'Stuart Building or Zoom',slots:['2026-11-18T15:00','2026-11-19T11:00','2026-11-20T13:30'],picked:null}},
        {id:'app_2',kind:'program',programId:'ext-chi-eng-consult',submitted:'2026-11-12',stage:1,status:'Under review',note:'The firm starts reviewing applications Dec 1.'},
        {id:'app_1',kind:'program',programId:'iit-extern',submitted:'2026-11-09',stage:3,status:'Accepted',note:'Host matched: a Chicago fintech team, Jan 6 to 7.'}
      ],
      appointments:[{id:'apt_1',kind:'resume',title:'Resume review',with:'Dana Brooks',start:'2026-11-19T14:00',mins:30,where:'Zoom',programId:null}],
      todos:[
        {id:'td_1',title:'Add your IPRO project to your resume',from:'Dana Brooks',due:'2026-11-18',done:false},
        {id:'td_2',title:'Pick 2 internship postings to bring to your resume review',from:'Dana Brooks',due:'2026-11-19',done:false}
      ],
      notifications:[
        {id:'n_1',kind:'faculty',at:'2026-11-16T07:40',title:'Prof. L. Okafor invited you to interview',body:'Fairness checks for campus chatbots. Pick a time by Wed, Nov 18.',action:{type:'invite',id:'app_3',label:'Pick a time'},read:false},
        {id:'n_2',kind:'match',at:'2026-11-16T06:05',title:'New match: Data Science Intern (Summer 2027)',body:'Chicago health-tech company. Matches Software and Data & AI.',action:{type:'open',id:'ext-data-intern',label:'View'},read:false},
        {id:'n_3',kind:'agent',at:'2026-11-15T18:20',title:'Deadline moved: Co-op Program',body:'The agent saw the Handshake posting move the deadline from Dec 4 to Dec 11.',action:{type:'open',id:'iit-coop',label:'View'},read:false},
        {id:'n_4',kind:'coach',at:'2026-11-15T10:00',title:'Resume review on Thursday',body:'Dana Brooks, Thu, Nov 19 at 2:00 PM on Zoom.',action:null,read:true},
        {id:'n_5',kind:'app',at:'2026-11-13T16:05',title:'Externship host matched',body:'Winter Break Externship: a Chicago fintech team, Jan 6 to 7.',action:{type:'open',id:'iit-extern',label:'View'},read:true}
      ],
      research:{closed:[],posted:[]}
    };
  }

  function loadDb(){
    try{var raw=localStorage.getItem(DB_KEY);if(raw){var d=JSON.parse(raw);if(d&&d.v===VERSION)return d;}}catch(e){}
    return null;
  }
  var db=loadDb()||seed();
  function save(){try{localStorage.setItem(DB_KEY,JSON.stringify(db));}catch(e){}}
  function nextId(p){db.seq=(db.seq||20)+1;return p+db.seq;}

  function program(id){for(var i=0;i<PROGRAMS.length;i++)if(PROGRAMS[i].id===id)return PROGRAMS[i];return null;}
  function project(id){var all=db.research.posted.concat(RESEARCH);for(var i=0;i<all.length;i++)if(all[i].id===id)return all[i];return null;}
  function appFor(kind,id){return db.applications.filter(function(a){return a.kind===kind&&(a.programId===id||a.projectId===id);})[0]||null;}
  function shortTitle(t){return String(t).replace(/\s*\([^)]*\)/g,'').trim();}
  function err(status,msg){return {error:msg,status:status};}

  function bootstrapData(){
    return {
      clock:ymd(today()),
      student:STUDENT,coach:COACH,profile:db.profile,
      programs:PROGRAMS,saved:db.saved,checklists:db.checklists,
      applied:db.applications.filter(function(a){return a.kind==='program';}).map(function(a){return a.programId;}),
      research:{
        projects:RESEARCH,posted:db.research.posted,closed:db.research.closed,
        applied:db.applications.filter(function(a){return a.kind==='research';}).map(function(a){return a.projectId;})
      }
    };
  }

  function enrichApp(a){
    var x=clone(a);
    if(a.kind==='research'){var r=project(a.projectId);x.title=r?r.title:'Research project';x.org=r?r.faculty+' · '+r.dept:'';x.type='Research Match';}
    else{var p=program(a.programId);x.title=p?p.title:'Program';x.org=p?p.org:'';x.type=p?p.type:'Program';}
    return x;
  }

  function buildTasks(){
    var T=today(),out=[];
    db.applications.forEach(function(a){
      if(a.invite&&!a.invite.picked){
        var r=project(a.projectId);
        out.push({id:'invite-'+a.id,kind:'invite',title:'Reply to '+a.invite.from+'\'s interview invite',sub:'Research Match · '+(r?r.title:''),due:a.invite.replyBy,action:{type:'invite',id:a.id,label:'Pick a time'}});
      }
    });
    db.appointments.forEach(function(ap){
      if(daysFrom(ap.start)>=0)out.push({id:'appt-'+ap.id,kind:'appt',title:ap.title+' with '+ap.with,sub:fmtTime(ap.start)+' · '+ap.where,due:ap.start.slice(0,10),action:{type:'appt',id:ap.id,label:'Details'}});
    });
    db.todos.forEach(function(t){
      out.push({id:'todo-'+t.id,refId:t.id,kind:'todo',title:t.title,sub:'From your coach, '+t.from,due:t.due,done:!!t.done,check:true});
    });
    db.saved.forEach(function(pid){
      var p=program(pid);if(!p||appFor('program',pid))return;
      var n=daysFrom(p.deadline);if(n==null||n<0)return;
      var done=db.checklists[pid]||[],steps=p.steps||[],i=-1;
      for(var j=0;j<steps.length;j++){if(done.indexOf(j)<0){i=j;break;}}
      if(i<0){out.push({id:'submit-'+pid,kind:'submit',title:'Submit your application',sub:shortTitle(p.title),due:p.deadline,action:{type:'open',id:pid,label:'Apply'}});return;}
      var off=n>0?Math.max(0,Math.floor(n*(i+1)/(steps.length+1))):0;
      out.push({id:'step-'+pid+'-'+i,kind:'step',title:steps[i],sub:shortTitle(p.title)+' · step '+(i+1)+' of '+steps.length,programId:pid,step:i,due:ymd(addDays(T,off)),deadline:p.deadline,check:true,action:{type:'open',id:pid,label:'Open'}});
    });
    var rank={invite:0,appt:1,todo:2,submit:3,step:4};
    out.sort(function(a,b){return (a.done?1:0)-(b.done?1:0)||a.due.localeCompare(b.due)||rank[a.kind]-rank[b.kind];});
    return out;
  }

  function icsEsc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/[;,]/g,'\\$&').replace(/\n/g,'\\n');}
  function icsLocal(s){var d=parse(s);return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+'00';}
  function buildIcs(){
    var stamp=ymd(today()).replace(/-/g,'')+'T'+pad(CLOCK[3])+pad(CLOCK[4])+'00';
    var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Elevate Opportunities Hub//Demo//EN','CALSCALE:GREGORIAN','X-WR-CALNAME:Elevate (John Smith, demo)'],count=0;
    db.saved.forEach(function(id){
      var p=program(id);if(!p||!p.deadline)return;count++;
      var d=parse(p.deadline),end=addDays(d,1);
      L.push('BEGIN:VEVENT','UID:'+p.id+'@elevate-hub.example','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+p.deadline.replace(/-/g,''),'DTEND;VALUE=DATE:'+ymd(end).replace(/-/g,''),
        'SUMMARY:'+icsEsc('Deadline: '+p.title),
        'DESCRIPTION:'+icsEsc((p.org||'')+'\n\nNext steps:\n'+(p.steps||[]).map(function(s,i){return (i+1)+'. '+s;}).join('\n')+'\n\nFrom the Elevate Opportunities Hub'),
        'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(p.title+' closes in 3 days'),'TRIGGER:-P3D','END:VALARM','END:VEVENT');
    });
    db.appointments.forEach(function(ap){
      if(daysFrom(ap.start)<0)return;count++;
      var s=parse(ap.start),e=new Date(s.getTime()+ap.mins*6e4);
      L.push('BEGIN:VEVENT','UID:'+ap.id+'@elevate-hub.example','DTSTAMP:'+stamp,'DTSTART:'+icsLocal(ap.start),'DTEND:'+icsLocal(ymd(e)+'T'+pad(e.getHours())+':'+pad(e.getMinutes())),
        'SUMMARY:'+icsEsc(ap.title+' with '+ap.with),'LOCATION:'+icsEsc(ap.where),'END:VEVENT');
    });
    L.push('END:VCALENDAR');
    return {count:count,filename:'elevate-john-smith-demo.ics',ics:L.join('\r\n')};
  }

  var routes=[];
  function route(m,p,g,sys,does,h){
    routes.push({m:m,p:p,g:g,sys:sys,does:does,h:h,keys:(p.match(/:(\w+)/g)||[]).map(function(k){return k.slice(1);}),
      re:new RegExp('^'+p.replace(/[.]/g,'\\.').replace(/:(\w+)/g,'([^/]+)')+'$')});
  }

  route('GET','/api/bootstrap','Profile','Elevate API: one call when the page loads','Everything the page needs to draw: profile, programs, saved programs, checklists and applications.',function(){return bootstrapData();});
  route('GET','/api/me','Profile','Elevate database (students), refreshed from Banner each night','Your Hub profile, student record summary and coach.',function(){return {student:STUDENT,profile:db.profile,coach:COACH};});
  route('GET','/api/me/portal-record','Profile','Banner (Registrar), read-only, only after you allow it','Year, major and citizenship category from your student record.',function(){
    return {name:STUDENT.preferredName,year:STUDENT.classYear,major:STUDENT.major,citizenship:STUDENT.citizenshipCategory,source:{system:'Banner',fields:['class standing','major','citizenship category'],consent:true}};
  });
  route('PATCH','/api/me','Profile','Elevate database (student_profiles)','Saves your interests or profile changes.',function(p,b){
    var pr=b.profile||{};
    db.profile={name:String(pr.name||'').slice(0,40),year:pr.year,major:pr.major,majorGroup:pr.majorGroup,citizenship:pr.citizenship,
      interests:Array.isArray(pr.interests)?pr.interests.slice(0,10):[],portal:Array.isArray(pr.portal)?pr.portal:[]};
    return {profile:db.profile};
  });

  route('GET','/api/programs','Programs','Elevate database (programs), kept current by the tracking agent','Every program the Hub tracks, with eligibility rules and steps.',function(){return {asOf:ymd(today()),programs:PROGRAMS};});
  route('PUT','/api/me/saved/:id','Programs','Elevate database (saved_programs)','Saves a program to your list.',function(p){
    if(!program(p.id))return err(404,'Unknown program');
    if(db.saved.indexOf(p.id)<0)db.saved.push(p.id);
    return {saved:db.saved};
  });
  route('DELETE','/api/me/saved/:id','Programs','Elevate database (saved_programs)','Removes a program from your list.',function(p){
    db.saved=db.saved.filter(function(x){return x!==p.id;});return {saved:db.saved};
  });
  route('PUT','/api/me/checklists/:id','Programs','Elevate database (checklist_progress)','Saves which checklist steps you finished.',function(p,b){
    var pr=program(p.id);if(!pr)return err(404,'Unknown program');
    var n=pr.steps.length,seen={};
    db.checklists[p.id]=(Array.isArray(b.done)?b.done:[]).map(Number).filter(function(i){if(i<0||i>=n||seen[i])return false;seen[i]=1;return true;});
    return {id:p.id,done:db.checklists[p.id],total:n};
  });

  route('GET','/api/me/tasks','Your week','Tasks service: reads checklists, deadlines, invites, appointments and coach to-dos','Builds your to-do list.',function(){return {generatedAt:ymd(today()),tasks:buildTasks()};});
  route('PATCH','/api/me/todos/:id','Your week','Elevate database (todos)','Checks off a to-do your coach gave you.',function(p,b){
    var t=db.todos.filter(function(x){return x.id===p.id;})[0];if(!t)return err(404,'Unknown to-do');
    t.done=!!b.done;return {todo:t};
  });

  route('GET','/api/me/applications','Applications','Elevate database (applications) and Research Match','Where each of your applications stands.',function(){
    return {applications:db.applications.map(enrichApp)};
  });
  route('POST','/api/me/applications','Applications','Elevate database (applications); the click-out is logged','Records that you applied to a program.',function(p,b){
    var pr=program(b.programId);if(!pr)return err(404,'Unknown program');
    var a=appFor('program',pr.id);
    if(!a){
      a={id:nextId('app_'),kind:'program',programId:pr.id,submitted:ymd(today()),stage:0,status:'Submitted',note:'Submitted '+fmtDay(ymd(today()))+'. Watch your email for a confirmation.'};
      db.applications.unshift(a);
      if(db.saved.indexOf(pr.id)<0)db.saved.push(pr.id);
    }
    return {application:enrichApp(a)};
  });
  route('GET','/api/me/applications/:id/interview-slots','Applications','Research Match: the professor\'s offered times','The interview times a professor offered you.',function(p){
    var a=db.applications.filter(function(x){return x.id===p.id;})[0];
    if(!a||!a.invite)return err(404,'No invite for this application');
    if(a.invite.picked)return err(409,'Interview already scheduled for '+fmtWhen(a.invite.picked));
    var r=project(a.projectId);
    return {from:a.invite.from,title:r?r.title:'',where:a.invite.where,replyBy:a.invite.replyBy,slots:a.invite.slots};
  });
  route('POST','/api/me/applications/:id/interview','Applications','Research Match: emails the professor and sends a calendar invite','Books your interview time.',function(p,b){
    var a=db.applications.filter(function(x){return x.id===p.id;})[0];
    if(!a||!a.invite)return err(404,'No invite for this application');
    if(a.invite.slots.indexOf(b.slot)<0)return err(400,'That time is not offered');
    a.invite.picked=b.slot;a.status='Interview scheduled';a.note=fmtWhen(b.slot)+' with '+a.invite.from+', '+a.invite.where+'.';
    db.appointments.push({id:nextId('apt_'),kind:'interview',title:'Research interview',with:a.invite.from,start:b.slot,mins:20,where:a.invite.where,programId:null});
    db.notifications.forEach(function(n){if(n.action&&n.action.type==='invite'&&n.action.id===a.id){n.read=true;n.action=null;}});
    return {application:enrichApp(a)};
  });

  route('GET','/api/me/appointments','Coach','Career Services scheduling (Handshake appointments)','Your upcoming appointments.',function(){
    return {appointments:db.appointments.filter(function(a){return daysFrom(a.start)>=0;}).sort(function(a,b){return a.start.localeCompare(b.start);})};
  });
  route('GET','/api/coach/slots','Coach','Your coach\'s calendar, through Handshake','Open times with your Elevate Success Coach.',function(){
    var taken=db.appointments.map(function(a){return a.start;});
    return {coach:COACH.name,slots:COACH_SLOTS.filter(function(s){return taken.indexOf(s)<0;})};
  });
  route('POST','/api/me/appointments','Coach','Handshake appointments; your coach sees the program you picked','Books time with your coach.',function(p,b){
    if(COACH_SLOTS.indexOf(b.slot)<0)return err(400,'That time is not open');
    if(db.appointments.some(function(a){return a.start===b.slot;}))return err(409,'You already have that time');
    var pr=b.programId?program(b.programId):null;
    var ap={id:nextId('apt_'),kind:pr?'program':'chat',title:pr?'Application help: '+shortTitle(pr.title):'Coaching chat',with:COACH.name,start:b.slot,mins:20,where:'Zoom',programId:pr?pr.id:null};
    db.appointments.push(ap);
    db.notifications.unshift({id:nextId('n_'),kind:'coach',at:CLOCK[0]+'-'+pad(CLOCK[1]+1)+'-'+pad(CLOCK[2])+'T'+pad(CLOCK[3])+':'+pad(CLOCK[4]),title:'Booked with '+COACH.name,body:ap.title+', '+fmtWhen(ap.start)+' on Zoom.',action:null,read:true});
    return {appointment:ap};
  });

  route('GET','/api/me/notifications','Updates','Notifications service','Your updates feed.',function(){
    return {unread:db.notifications.filter(function(n){return !n.read;}).length,notifications:db.notifications.slice().sort(function(a,b){return b.at.localeCompare(a.at);}).map(function(n){var x=clone(n);x.ago=ago(n.at);return x;})};
  });
  route('POST','/api/me/notifications/:id/read','Updates','Notifications service','Marks one update as read.',function(p){
    db.notifications.forEach(function(n){if(n.id===p.id)n.read=true;});return {ok:true};
  });
  route('POST','/api/me/notifications/read-all','Updates','Notifications service','Marks every update as read.',function(){
    db.notifications.forEach(function(n){n.read=true;});return {ok:true};
  });

  route('GET','/api/research/projects','Research Match','Research Match database','Open faculty projects.',function(){
    return {projects:db.research.posted.concat(RESEARCH).filter(function(r){return db.research.closed.indexOf(r.id)<0;})};
  });
  route('POST','/api/research/applications','Research Match','Research Match database; emails the professor','Applies to a faculty project.',function(p,b){
    var r=project(b.projectId);if(!r)return err(404,'Unknown project');
    var a=appFor('research',r.id);
    if(!a){
      a={id:nextId('app_'),kind:'research',projectId:r.id,submitted:ymd(today()),stage:0,status:'Submitted',note:'Sent to '+r.faculty+'. Professors usually reply within a week.',
        hoursPerWeek:+b.hoursPerWeek||0,shareProfile:!!b.shareProfile};
      db.applications.unshift(a);
    }
    return {application:enrichApp(a)};
  });
  route('POST','/api/research/projects','Research Match','Research Match database (faculty sign-in only)','Posts a new faculty project.',function(p,b){
    if(!b||typeof b.title!=='string')return err(400,'Missing title');
    var x={id:String(b.id||nextId('rs-p-')),title:b.title.slice(0,90),summary:String(b.summary||'').slice(0,280),interests:b.interests||[],majors:b.majors||['any'],years:b.years||[],
      hoursPerWeek:+b.hoursPerWeek||10,comp:b.comp||'Volunteer',spots:+b.spots||1,postedAt:+b.postedAt||Date.now(),start:b.start||'Spring 2027',matchN:+b.matchN||0};
    db.research.posted.unshift(x);
    return {project:x};
  });
  route('PATCH','/api/research/projects/:id','Research Match','Research Match database (faculty sign-in only)','Closes or reopens a project.',function(p,b){
    db.research.closed=db.research.closed.filter(function(x){return x!==p.id;});
    if(b.status==='closed')db.research.closed.push(p.id);
    return {id:p.id,status:b.status==='closed'?'closed':'open'};
  });

  route('GET','/api/me/calendar.ics','Updates','Calendar feed generator','Your saved deadlines and appointments as a calendar file.',function(){return buildIcs();});

  function parseQuery(s){var q={};(s||'').split('&').forEach(function(kv){if(!kv)return;var i=kv.indexOf('=');q[decodeURIComponent(i<0?kv:kv.slice(0,i))]=i<0?'':decodeURIComponent(kv.slice(i+1));});return q;}
  function findRoute(m,path){
    for(var i=0;i<routes.length;i++){
      var r=routes[i];if(r.m!==m)continue;
      var x=r.re.exec(path);if(!x)continue;
      var params={};r.keys.forEach(function(k,j){params[k]=decodeURIComponent(x[j+1]);});
      return {r:r,params:params};
    }
    return null;
  }

  var log=[],logN=0;
  function record(entry){
    log.unshift(entry);if(log.length>80)log.length=80;
    try{window.dispatchEvent(new CustomEvent('ehapi:log',{detail:entry}));}catch(e){}
  }
  function request(method,path,body){
    method=String(method||'GET').toUpperCase();
    var parts=String(path).split('?'),hit=findRoute(method,parts[0]),status=200,res;
    if(!hit){status=404;res={error:'No such endpoint in the mock API'};}
    else{
      try{res=hit.r.h(hit.params,body?clone(body):{},parseQuery(parts[1]));if(res&&res.error){status=res.status||400;delete res.status;}save();}
      catch(e){status=500;res={error:String(e&&e.message||e)};}
    }
    var ms=Math.round(80+Math.random()*240);
    var entry={n:++logN,at:Date.now(),method:method,path:path,status:status,ms:ms,sys:hit?hit.r.sys:'',body:body==null?null:clone(body),res:clone(res)};
    return new Promise(function(resolve){setTimeout(function(){record(entry);resolve(clone(res));},ms);});
  }

  var boot=null;
  function bootstrap(){
    if(!boot){
      boot=bootstrapData();
      record({n:++logN,at:Date.now(),method:'GET',path:'/api/bootstrap',status:200,ms:142,sys:routes[0].sys,body:null,res:clone(boot)});
    }
    return clone(boot);
  }

  function reset(){
    [window.localStorage,window.sessionStorage].forEach(function(s){
      try{var ks=[];for(var i=0;i<s.length;i++){var k=s.key(i);if(k&&k.indexOf('ehdemo_')===0)ks.push(k);}ks.forEach(function(k){s.removeItem(k);});}catch(e){}
    });
  }

  window.EHAPI={
    today:today,now:now,request:request,bootstrap:bootstrap,reset:reset,
    log:function(){return log.slice();},
    routes:function(){return routes.map(function(r){return {method:r.m,path:r.p,group:r.g,sys:r.sys,does:r.does};});},
    researchNote:function(id){var a=appFor('research',id);return a?a.status+' · '+a.note:'';},
    fmt:{day:fmtDay,time:fmtTime,when:fmtWhen,parse:parse,daysFrom:daysFrom,ymd:ymd}
  };
})();
