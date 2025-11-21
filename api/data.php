<?php
header("Content-Type: application/json; charset=UTF-8");

// 箱体尺寸
$cabinet_space = [  
    'indoor_fixed_std' => ['w' => 0.64, 'h' => 0.48],
    'indoor_fixed_cob' => ['w' => 0.60, 'h' => 0.3375], 
    'rental_std'       => ['w' => 0.50, 'h' => 1.00],
    'outdoor_fixed'    => ['w' => 0.96, 'h' => 0.96]
]; 

$products = [
    'indoor_fixed' => [
        'budget' => [
            ['model' => 'TW11-3216-P1.2', 'pitch' => 1.25,  'USD/sqm' => 864.29, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-3216-P1.5', 'pitch' => 1.53,  'USD/sqm' => 557.86, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-3216-P1.8', 'pitch' => 1.86,  'USD/sqm' => 392.86, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-3216-P2.0', 'pitch' => 2.0,   'USD/sqm' => 361.43, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-3216-P2.5', 'pitch' => 2.5,   'USD/sqm' => 284.74, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-3216-P3.0', 'pitch' => 3.076, 'USD/sqm' => 253.00, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-3216-P4.0', 'pitch' => 4.0,   'USD/sqm' => 215.86, 'remark' => 0, 'series' => 'TW11'],
        ],
        'value' => [
            ['model' => 'TW21-3216-P1.2', 'pitch' => 1.25,  'USD/sqm' => 1363.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P1.5', 'pitch' => 1.53,  'USD/sqm' => 970.00,  'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P1.6', 'pitch' => 1.667, 'USD/sqm' => 925.00,  'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P1.8', 'pitch' => 1.86,  'USD/sqm' => 756.00,  'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P2.0', 'pitch' => 2.0,   'USD/sqm' => 668.00,  'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P2.5', 'pitch' => 2.5,   'USD/sqm' => 548.00,  'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P3.0', 'pitch' => 3.076, 'USD/sqm' => 480.00,  'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-3216-P4.0', 'pitch' => 4.0,   'USD/sqm' => 385.00,  'remark' => 0, 'series' => 'TW21'],
        ],
        'performance' => [
            ['model' => 'TW31-COB-P0.7H', 'pitch' => 0.78,   'USD/sqm' => 6850.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-COB-P0.9H', 'pitch' => 0.9375, 'USD/sqm' => 3750.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-COB-P1.2H', 'pitch' => 1.25,   'USD/sqm' => 1900.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-COB-P1.5H', 'pitch' => 1.5625, 'USD/sqm' => 1750.00, 'remark' => 0, 'series' => 'TW31'],
        ]
    ],
    'indoor_rental' => [
        'budget' => [
            ['model' => 'TW11-IR-P1.95(GOB)', 'pitch' => 1.95, 'USD/sqm' => 728.00, 'remark' => -70, 'series' => 'TW11'],
            ['model' => 'TW11-IR-P2.6', 'pitch' => 2.6,  'USD/sqm' => 531.00, 'remark' => -70, 'series' => 'TW11'],
            ['model' => 'TW11-IR-P2.9', 'pitch' => 2.976,'USD/sqm' => 518.00, 'remark' => -60, 'series' => 'TW11'],
            ['model' => 'TW11-IR-P3.9', 'pitch' => 3.91, 'USD/sqm' => 438.00, 'remark' => -60, 'series' => 'TW11'],
            ['model' => 'TW11-IR-P4.8', 'pitch' => 4.81, 'USD/sqm' => 422.00, 'remark' => -60, 'series' => 'TW11'],
        ],
        'value' => [
            ['model' => 'TW21-IRHD-P2.6H', 'pitch' => 2.6,   'USD/sqm' => 663.00, 'remark' => -75, 'series' => 'TW21'],
            ['model' => 'TW21-IRHD-P2.9H', 'pitch' => 2.976, 'USD/sqm' => 613.00, 'remark' => -75, 'series' => 'TW21'],
            ['model' => 'TW21-IRHD-P3.9H', 'pitch' => 3.91,  'USD/sqm' => 536.00, 'remark' => -75, 'series' => 'TW21'],
        ],
        'performance' => [
            ['model' => 'TW31-IRHD-P2.6', 'pitch' => 2.6,   'USD/sqm' => 828.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-IRHD-P2.9', 'pitch' => 2.976, 'USD/sqm' => 777.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-IRHD-P3.9', 'pitch' => 3.91,  'USD/sqm' => 707.00, 'remark' => 0, 'series' => 'TW31'],
        ]
    ],
    'outdoor_fixed' => [
        'budget' => [
            ['model' => 'TW11-OD-P2.5', 'pitch' => 2.5,   'USD/sqm' => 552.96, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-OD-P3',   'pitch' => 3.076, 'USD/sqm' => 488.00, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-OD-P4',   'pitch' => 4.0,   'USD/sqm' => 372.80, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-OD-P5',   'pitch' => 5.0,   'USD/sqm' => 328.00, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-OD-P6',   'pitch' => 6.67,  'USD/sqm' => 372.80, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-OD-P8',   'pitch' => 8.0,   'USD/sqm' => 335.00, 'remark' => 0, 'series' => 'TW11'],
            ['model' => 'TW11-OD-P10',  'pitch' => 10.0,  'USD/sqm' => 296.00, 'remark' => 0, 'series' => 'TW11'],
        ],
        'value' => [
            ['model' => 'TW21-OD-P2.5', 'pitch' => 2.5,   'USD/sqm' => 784.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-OD-P3',   'pitch' => 3.076, 'USD/sqm' => 577.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-OD-P4',   'pitch' => 4.0,   'USD/sqm' => 444.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-OD-P5',   'pitch' => 5.0,   'USD/sqm' => 372.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-OD-P6',   'pitch' => 6.67,  'USD/sqm' => 395.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-OD-P8',   'pitch' => 8.0,   'USD/sqm' => 345.00, 'remark' => 0, 'series' => 'TW21'],
            ['model' => 'TW21-OD-P10',  'pitch' => 10.0,  'USD/sqm' => 328.00, 'remark' => 0, 'series' => 'TW21'],
        ],
        'performance' => [
            ['model' => 'TW31-HOD-P5.7E',  'pitch' => 5.7,  'USD/sqm' => 696.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-HOD-P6.67E', 'pitch' => 6.67, 'USD/sqm' => 856.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-HOD-P8E',    'pitch' => 8.0,  'USD/sqm' => 758.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-HOD-P10E',   'pitch' => 10.0, 'USD/sqm' => 658.00, 'remark' => 0, 'series' => 'TW31'],
        ]
    ],
    'outdoor_rental' => [
        'budget' => [
            ['model' => 'TW11-OR-P2.9', 'pitch' => 2.976, 'USD/sqm' => 601.00, 'remark' => -58, 'series' => 'TW11'],
            ['model' => 'TW11-OR-P3.9', 'pitch' => 3.91,  'USD/sqm' => 465.00, 'remark' => -58, 'series' => 'TW11'],
            ['model' => 'TW11-OR-P4.8', 'pitch' => 4.81,  'USD/sqm' => 437.00, 'remark' => -58, 'series' => 'TW11'],
        ],
        'value' => [
            ['model' => 'TW21-ORHD-P2.9H', 'pitch' => 2.976, 'USD/sqm' => 726.00, 'remark' => -70, 'series' => 'TW21'],
            ['model' => 'TW21-ORHD-P3.9H', 'pitch' => 3.91,  'USD/sqm' => 583.00, 'remark' => -70, 'series' => 'TW21'],
        ],
        'performance' => [
            ['model' => 'TW31-ORHD-P2.9', 'pitch' => 2.976, 'USD/sqm' => 915.00, 'remark' => 0, 'series' => 'TW31'],
            ['model' => 'TW31-ORHD-P3.9', 'pitch' => 3.91,  'USD/sqm' => 769.00, 'remark' => 0, 'series' => 'TW31'],
        ]
    ]
]; 
?>