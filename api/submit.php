<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//连接数据库
$servername='localhost';
$username='root';
$password='';
$dbname='led';
$conn=new mysqli($servername,$username,$password,$dbname);

if ($conn->connect_error){
    die(json_encode(["error"=>"数据库连接失败".$conn->connect_error]));
}
$input=json_decode(file_get_contents('php://input'),true);

if(!$input){
    echo json_encode(['error'=>'未接收到数据']);
    exit;
}

//SQL
$sql="INSERT INTO led_user(
    client_name, company, email, country, 
    environment, preference, screen_width, screen_height, pixel_pitch,
    product_model, cabinet_size, total_cabinets, total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt=$conn->prepare($sql);

if(!$stmt){
    echo json_encode(['error'=>'SQL准备失败:'.$conn->error]);
    exit;
}

//绑定参数
$stmt->bind_param(
    "ssssssdddssid", 
    $input['client_name'], 
    $input['company'], 
    $input['email'], 
    $input['country'],
    $input['environment'], 
    $input['preference'], 
    $input['screen_width'], 
    $input['screen_height'], 
    $input['pixel_pitch'],
    $input['product_model'], 
    $input['cabinet_size'], 
    $input['total_cabinets'], 
    $input['total_price']
);

if($stmt->execute()){
    echo json_encode(['success'=>true,'message'=>'报价单已上报！' .$stmt->insert_id]); 
}else{
    echo json_encode(['error'=>'写入失败:'.$stmt->error]);
}

$stmt->close();
$conn->close();


