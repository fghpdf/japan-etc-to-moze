'use client'

import { useState } from 'react'

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState<string>('')
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [account, setAccount] = useState<string>('三井住友金卡')

  const convertETCtoMoze = (csvContent: string) => {
    const lines = csvContent.split('\n')
    
    const convertedLines = lines.slice(1).map(line => {
      const columns = line.split(',')
      if (columns.length < 9) return null

      // 解析ETC数据
      const date = columns[0]?.trim() || ''        // 利用年月日（自）
      const time = columns[1]?.trim() || ''        // 時分（自）
      const fromIC = columns[4]?.trim() || ''      // 利用ＩＣ（自）
      const toIC = columns[5]?.trim() || ''        // 利用ＩＣ（至）
      const originalAmount = columns[6]?.trim() || '0'  // 割引前料金
      const discountAmount = columns[7]?.trim() || '0'  // ＥＴＣ割引額
      const finalAmount = columns[8]?.trim() || '0'     // 通行料金

      // 处理金额：将支出金额转为负数
      const amount = `-${Math.abs(parseInt(finalAmount))}`
      
      // 处理折扣金额：如果有折扣，使用其绝对值
      const discount = discountAmount !== '0' ? Math.abs(parseInt(discountAmount)).toString() : ''
      
      // 构建描述（限制在300字以内）
      const description = `${fromIC} → ${toIC}`.slice(0, 300)
      
      // 格式化日期为 YYYY/M/D
      const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')
      
      // 格式化时间为 HH:mm
      const formattedTime = time.replace(/(\d{2})(\d{2})/, '$1:$2')
      
      // 构建Moze格式的数据行
      return [
        account,        // 账户（必填）
        'JPY',           // 币种（必填）
        '支出',           // 收支类型（必填：收入/支出）
        '交通',           // 一级分类（必填）
        '过路费',         // 二级分类（必填）
        amount,          // 金额（必填，负数表示支出）
        '',             // 手续费（选填，不为正负数时填0）
        discount,       // 折扣（选填，不为正负数时填0）
        '',             // 名称（选填）
        '日本道路',       // 商家（选填，限制30字）
        formattedDate,  // 日期（必填，YYYY/M/D格式）
        formattedTime,  // 时间（选填，HH:mm格式）
        '',             // 项目（选填）
        description,    // 描述（选填，限制300字）
        '',             // 标签（选填）
        ''              // 对象（选填）
      ].join(',')
    }).filter(Boolean)
    
    const header = '帐户,币种,收支类型,一级分类,二级分类,金额,手续费,折扣,名称,商家,日期,时间,项目,描述,标签,对象'
    return header + '\n' + convertedLines.join('\n')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const reader = new FileReader()
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsText(file, 'Shift-JIS')
      })
      
      const converted = convertETCtoMoze(fileContent)
      setPreviewData(converted)
      
      // 保存转换后的数据为 Blob
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + converted], { type: 'text/csv;charset=utf-8' })
      setConvertedBlob(blob)
    } catch (error) {
      console.error('转换过程出错:', error)
      alert('转换过程出错，请检查文件格式是否正确')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!convertedBlob) return
    
    const url = URL.createObjectURL(convertedBlob)
    const link = document.createElement('a')
    const today = new Date().toISOString().slice(0,10)
    
    link.href = url
    link.download = `ETC_to_Moze_${today}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const convertToMarkdown = (csvContent: string) => {
    const lines = csvContent.split('\n')
    if (lines.length < 2) return ''

    const headers = lines[0].split(',')
    const rows = lines.slice(1)

    // 创建表头
    let markdown = '| ' + headers.join(' | ') + ' |\n'
    // 添加分隔行
    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n'
    // 添加数据行
    markdown += rows.map(row => '| ' + row.split(',').join(' | ') + ' |').join('\n')

    return markdown
  }

  const handleCopyCSV = async () => {
    if (!previewData) return
    try {
      await navigator.clipboard.writeText(previewData)
      alert('CSV 已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    }
  }

  const handleCopyMarkdown = async () => {
    if (!previewData) return
    try {
      const markdown = convertToMarkdown(previewData)
      await navigator.clipboard.writeText(markdown)
      alert('Markdown 已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        日本 ETC CSV 转 Moze 格式
      </h1>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">转换说明：</h3>
        <ul className="list-disc pl-6 space-y-2 dark:text-gray-300">
          <li>将 ETC 的通行记录转换为 Moze 可导入的格式</li>
          <li>自动提取起始站点和终点站点作为描述</li>
          <li>包含 ETC 折扣金额（如果有）</li>
          <li>默认使用日元(JPY)作为币种</li>
          <li>分类设置为：交通-过路费</li>
          <li>数据来源：<a href="https://www.etc-meisai.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">ETC利用照会サービス</a></li>
        </ul>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          账户名称
        </label>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="请输入账户名称"
        />
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">正在处理文件...</p>
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isProcessing}
          className={`w-full ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
        />
      </div>

      {previewData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">预览：</h3>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700 overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  {previewData.split('\n')[0].split(',').map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-semibold dark:text-white whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.split('\n').slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b dark:border-gray-700">
                    {row.split(',').map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm dark:text-gray-300 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleCopyCSV}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              复制 CSV
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              复制 Markdown
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              下载 CSV 文件
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        注：转换后的文件将包含当前日期
      </p>
    </main>
  )
}