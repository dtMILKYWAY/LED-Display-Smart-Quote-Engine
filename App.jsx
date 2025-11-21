import { useState, useEffect } from 'react'

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const [showSpecs, setShowSpecs] = useState(false);

  // 定义不同环境下可用的点间距 
  const pitchOptions = {
    '室内': [0.78, 0.9375, 1.25, 1.53, 1.5625, 1.86, 2.0, 2.5, 3.076, 4.0],
    '室内租赁': [1.95, 2.6, 2.976, 3.91, 4.81], 
    '户外': [2.5, 3.076, 4.0, 5.0, 6.67, 8.0, 10.0],
    '户外租赁': [2.976, 3.91, 4.81]
  };

  const [formData, setFormData] = useState({
    environment: '室内',
    pitch: 2.5,        
    preference: '性价比', 
    width: '',  
    height: ''  
  });
  
  const [result, setResult] = useState(null);

  // 当环境改变时，自动重置 pitch 为该环境下的第一个选项，防止出现不匹配
  useEffect(() => {
    const availablePitches = pitchOptions[formData.environment] || [];
    setFormData(prev => ({
      ...prev,
      pitch: availablePitches[0] // 默认选中第一个
    }));
  }, [formData.environment]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCalculate = async () => {
      if (!formData.width || formData.width <= 0 || !formData.height || formData.height <= 0) {
      alert("请输入有效的屏幕尺寸！\n(宽和高必须大于 0)");
      return; 
    }
    setLoading(true);
    try {
      const api = 'http://localhost/LED_Quote/api/api.php';
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.error) {
        alert('服务器报错: ' + data.error);
      } else {
        setResult(data);
        setStep(2);
      }
    } catch (error) {
      console.error("Calculation error:", error);
      alert("连接服务器失败！请检查 XAMPP Apache 是否开启。")
    }
    setLoading(false);
  };

  const submitContact = async (e) => {
    e.preventDefault();
    const contactData = new FormData(e.target);
    const clientInfo = Object.fromEntries(contactData.entries());

    //组装完整数据包
    const fullPayload={
      client_name:clientInfo.name,
      company: clientInfo.company,
      email: clientInfo.email,
      country: clientInfo.country,
    
      environment: formData.environment,
      preference: formData.preference,
      screen_width: formData.width,
      screen_height: formData.height,
      pixel_pitch: formData.pitch,
      
      product_model: result.product.model,
      cabinet_size:`${result.specs.cabinet_w} x ${result.specs.cabinet_h}`,
      total_cabinets: result.calculation.total_cabinets,
      total_price: result.calculation.total_price
    };
    console.log('正在提交完整数据...',fullPayload);

    try{
      //发送给submit.php
      const response = await fetch('http://localhost/LED_Quote/api/submit.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(fullPayload)
      });
      const data= await response.json();

      if(data.success){
        alert(`提交成功!\n感谢 ${clientInfo.name},我们会尽快联系您。\n`);
        setContactModal(false);
      }else{
        alert('保存失败:'+(data.error||'未知错误'));
      }
    }catch(error){
      console.error("Submit Error:",error);
      alert("网络错误,无法连接数据库接口！");
    }
  }

  // 获取当前环境下的可选间距列表
  const currentPitches = pitchOptions[formData.environment] || [];

  return (
      <div className='min-h-screen bg-gray-100 py-10 px-4 font-sans'>
        <div className='max-w-4xl mx-auto'>
          <header className='mb-8 text-center relative'>
            <h1 className='text-4xl font-extrabold text-blue-900 tracking-tight'>LED Quote Engine</h1>
            <p className='text-gray-500 mt-2'>智能显示屏报价计算系统</p>
            <button 
            onClick={() => setShowSpecs(true)}
            className="absolute top-0 right-0 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm bg-white px-3 py-1 rounded-full shadow hover:shadow-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            规格说明书
            </button>
          </header>

          {step === 1 && (
            <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
              <h2 className='text-xl font-bold text-gray-800 mb-6 pb-2 border-b'>1. 定制您的屏幕参数</h2>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* 环境选择 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">使用环境 (Environment)</label>
                  <select name='environment' value={formData.environment} onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition'>
                    <option value="室内">室内 (Indoor Fixed)</option>
                    <option value="室内租赁">室内租赁 (Indoor Rental)</option>
                    <option value="户外">户外 (Outdoor Fixed)</option>
                    <option value="户外租赁">户外租赁 (Outdoor Rental)</option>
                  </select>
                </div>

                {/* 选择型号间距 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">点间距 (Pixel Pitch)</label>
                  <select name="pitch" value={formData.pitch} onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition">
                    {currentPitches.map((p) => (
                      <option key={p} value={p}>
                        P{p} {p === 2.976 ? '(2.9)' : ''} 
                      </option>
                    ))}
                  </select>
                </div>

                {/* 偏好选择 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">产品系列 (Series)</label>
                  <select name="preference" value={formData.preference} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="低价">预算优先 (Budget / TW11)</option>
                    <option value="性价比">性价比 (Value / TW21)</option>
                    <option value="高性能">高性能 (Performance / TW31)</option>
                  </select>
                </div>

                {/* 尺寸输入 */}
                <div className='flex gap-4'>
                  <div className='w-1/2'>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">宽 (m) 
                      <span className="text-xs text-gray-400 font-normal">*必填</span>
                    </label>
                    <input type="number" name='width' value={formData.width} onChange={handleChange}
                    step='0.1' min='0.1' placeholder='例如:3' className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500' />
                  </div>
                  <div className='w-1/2'>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">高 (m)
                      <span className="text-xs text-gray-400 font-normal">*必填</span>
                    </label>
                    <input type="number" name='height' value={formData.height} onChange={handleChange}
                    step='0.1' min='0.1' placeholder='例如:2' className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500' />
                  </div>
                </div>
              </div>

              <button onClick={handleCalculate} disabled={loading}
                className={`mt-8 w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {loading ? '正在计算...' : '立刻获取报价'}
              </button>
            </div>
          )}

          {step === 2 && result && (
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">报价预估</h2>
                <button onClick={() => setStep(1)} className="text-blue-600 font-medium hover:underline">← 修改参数</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">产品方案</h3>
                  <div className="space-y-2 text-sm text-blue-900">
                    <p><span className="font-semibold opacity-70">系列:</span> {result.product.series}</p>
                    <p><span className="font-semibold opacity-70">型号:</span> {result.product.model}</p>
                    <p><span className="font-semibold opacity-70">间距:</span> P{result.product.pitch}</p>
                    <p><span className="font-semibold opacity-70">单箱单价:</span> ${result.calculation.unit_price}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">屏幕配置</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">箱体尺寸:</span> {result.specs.cabinet_w}m x {result.specs.cabinet_h}m</p>
                    <p><span className="font-semibold">排列:</span> {result.calculation.cols} (宽) x {result.calculation.rows} (高)</p>
                    <p className="mt-2 pt-2 border-t border-gray-200">
                      <span className="font-semibold">总数:</span> 
                      <span className="text-2xl font-bold text-blue-600 ml-2">{result.calculation.total_cabinets}</span> 箱子数量
                    </p>
                    <p className="text-xs text-gray-500 mt-1">实际尺寸: {result.specs.total_w.toFixed(2)}m x {result.specs.total_h.toFixed(2)}m</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 text-white rounded-xl p-8 text-center shadow-2xl">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Price (FOB)</p>
                <p className="text-5xl font-extrabold text-yellow-400 mb-6 font-mono">${result.calculation.total_price.toLocaleString()}</p>
                <button onClick={() => setContactModal(true)} className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition transform shadow-lg">获取正式报价单</button>
              </div>
            </div>
          )}

          {contactModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">联系我们</h3>
                <form onSubmit={submitContact} className='space-y-4'>
                  <input required name="name" placeholder="姓名" className="w-full p-3 border rounded-lg outline-none" />
                  <input required name="company" placeholder="公司" className="w-full p-3 border rounded-lg outline-none" />
                  <input required name="email" placeholder="邮箱" className="w-full p-3 border rounded-lg outline-none" />
                  <input required name="country" placeholder="国家" className="w-full p-3 border rounded-lg outline-none" />
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setContactModal(false)} className="px-5 py-2 text-gray-500">取消</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg">提交</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 规格说明书*/}
        {showSpecs && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                  📖 产品规格说明书 <span className="text-sm text-gray-500 font-normal"></span>
                </h2>
                <button onClick={() => setShowSpecs(false)} className="text-gray-400 hover:text-gray-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">1. 默认箱体尺寸 (Cabinet Size)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 border rounded-lg">
                      <thead className="bg-gray-100 text-gray-800 font-semibold uppercase">
                        <tr>
                          <th className="px-4 py-3">应用场景</th>
                          <th className="px-4 py-3">默认尺寸 (宽 x 高)</th>
                          <th className="px-4 py-3">备注</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3">室内固定 (Indoor Fixed)</td>
                          <td className="px-4 py-3 font-mono text-blue-600">640mm x 480mm</td>
                          <td className="px-4 py-3">常规标准尺寸</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">室内/户外租赁 (Rental)</td>
                          <td className="px-4 py-3 font-mono text-blue-600">500mm x 1000mm</td>
                          <td className="px-4 py-3">计算公式中按 0.5m x 1.0m 计算</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">户外固定 (Outdoor Fixed)</td>
                          <td className="px-4 py-3 font-mono text-blue-600">960mm x 960mm</td>
                          <td className="px-4 py-3">标准铁箱/铝箱</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">2. 报价计算公式 (Pricing Formula)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                    <p className="font-mono text-sm text-gray-700">
                      <span className="font-bold">常规公式：</span> 
                      箱体单价 = (USD/sqm + 备注调整) × 箱体宽 × 箱体高
                    </p>
                    <p className="font-mono text-sm text-gray-700">
                      <span className="font-bold">总价公式：</span> 
                      总价格 = 箱体总数 × 箱体单价
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      注：箱体数量计算采用“向下取整”逻辑 (Floor)，即屏幕尺寸必须完整容纳箱体。
                    </p>
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-purple-500 pl-3">3. 产品系列说明 (Series)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="font-bold text-blue-800 mb-1">TW11 (预算优先)</div>
                      <p className="text-xs text-blue-600">代表低价方案，适合对价格敏感的项目。</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="font-bold text-yellow-800 mb-1">TW21 (性价比)</div>
                      <p className="text-xs text-yellow-600">性能与价格的平衡点，大多数项目的推荐选择。</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="font-bold text-purple-800 mb-1">TW31 (高性能)</div>
                      <p className="text-xs text-purple-600">代表高性能表现 (如 COB, 高亮)，适合高端项目。</p>
                    </div>
                  </div>
                </section>

              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setShowSpecs(false)} 
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  我已了解 (Close)
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
  )
}

export default App