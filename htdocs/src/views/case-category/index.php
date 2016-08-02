<?php

use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use app\models\Severity;
use yii\helpers\ArrayHelper;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = "List of Cases Categories";

$deleteTip = Yii::t('app', 'Delete this category.');
$deleteMsg = Yii::t('app', 'Are you sure you want to delete this category?');
?>
  <div class="col-md-10 col-md-offset-1">
    <?php //echo $this->render('_search', ['model' => $searchModel]);   ?>
    <?php
    $gridColumns = [
        [
            'attribute' => 'id',
            'label' => 'Case #',
            'width' => '100px',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'case_category',
            'hAlign' => 'left',
            'vAlign' => 'middle',
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Update',
            'template' => '{update}',
            'viewOptions' => ['label' => '<i class="glyphicon glyphicon-pencil edit-today"></i>'],
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Delete',
            'template' => '{delete}',
            'deleteOptions' => ['label' => '<i class="glyphicon glyphicon-trash"></i>'],
            'deleteOptions' => ['title' => $deleteTip, 'data-toggle' => 'tooltip', 'data-confirm' => $deleteMsg],
        ],
    ];
    ?>


<?=
GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'resizableColumns' => false,
    'showPageSummary' => false,
    'headerRowOptions' => ['class' => 'kartik-sheet-style'],
    'filterRowOptions' => ['class' => 'kartik-sheet-style'],
    'responsive' => true,
    'pjax' => true, // pjax is set to always true for this demo
    'pjaxSettings' => [
        'neverTimeout' => true,
    ],
    'hover' => true,
    'panel' => [
        'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-tags"></i> '. $this->title .'</h3>',
        'type' => 'primary',
        'showFooter' => false
    ],
    'columns' => $gridColumns,
    // set export properties
    'export' => [
        'fontAwesome' => true
    ],
    // set your toolbar
    'toolbar' => [
        ['content' =>
            Html::a('<i class="glyphicon glyphicon-plus"></i>  Create New Case Category', ['create'], ['class' => 'btn btn-success']),
        ],
        '{export}',
    ],
]);
?>

</div>



