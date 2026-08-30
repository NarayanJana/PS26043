const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

dotenv.config();

const seededEmails = [
  'contact@ntu-agritech.edu',
  'contact@coastal-institute.edu',
  'contact@regional-medical-university.edu',
  'contact@state-tech-university.edu',
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Fixing passwords...');

  const correctHash = await bcrypt.hash('password123', 10);

  for (const email of seededEmails) {
    // Using updateOne (a query, not a document .save()) deliberately
    // bypasses the User model's pre('save') hook — so this hashes the
    // password exactly once, instead of hashing it again on top.
    const result = await User.updateOne({ email }, { password: correctHash });
    console.log(
      result.matchedCount > 0 ? `Fixed: ${email}` : `Not found (skipped): ${email}`
    );
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error('Fix failed:', err.message);
  process.exit(1);
});