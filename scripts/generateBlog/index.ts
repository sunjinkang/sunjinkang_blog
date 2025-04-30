import { Command } from 'commander';
import path from 'path';
import { z } from 'zod';
import {
  moduleIndexName,
  printSuccessMessage,
  isFolderExist,
  isFileExist,
  createDirectory,
  createFile,
  insertContentIntoFile
} from './common';
import { moduleIndexTemplate } from './template';
import { CreateModeEnum } from './index.type';

const initOptionSchema = z.object({
  mode: z.enum([CreateModeEnum.createContent, CreateModeEnum.createModule]),
  moduleName: z.string().optional(),
  title: z.string().optional(),
  contentName: z.string().optional(),
  contentTitle: z.string().optional(),
  path: z.string()
});

type Options = z.infer<typeof initOptionSchema>;

const scriptInfo = {
  name: 'generate-blog',
  description: '用于自动化生成博客页面',
  version: '0.0.1'
};

const program = new Command();

program
  .name(scriptInfo.name)
  .description(scriptInfo.description)
  .version(scriptInfo.version);

program
  .option(
    '-m, --mode <mode>',
    '模式，包含两种模式，createModule新建模块，createContent新建内容，默认值为createModule',
    'createModule'
  )
  // 以下为createModule新建模块的参数
  .option('-mn, --moduleName <name>', '新生成的模块名称', 'New-Module')
  .option('-t, --title <title>', '新模块首页的标题', 'New-Module-Title')
  // 以下为createContent新建内容的参数
  .option(
    '-cn, --contentName <cname>',
    '新生成的模块中文件的名称',
    '1-new-content'
  )
  .option(
    '-ct, --contentTitle <ctitle>',
    '新生成的模块中文件内容中的页面标题',
    '1-new-content'
  )
  // 以下为公共参数
  .option(
    '-p, --path <path>',
    '新建的路径，默认位置为source文件夹内，用于新建模块',
    'source'
  )
  .action((options) => {
    generateNewModule(options);
  });

// 生成新模块的文件夹及首页文件
const generateNewModule = (opt: Options) => {
  const targetPath = path.join(
    __dirname,
    `${opt?.path ?? 'source'}/${opt.moduleName}`
  );
  // 检查目标模块是否存在，存在时报错，不存在时新建
  if (!isFolderExist(targetPath)) {
    createDirectory(targetPath).then(async (res) => {
      printSuccessMessage(`新建 ${opt.moduleName} 模块文件夹`);
      await createFile(moduleIndexName, moduleIndexTemplate(opt?.title ?? ''));
      addNewModuleLink(opt);
    });
  }
};

// 将新模块的地址添加到source的首页文件中，避免模块入口丢失
const addNewModuleLink = (opt: Options) => {
  const targetPath = path.join(__dirname, `${opt?.path ?? 'source'}/index.md`);
  if (isFileExist(targetPath)) {
    insertContentIntoFile(targetPath, `* [${opt.title}](/${opt.moduleName}/)`);
  }
};
