const Max = require("max-api");
const path = require("path");
const { PythonShell } = require("python-shell");

let options = {
  mode: "text",
  pythonPath: "/Users/chenghsienyu/opt/anaconda3/bin/python",
  pythonOptions: ["-u"], // get print results in real-time
};

let options_net = {
  host: "172.16.23.15",
};

var artnet = require("artnet")(options_net);

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
};

// This will be printed directly to the Max console
Max.post(`Loaded the ${path.basename(__filename)} script`);

// Use the 'addHandler' function to register a function for a particular message
Max.addHandler("bang", () => {
  PythonShell.run("generator.py", options, function (err) {
    if (err) throw err;
    console.log("generate image");
  });
  // set channel 1 to 255 and disconnect afterwards.
  artnet.set(1, 255, function (err, res) {
    artnet.close();
  });
  Max.post("generate image");
});

// Use the 'outlet' function to send messages out of node.script's outlet
Max.addHandler("echo", (msg) => {
  Max.outlet(msg);
});

// async function go() {
//   PythonShell.run("generator.py", options, function (err) {
//     if (err) throw err;
//     console.log("generate image");
//   });
//   await delay(2000);

//   await artnet.set(1, 255, function (err, res) {
//     artnet.close();
//   });
//   Max.post("generate image");
// }

// var minutes = 1,
//   the_interval = minutes * 60 * 1000;
// setInterval(function () {
//   console.log(`I am doing my ${minutes} minutes check`);
//   // do your stuff here
//   PythonShell.run("generator.py", options, function (err) {
//     if (err) throw err;
//     console.log("generate image");
//   });
//   // set channel 1 to 255 and disconnect afterwards.
//   artnet.set(1, 255, function (err, res) {
//     artnet.close();
//   });
//   Max.post("generate image");
//   Max.outlet("bang");
// }, the_interval);
