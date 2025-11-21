<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods:POST");
header("Access-Control-Allow-Headers:Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With");

require 'data.php';

$raw_input = file_get_contents("php://input");
$input = json_decode($raw_input, true);

if (!$input) {
    echo json_encode(["error" => "无效的输入数据"]);
    exit;
}

$env = $input['environment'];
$preference = $input['preference'];
$width = floatval($input['width']);
$height = floatval($input['height']);

// 如果前端没传 pitch，默认给 2.5，防止报错
$targetPitch = isset($input['pitch']) ? floatval($input['pitch']) : 2.5;

// 映射 Key
$envKeyMap = [
    '室内' => 'indoor_fixed',
    '室内租赁' => 'indoor_rental',
    '户外' => 'outdoor_fixed',
    '户外租赁' => 'outdoor_rental'
];
$dbEnvkey = $envKeyMap[$env] ?? 'indoor_fixed';

$prefMap = [
    '性价比' => 'value',
    '低价' => 'budget',
    '高性能' => 'performance'
];
$dbPreKey = $prefMap[$preference] ?? 'value';

// 查找产品
$availableModels = $products[$dbEnvkey][$dbPreKey] ?? [];
$selectedProduct = null;

foreach ($availableModels as $prod) {
    if (abs($prod['pitch'] - $targetPitch) < 0.01) {
        $selectedProduct = $prod;
        break;
    }
}

// 没找到就选第一个
if (!$selectedProduct) {
    $selectedProduct = $availableModels[0] ?? null;
}

if (!$selectedProduct) {
    echo json_encode(["error" => "未找到匹配产品"]);
    exit;
}

// 3. 确定箱体尺寸
$cabSpace = [];
if ($dbEnvkey == 'indoor_rental' || $dbEnvkey == 'outdoor_rental') {
    $cabSpace = $cabinet_space['rental_std'];
} elseif ($dbEnvkey == 'indoor_fixed') {
    if ($selectedProduct['series'] == 'TW31' && strpos($selectedProduct['model'], 'COB') !== false) {
        // 没定义则兜底
        $cabSpace = $cabinet_space['indoor_fixed_cob'] ?? ['w'=>0.64, 'h'=>0.48]; 
    } else {
        $cabSpace = $cabinet_space['indoor_fixed_std'];
    }
} else {
    $cabSpace = $cabinet_space['outdoor_fixed'];
}

// 4. 数量计算
$cabCounth = floor($width / $cabSpace['w']);
$cabCountv = floor($height / $cabSpace['h']);

if ($cabCounth < 1) $cabCounth = 1;
if ($cabCountv < 1) $cabCountv = 1;

$totalCabinets = $cabCounth * $cabCountv;

// 5. 价格计算
$basePrice = $selectedProduct['USD/sqm'];
$remarkPrice = $selectedProduct['remark'];

$unitPrice = ($basePrice + $remarkPrice) * $cabSpace['w'] * $cabSpace['h'];
$totalPrice = $totalCabinets * $unitPrice;

//返回值
$response = [
    'success' => true,
    'product' => $selectedProduct,
    'specs' => [
        'cabinet_w' => $cabSpace['w'],
        'cabinet_h' => $cabSpace['h'],
        'total_w'   => $cabCounth * $cabSpace['w'], 
        'total_h'   => $cabCountv * $cabSpace['h'], 
    ],
    'calculation' => [
        'cols' => $cabCounth,
        'rows' => $cabCountv,
        'total_cabinets' => $totalCabinets,
        'unit_price' => round($unitPrice, 2),
        'total_price' => round($totalPrice, 2)
    ]
];

echo json_encode($response);
?>