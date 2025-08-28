// 這是一個極簡的測試檔案，用來確認 Vercel 部署是否正常

module.exports = (req, res) => {
  // 設置回應頭，告訴瀏覽器這是一個文字回應
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  
  // 發送一個固定的成功訊息
  const message = "後端連接成功！如果你看到這句話，說明 Vercel 部署正常。";
  
  // 結束並發送回應
  res.end(message);
};
