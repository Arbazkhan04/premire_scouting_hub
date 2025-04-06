// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "premiere-scouting-prod",
        script: "server.js", // Your main server file
        instances: 1,
        exec_mode: "fork", // or "cluster" if you're scaling
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "soccer-worker",
        script: "./jobs/soccerWorker.js",
        instances: 1,
        exec_mode: "fork",
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "american-football-worker",
        script: "./jobs/americanFootballWorker.js",
        instances: 1,
        exec_mode: "fork",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  