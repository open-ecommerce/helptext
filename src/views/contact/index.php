<?php

//to do some work y desde aca tambien

use yii\jui\DatePicker;
use yii\helpers\Html;
//use yii\grid\GridView;
use kartik\grid\GridView;
use yii\helpers\Url;
use app\models\Languages;
use yii\helpers\ArrayHelper;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = date('l jS \of F Y');

$deleteTip = "Delete this client detail and all the attendances records.";
$deleteMsg = "Are you sure you want to delete this client detail and all the attendances records?";

$this->params['breadcrumbs'][] = $this->title;
?>
<div class="col-md-12 text-index">
<div class="customers-index">

<?php // echo $this->render('_search', ['model' => $searchModel]);  ?>
    <?php


    $gridColumns = [
        [
            'attribute' => 'id',
            'label' => 'Client #',
            'width' => '10px',
            'hAlign' => 'center',
        ],
        [
            'class' => 'kartik\grid\ExpandRowColumn',
            'value' => function ($model, $key, $index, $column) {
                return GridView::ROW_COLLAPSED;
            },
            'detailUrl' => Url::to(['cases/detail']),
            'detailRowCssClass' => GridView::TYPE_DEFAULT,
            'pageSummary' => false,
            'allowBatchToggle' => FALSE,
            'expandOneOnly' => TRUE,
            'expandTitle' => 'View all client cases',
            'expandIcon' => '<span class="glyphicon glyphicon-plus"></span>',
            'collapseIcon' => '<span class="glyphicon glyphicon-minus"></span>',
        ],        
        [
            'attribute' => 'last_name',
            'vAlign' => 'middle',
            'label' => 'Surname',
            'format' => 'html',
        ],
        [
            'attribute' => 'first_name',
            'vAlign' => 'middle',
            'label' => 'First Name',
            'format' => 'html',
        ],
        [
            'attribute' => 'gender',
            'label' => 'Gender',
            'width' => '10px',
            'hAlign' => 'center',
        ],
        [
                    'attribute' => 'comments',
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
                'resizableColumns' => true,
                'showPageSummary' => false,
                'headerRowOptions' => ['class' => 'kartik-sheet-style'],
                'filterRowOptions' => ['class' => 'kartik-sheet-style'],
                'responsive' => true,
                'beforeHeader' => [
                    [
                        'columns' => [
                            ['content' => 'Clients\'s Details', 'options' => ['colspan' => 6, 'class' => 'text-center warning']],
                            ['content' => 'Editing Clients\'s', 'options' => ['colspan' => 2, 'class' => 'text-center warning']],
                        ],
                        'options' => ['class' => 'skip-export'] // remove this col-md-12 from export
                    ]
                ],
                'pjax' => true, 
                'pjaxSettings' => [
                    'neverTimeout' => true,
                ],
                'hover' => true,
                'panel' => [
                    'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-user"></i> List of clients - ' . $this->title . '</h3>',
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
                        Html::a('<i class="glyphicon glyphicon-plus"></i>  Create new Client', ['create'], ['class' => 'btn btn-success']),
                    ],
                    '{export}',
                ],
            ]);
            ?>

</div>
</div>
