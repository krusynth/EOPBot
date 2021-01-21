# EOPBot

US Presidential Actions feed bot. Not an official tool of the US Government.

Supports: Twitter, OMB Memos (more coming soon!)

Yet another tool by [@krusynth](https://billhunt.dev)!

## Installation

1. Create a new database. Login to your Twitter developer account and create a new app with read/write privilegews.
2. Install the dependencies per usual (`npm install` or `yarn install`).
3. Copy `.env.example` to `.env` and add your access credentials.
4. Run migrations with `sequelize`.  There's a `scripts` shortcut for the local copy of sequelize already in `package.json`.

## Using the tool

Run `node ./index.js` to scrape the websites, tweets will automatically be created for new documents.


## TODO:

* Scrape all [presidential actions](https://www.whitehouse.gov/briefing-room/presidential-actions/)
* Scrape [OMB actions besides memos](https://www.whitehouse.gov/omb/information-for-agencies/)
* Look into support for[other EOP offices](https://www.whitehouse.gov/administration/executive-office-of-the-president/)
* Create RSS Feed of updates.