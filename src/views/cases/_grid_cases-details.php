<?php

use yii\helpers\Html;
use kartik\grid\GridView;


/* @var $this yii\web\View */
/* @var $searchModel app\models\CasesSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */


$deleteTip = "Delete this Case records.";
$deleteMsg = "Are you sure you want to delete this client case details?";

?>


<div class="contacts-cases-list">
    <?php
    $gridColumns = [ 
        [
            'attribute' => 'start_date',
            'format' => ['date', 'php:d M Y'],
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '30px',            
        ],
        [
            'attribute' => 'close_date',
            'format' => ['date', 'php:d M Y'],
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '30px',            
        ],
        [
            'attribute' => 'comments',
            'vAlign' => 'middle',
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Delete',
            'template' => '{delete}',
            'deleteOptions' => ['label' => '<i class="glyphicon glyphicon-trash"></i>'],
            'deleteOptions' => ['title' => $deleteTip, 'data-toggle' => 'tooltip', 'data-confirm' => $deleteMsg],
        ],        
        
        
//        [
//            'class' => 'kartik\grid\ActionColumn',
//        ],
    ];
    ?>

    <?=
    GridView::widget([
        'dataProvider' => $dataProvider,
        'responsive' => true,
        'resizableColumns' => false,
        'headerRowOptions' => ['class' => 'kartik-sheet-style'],
        'pjax' => true, // pjax is set to always true for this demo
        'hover' => true,
        'toolbar' => false,
//        'panel' => [
//            'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-book"></i> Previous visits</h3>',
//            'type' => 'info',
//            'footer' => false,
//        ],
        'panel' => false,
        'columns' => $gridColumns,
    ]);
    ?>


</div>
