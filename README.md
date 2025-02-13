# ETC CSV to Moze Converter

一个简单的工具，用于将日本 ETC 利用明细的 CSV 文件转换为 Moze 记账软件可导入的格式。

## 功能特点

- 将 ETC 通行记录转换为 Moze 可导入的 CSV 格式
- 自动提取起始站点和终点站点作为描述
- 支持 ETC 折扣金额的转换
- 提供 CSV 和 Markdown 格式的预览
- 支持深色模式
- 支持文件下载和内容复制

## 数据转换规则

- 账户：默认设置为"现金"
- 币种：日元(JPY)
- 收支类型：支出
- 分类：交通-过路费
- 商家：日本道路
- 标签：ETC

## 使用方法

1. 从 [ETC利用照会サービス](https://www.etc-meisai.jp/) 下载 CSV 文件
2. 访问本工具网页
3. 上传 CSV 文件
4. 预览转换结果
5. 选择以下操作之一：
   - 复制 CSV 格式数据
   - 复制 Markdown 格式数据
   - 下载转换后的 CSV 文件

## 开发相关

本项目使用 [Next.js](https://nextjs.org) 开发，使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 创建。

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS

## License

MIT
