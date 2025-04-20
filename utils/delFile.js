const fs = require("fs");

// console.log(__dirname);

// const filePath = __dirname + '/../public/photos/' + 'image-1682915925751.png';
// console.log(filePath);

function DeleteFile(filename, res, type) {
  const filePath = __dirname + `/../public/images/${type}/` + filename;

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist");
      //return res.status(404).send('file not found')
    } else {
      console.log("File exists");
      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          // An error occurred while deleting the file
          console.error(err);
          //return res.status(500).send("Failed to delete the file");
        }
        // File successfully deleted
        console.log("file deletion successful");
      });
    }
  });
}

module.exports = DeleteFile;
