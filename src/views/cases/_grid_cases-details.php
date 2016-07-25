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
            'template' => '{view_conversation}',
            'header' => 'View Messages',
            'buttons' => [
                'view_conversation' => function ($url, $model) {
                    return Html::a('<i class="glyphicon glyphicon-comment"></i>', $url, ['class' => 'btn btn-success'], [
                                'title' => Yii::t('app', 'Change today\'s lists'),
                    ]);
                }
                    ],
                    'urlCreator' => function ($action, $model, $key, $index) {
                if ($action === 'view_conversation') {
                    $url = Yii::$app->urlManager->createUrl(array('message/viewsms', ['id' => $key]));
                    return $url;
                }
            }
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Delete Case',
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
