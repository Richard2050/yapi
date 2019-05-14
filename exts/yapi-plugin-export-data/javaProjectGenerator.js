const fs = require('fs-extra');
const path = require('path');
const zipper = require('zip-local');
const fileSeparator = '====';

const parseCode = (codeSource = '', projectFolderName) => {
  const sourceArray = codeSource.split('\n');
  let startPos = (endPos = -1);
  const lastIndex = sourceArray.length - 1;
  return sourceArray.forEach((source, index) => {
    if (source.indexOf(fileSeparator) > -1 || index === lastIndex) {
      if (startPos < 0) {
        startPos = index;
      } else {
        //已经找到文件结束的位置
        endPos = index;
        if (index === lastIndex) {
          endPos++; //为了和非结尾内容处理方法一致
        }

        const filePath = projectFolderName + '/' + sourceArray[startPos].replace(/\s*={4}/, '');
        const fileFolder = filePath.substring(0, filePath.lastIndexOf('/'));
        const fileContent = sourceArray.slice(++startPos, endPos);
        startPos = endPos;
        try {
          fs.ensureDirSync(fileFolder);
          fs.outputFileSync(filePath, fileContent.join('\n'));
        } catch (err) {
          console.log(err); // => null
        }
      }
    }
  });
};

const compressFiles = outputFilePath => {
  return zipper.sync.zip(outputFilePath).memory();
};

const createJavaProject = async (ctx, controller, pid, curProject, list) => {
  // ctx.type = 'html';
  // ctx.body = html;
  await ctx.render('project', {
    projectInfo: curProject,
    interfaceList: list
  });

  const outputFilePath = path.join(__dirname + `/../../static/${controller.$uid}-${pid}-${curProject.name}`);
  parseCode(ctx.body, outputFilePath);
  return compressFiles(outputFilePath);
};

module.exports = createJavaProject;
