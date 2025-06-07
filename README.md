# Instagram Automation Bot 🤖

This is a Puppeteer-based Instagram automation bot designed to simulate human-like behavior across multiple Instagram accounts. It can perform tasks such as logging in, liking posts, and following users. Useful for **educational**, **testing**, and **demonstration** purposes.

---

## 📌 Features

- Login with multiple accounts
- Save and reuse session cookies
- Random delays to mimic human activity
- Perform bulk tasks:
  - ✅ Follow users
  - ❤️ Like posts
- Easy task and account configuration via JSON files

---

## 📁 Project Structure


/instagram-bot
│

├── bot.js # Main automation script

├── accounts.json # List of Instagram test accounts

├── tasks.json # List of follow/like tasks

├── sessions/ # Stores session cookies per account

├── README.md # This file

└── .gitignore # Ignore node_modules, sessions, etc.


---

## 🛠️ Setup Instructions

### 1. Clone the Repository
``bash
git clone https://github.com/Praiseogooluwa/insatgram-bot-project.git
cd instagram-bot-project

### 2. Install Dependencies*
npm install puppeteer


## 3. Add Instagram Accounts
### Create or update the accounts.json file with login details:
[
  { "username": "your_test_account1", "password": "your_password1" },
  
  { "username": "your_test_account2", "password": "your_password2" }
]


## 4. Add Tasks to Perform
### Edit tasks.json like this:
[
  { "type": "follow", "target": "target_username" },
  
  { "type": "like", "postUrl": "https://www.instagram.com/p/POST_ID/" }
]

## 5. Run the Bot
node bot.js


⚠️ Disclaimer
This project is intended strictly for educational and research purposes. Automated interactions with Instagram may violate their terms of service. Use responsibly and avoid targeting real users.

💡 Author
## Isaiah Praise Ogooluwa Bakare 
Linkedin- https://www.linkedin.com/in/praise-ogooluwa/

website - https://praiseogooluwa.github.io/

Resume  - https://drive.google.com/file/d/1etzeWgn6YOaS27DFApJsd9_Xeles273Y/view?usp=sharing
