// scripts/generate-api.js（ES 模块版本，适配 "type": "module"）
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process'; // 用于执行 CLI 命令

// 模拟 __dirname（ES 模块必备）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 核心逻辑：
 * 1. 拉取远程 OpenAPI 文档 → 保存到 src/docs/openapi.json
 * 2. 调用 CLI 命令（你验证过的成功命令）生成 API 代码
 */
async function generateApiFromUrl() {
    // 配置项（根据你的项目修改）
    const config = {
        openApiUrl: 'http://127.0.0.1:8082/api-docs', // 远程文档地址
        docSavePath: path.resolve(__dirname, '../src/docs/openapi.json'), // 本地保存路径
        apiOutputDir: path.resolve(__dirname, '../src/api'), // API 代码输出目录
        // 你验证过的 CLI 命令模板（仅替换 input 参数为绝对路径）
        cliCommand: 'openapi --input {{INPUT_FILE}} --output {{OUTPUT_DIR}} --client axios'
    };

    try {
        // ========== 步骤 1：创建保存文档的目录（src/docs） ==========
        const docDir = path.dirname(config.docSavePath);
        if (!fs.existsSync(docDir)) {
            fs.mkdirSync(docDir, {recursive: true});
            console.log(`📁 已创建文档保存目录：${docDir}`);
        }

        // ========== 步骤 2：拉取远程 OpenAPI 文档 ==========
        console.log(`🔍 正在拉取远程 OpenAPI 文档：${config.openApiUrl}`);
        const response = await axios.get(config.openApiUrl, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept-Charset': 'UTF-8'
            },
            timeout: 30000,
            responseEncoding: 'utf8' // 强制响应编码为 UTF-8
        });
        const openApiDoc = response.data;

        // ========== 步骤 3：校验文档格式 ==========
        if (!openApiDoc.openapi && !openApiDoc.swagger) {
            throw new Error('❌ 远程地址返回的不是 OpenAPI/Swagger 文档');
        }

        // ========== 步骤 4：保存文档到本地 src/docs/openapi.json ==========
        const formattedDoc = JSON.stringify(openApiDoc, null, 2);
        fs.writeFileSync(config.docSavePath, formattedDoc, {encoding: 'utf8'});
        console.log(`✅ 远程文档已保存到本地：${config.docSavePath}`);

        // ========== 步骤 6：调用 CLI 命令生成 API 代码（核心：复用你验证过的命令） ==========
        // 替换命令模板中的占位符为绝对路径（避免相对路径问题）
        const finalCommand = config.cliCommand
            .replace('{{INPUT_FILE}}', config.docSavePath)
            .replace('{{OUTPUT_DIR}}', config.apiOutputDir);

        console.log(`🚀 执行 CLI 生成命令：${finalCommand}`);
        // 执行 CLI 命令（同步执行，输出日志到终端）
        execSync(finalCommand, {
            stdio: 'inherit', // 继承父进程的输入输出（显示 CLI 命令的日志）
            cwd: path.resolve(__dirname, '..') // 执行命令的工作目录（项目根目录）
        });

        console.log('\n🎉 完整流程执行成功！');
        console.log(`📄 本地文档路径：${config.docSavePath}`);
        console.log(`🔧 API 代码路径：${config.apiOutputDir}`);
    } catch (error) {
        console.error('\n❌ 流程执行失败：', error.message);
        if (error.response) {
            console.error(`  - 响应状态码：${error.response.status}`);
            console.error(`  - 响应内容：${JSON.stringify(error.response.data, null, 2)}`);
        }
        process.exit(1); // 终止进程，标记失败
    }
}

// 执行主流程
generateApiFromUrl();
