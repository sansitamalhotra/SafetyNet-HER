require('dotenv').config();
const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Volunteer = require('../models/Volunteer');

async function createDemoData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  
  // Clear existing
  await Incident.deleteMany({});
  await Volunteer.deleteMany({});
  
  // Create volunteers
  const volunteers = [
    {
      name: 'Sarah Martinez',
      phone: '+16475551234',
      location: { type: 'Point', coordinates: [-79.8711, 43.2557] },
      available: true,
      onDuty: true,
      skills: ['de-escalation', 'mental-health'],
      languages: ['English', 'Spanish'],
      rating: 4.9
    },
    {
      name: 'Maria Rodriguez',
      phone: '+16475555678',
      location: { type: 'Point', coordinates: [-79.8700, 43.2560] },
      available: true,
      onDuty: true,
      skills: ['crisis-counseling', 'medical'],
      languages: ['English'],
      rating: 5.0
    },
    {
      name: 'Jessica Thompson',
      phone: '+16475559999',
      location: { type: 'Point', coordinates: [-79.8720, 43.2550] },
      available: true,
      onDuty: false,
      skills: ['multilingual', 'de-escalation'],
      languages: ['English', 'French'],
      rating: 4.8
    }
  ];
  
  await Volunteer.insertMany(volunteers);
  console.log('✅ Created 3 volunteers');
  
  // Create realistic incidents over past 30 days
  const crisisMessages = [
    { msg: "Someone is following me from Main St", cat: 'following', urg: 9 },
    { msg: "Guy won't leave me alone at bar", cat: 'harassment', urg: 7 },
    { msg: "Walking home alone feel unsafe", cat: 'unsafe_location', urg: 6 },
    { msg: "Man catcalling me on King St", cat: 'harassment', urg: 5 },
    { msg: "Suspicious person near bus stop", cat: 'unsafe_location', urg: 7 },
    { msg: "Someone grabbed my arm", cat: 'harassment', urg: 9 },
    { msg: "Dark alley need escort", cat: 'unsafe_location', urg: 8 },
    { msg: "Ex-boyfriend outside my apartment", cat: 'domestic', urg: 10 },
    { msg: "Group of men making me uncomfortable", cat: 'harassment', urg: 8 },
    { msg: "Lost in unfamiliar area at night", cat: 'unsafe_location', urg: 6 },
    { msg: "Someone following me for 3 blocks", cat: 'following', urg: 9 },
    { msg: "Aggressive panhandler won't leave", cat: 'harassment', urg: 6 },
    { msg: "Date making me uncomfortable", cat: 'other', urg: 7 },
    { msg: "Stranger knows my name scared", cat: 'following', urg: 10 },
    { msg: "Walked past same person 3 times", cat: 'following', urg: 8 }
  ];
  
  const incidents = [];
  const now = Date.now();
  
  // Spread incidents over past 30 days
  for (let i = 0; i < 50; i++) {
    const crisis = crisisMessages[i % crisisMessages.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
    
    // More incidents on Fridays/Saturdays 10pm-2am
    let dayOfWeek = timestamp.getDay();
    let hour = timestamp.getHours();
    
    incidents.push({
      userPhone: `+1555555${String(i).padStart(4, '0')}`,
      message: crisis.msg,
      timestamp,
      category: crisis.cat,
      urgency: crisis.urg,
      emotion: crisis.urg >= 8 ? 'fear' : (crisis.urg >= 6 ? 'concern' : 'calm'),
      status: i < 5 ? 'pending' : (i < 10 ? 'dispatched' : 'resolved'),
      policeInvolved: Math.random() < 0.09, // 9% police involvement
      location: {
        type: 'Point',
        coordinates: [
          -79.8711 + (Math.random() - 0.5) * 0.02,
          43.2557 + (Math.random() - 0.5) * 0.02
        ]
      }
    });
  }
  
  await Incident.insertMany(incidents);
  console.log('✅ Created 50 incidents');
  
  console.log('\n📊 DEMO DATA SUMMARY:');
  console.log('  - 3 volunteers (all on duty)');
  console.log('  - 50 incidents (spread over 30 days)');
  console.log('  - 5 pending, 5 dispatched, 40 resolved');
  console.log('  - ~9% police involvement (showing community resolution works!)');
  
  mongoose.connection.close();
}

createDemoData();
