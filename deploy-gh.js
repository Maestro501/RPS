const ghpages = require('gh-pages');
const path = require('path');
const fs = require('fs');

// synchronous because this is a build script and need to know explicitly when it finishes

ghpages.publish(path.join(__dirname), () => {
});
