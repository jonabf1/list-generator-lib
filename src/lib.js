const fs = require('fs');
const uuid = require('uuid');
const mm = require('musicmetadata');

let ArrayOnlyFolder;
let controlGenerateDir = false;
let count = 0;

function readDir(path){
  return new Promise((resolve, reject) => {
      fs.readdir(path, (err, paths) =>{
          if(err){
              reject(err)
          } else {
              resolve(paths)
          }
      })
  })
}

function stat(path, archive){
  return new Promise((resolve, reject) => {
      fs.stat(path, (err, stat) =>{
          if(err){
              reject(err)
          } else {
            const array = archive.split(".");
            resolve(
              {
              path,
              name: array.length === 1 ? archive : array.slice(0, array.length - 1).join("."),
              extension: !stat.isFile() ? "folder" : array[array.length - 1],
              isFile: stat.isFile()
            })
          }
      })
  })
}

function writeToFile(target, text){
  return new Promise((resolve, reject) => {
      fs.writeFile(target, text, (err) =>{
          if(err){
              reject(err)
          } 
      })
  })
}

function readMetaDataMusic(music){
  return new Promise((resolve, reject) => {
    mm(fs.createReadStream(music.path), (err, metadata) => {
      let nameMusic= "";
      
      if(!metadata || err){
        nameMusic = music.name;
      }
      else if(!metadata.artist[0]){
        nameMusic = music.name;
      }
      else if(!metadata.title && metadata.artist[0]){
        nameMusic = `${music.name} (${metadata.artist})`;
      }
      else{
        nameMusic=`${metadata.artist[0]} - ${metadata.title}`;
      }
      
      resolve(nameMusic)
    });
  })
}

function mkdir(target){
  return new Promise((resolve, reject) => {
      fs.mkdirSync(target, (err) =>{
          if(err){
              reject(err)
          } 
      })
  })
}

async function listGenerator(source, target, searchFor){
  let textToWrite = "";

  const DirectoryRead = await readDir(source);
  
  const files = DirectoryRead.map(archive => stat(`${source}/${archive}`, archive));
  const filesPromise = await Promise.all(files)

  const ArrayOnlyAllFile = filesPromise.filter(archive => archive.isFile);

  const onlyFilesWithoutSearchforExtensions = [];
  const onlyFilesWithSearchforExtensions = [];

    searchFor.map(ext => 
    ArrayOnlyAllFile.filter(file => file.extension.toLowerCase() === ext.toLowerCase() ? 
    onlyFilesWithSearchforExtensions.push(file) : onlyFilesWithoutSearchforExtensions.push(file)))
  
  console.log(onlyFilesWithoutSearchforExtensions)

  // only for filtered files by ${searchfor} 
  await Promise.all(onlyFilesWithSearchforExtensions.map(async file => {
    if(searchFor) {
      let arrayFileFormattedNameWithoutFalse = [];

      const fileFormattedName = await Promise.all(
        searchFor.map(ext => 
        (ext.toLowerCase() === file.extension.toLowerCase()) ? readMetaDataMusic(file) : false)
      )
  
       fileFormattedName.map(actualFile => actualFile ? arrayFileFormattedNameWithoutFalse.push(actualFile) : false)
       textToWrite+=`${arrayFileFormattedNameWithoutFalse[0]}\n`
    }
    else {
        textToWrite+=`${file.name}\n`;
      }
    }))

  writeToFile(`${target}/${uuid.v4()}`, textToWrite);

  // only folder
  !ArrayOnlyFolder && (ArrayOnlyFolder = filesPromise.filter(folder => !folder.isFile));

  if(ArrayOnlyFolder){
      ArrayOnlyFolder.map(folder => {
        if(!controlGenerateDir){
          mkdir(`${target}/${folder.name}`);
          count+=1;          
        }
        if(ArrayOnlyFolder.length === count){
          controlGenerateDir = true;
        }
        listGenerator(`${source}/${folder.name}`, `${target}/${folder.name}`, searchFor);
        
    })
  }

  return true;
}

module.exports = listGenerator;