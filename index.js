const listGenerator = require('./lib');

const source = "/YourPath";
const target = "/YourTargetToSaveList";

// some extensions have exclusive formatting for final report, so far only mp3/m4a
const especificalExtension =  ["mp3", "m4a"];

listGenerator(source, target, especificalExtension);

