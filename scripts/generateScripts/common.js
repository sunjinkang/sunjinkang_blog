var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import chalk from 'chalk';
// 打印错误信息
const printErrorMessage = (msg) => {
    console.log(chalk.red(msg));
};
// 打印成功信息
const printSuccessMessage = (msg) => {
    console.log(chalk.green(msg));
};
// 对报错的处理
const getErrorMessage = (error) => {
    if (typeof error === 'string') {
        printErrorMessage(`错误信息：${error}`);
        return;
    }
    if (error instanceof Error) {
        printErrorMessage(`错误信息：${error.message}`);
        return;
    }
    printErrorMessage('未知错误');
    return;
};
// 检查文件夹是否存在
const isFolderExist = (folderPath) => {
    try {
        const isExist = fs.statSync(folderPath).isDirectory();
        if (isExist) {
            printErrorMessage(`文件夹 ${folderPath} 已存在`);
            return true;
        }
        return false;
    }
    catch (error) {
        getErrorMessage(error);
        return true;
    }
};
// 检查文件是否存在
const isFileExist = (targetPath) => {
    try {
        const isExist = fs.statSync(targetPath).isFile();
        if (!isExist) {
            printErrorMessage(`文件 ${targetPath} 不存在`);
        }
        return isExist;
    }
    catch (error) {
        getErrorMessage(error);
        return false;
    }
};
// 新建文件夹
const createDirectory = (targetDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs.mkdirSync(targetDir, { recursive: true });
    }
    catch (error) {
        getErrorMessage(error);
    }
});
// 新建文件
const createFile = (fileName, fileContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs.writeFileSync(fileName, fileContent);
    }
    catch (error) {
        getErrorMessage(error);
    }
});
// 向文件中新增内容
const insertContentIntoFile = (targetPath, newContent) => {
    fs.readFile(targetPath, 'utf8', (err, data) => {
        if (err) {
            printErrorMessage(`读取文件时出错: ${err}`);
            return;
        }
        let lines = data.split('\n');
        const index = lines.findIndex((line) => line.trim() === '[//]: # 新内容');
        if (index !== -1) {
            lines.splice(index - 1, 0, newContent);
            const newData = lines.join('\n');
            fs.writeFile(targetPath, newData, 'utf8', (err) => {
                if (err) {
                    printErrorMessage(`写入文件时出错: ${err}`);
                }
                else {
                    printSuccessMessage(`向文件${targetPath}新增内容成功！！！`);
                }
            });
        }
        else {
            printErrorMessage('未找到插入位置，请检查目标文件中是否存在占位符');
        }
    });
};
// 模块首页文件名
const moduleIndexName = 'index.md';
export { moduleIndexName, printErrorMessage, printSuccessMessage, isFolderExist, isFileExist, createDirectory, createFile, insertContentIntoFile, getErrorMessage };
//# sourceMappingURL=common.js.map