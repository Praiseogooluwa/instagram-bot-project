// generateAccounts.js
const fs = require("fs");

const accounts = [];

for (let i = 1; i <= 10000; i++) {
  accounts.push({
    username: `dummy_user_${i}`,
    password: `pass${i}`
  });
}

fs.writeFileSync("accounts.json", JSON.stringify(accounts, null, 2));
console.log("✅ 10,000 dummy accounts generated in accounts.json");
