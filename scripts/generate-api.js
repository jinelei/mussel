// scripts/generate-api.js（ES 模块版本，适配所有版本）
import * as openapiCodegen from 'openapi-typescript-codegen';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 模拟 __dirname（ES 模块必备）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 核心：兼容不同版本的 generate 函数获取方式
let generate;
// 版本 ≥ 0.20.0：generate 在 default 中，或直接暴露
if (typeof openapiCodegen.default === 'function') {
    generate = openapiCodegen.default;
} else if (typeof openapiCodegen.generate === 'function') {
    generate = openapiCodegen.generate;
} else {
    throw new Error('❌ 无法找到 generate 函数，请检查 openapi-typescript-codegen 版本（推荐 0.29.0+）');
}

/**
 * 从远程 URL 拉取 OpenAPI 文档并生成 Axios 请求代码
 */
async function generateApiFromUrl() {
    const config = {
        openApiUrl: 'http://localhost:8082/api-docs',
        outputDir: path.resolve(__dirname, '../src/api'),
        client: 'axios',
        apiName: 'api.ts'
    };

    try {
        // 1. 确保输出目录存在
        if (!fs.existsSync(config.outputDir)) {
            fs.mkdirSync(config.outputDir, { recursive: true });
            console.log(`📁 已创建输出目录：${config.outputDir}`);
        }

        // 2. 拉取远程文档
        console.log(`🔍 正在拉取远程 OpenAPI 文档：${config.openApiUrl}`);
        const response = await axios.get(config.openApiUrl, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept-Charset': 'UTF-8'
            },
            timeout: 30000,
            responseEncoding: 'utf8'
        });

        // 3. 校验文档版本
        const openApiDoc = response.data;
        if (!openApiDoc.openapi && !openApiDoc.swagger) {
            throw new Error('❌ 远程地址返回的不是 OpenAPI/Swagger 文档');
        }
        if (openApiDoc.swagger && openApiDoc.swagger === '2.0') {
            throw new Error('❌ 仅支持 OpenAPI 3.x，Swagger 2.0 需先转换');
        }

        // 4. 执行生成（核心：确保 generate 是函数）
        console.log(`🚀 开始生成 API 代码，输出目录：${config.outputDir}`);
        await generate({
            input: openApiDoc,
            output: config.outputDir,
            client: config.client,
            name: config.apiName,
            useOptions: true,
            exportSchemas: true,
            cleanOutput: true,
            indent: 2
        });

        console.log('✅ API 代码生成成功！');
    } catch (error) {
        console.error('\n❌ 代码生成失败：', error.message);
        if (error.response) {
            console.error(`  - 响应状态码：${error.response.status}`);
            console.error(`  - 响应内容：${JSON.stringify(error.response.data, null, 2)}`);
        }
        process.exit(1);
    }
}

// 执行生成
generateApiFromUrl();
