const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.clusterquize0.ga3ejom.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log("Records:", records);
  }
);