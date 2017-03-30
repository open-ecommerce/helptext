<?php

//to do some work y desde aca tambien

use yii\jui\DatePicker;
use yii\helpers\Html;
//use yii\grid\GridView;
use kartik\grid\GridView;
use yii\helpers\Url;
use app\models\Languages;
use yii\helpers\ArrayHelper;


$clientLabel = strtolower(\Yii::$app->settings->get('helptext.contact_label'));


/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = "List of " . $clientLabel . "s and Cases";

$deleteTip = Yii::t('app', 'Delete this ' . $clientLabel .' with all the cases, phone numbers and messages.');
$deleteMsg = Yii::t('app', 'Are you sure you want to delete this '.$clientLabel.' with all the cases, phone numbers and messages?');


$this->params['breadcrumbs'][] = $this->title;
?>
  <div class="col-md-10 col-md-offset-1">
<div class="customers-index">

<?php // echo $this->render('_search', ['model' => $searchModel]);  ?>
    <?php


    $gridColumns = [
        [
            'attribute' => 'id',
            'width' => '100px',
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
            'attribute' => 'fullName',
            'vAlign' => 'middle',
            'format' => 'html',
        ],
        [
            'attribute' => 'lastPhone',
            'vAlign' => 'middle',
            'format' => 'html',
        ],
        [
            'attribute' => 'gender',
            'width' => '10px',
            'hAlign' => 'center',
        ],
        [
                    'attribute' => 'comments',
                ],
                [
                    'class' => 'kartik\grid\ActionColumn',
                    'header' => 'View Detail',
                    'template' => '{view}',
                    'viewOptions' => ['label' => '<i class="glyphicon glyphicon-eye-open"></i>'],
                ],
                    
                [
                    'class' => 'kartik\grid\ActionColumn',
                    'header' => 'Update '.$clientLabel,
                    'template' => '{update}',
                    'viewOptions' => ['label' => '<i class="glyphicon glyphicon-pencil"></i>'],
                ],
                [
                    'class' => 'kartik\grid\ActionColumn',
                    'visible' => (Yii::$app->user->can("administrator")),                    
                    'header' => 'Delete '.$clientLabel,
                    'template' => '{delete}',
                    
    'deleteOptions'=>['role'=>'modal-remote',
                      'title'=>'Delete current user', 
                      'data-confirm'=>false, 'data-method'=>false,// for overide yii data api
                      'data-toggle'=>'tooltip',
                      'message' => $deleteMsg],                     
                ],
            ];
            ?>


            <?=
            GridView::widget([
                'id' => 'grid-contacts',                
                'dataProvider' => $dataProvider,
                'filterModel' => $searchModel,
                'resizableColumns' => true,
                'showPageSummary' => false,
                'headerRowOptions' => ['class' => 'kartik-sheet-style'],
                'filterRowOptions' => ['class' => 'kartik-sheet-style'],
                'responsive' => true,
                'pjax' => true, 
                'pjaxSettings' => [
                    'neverTimeout' => true,
                ],
                'hover' => true,
                'panel' => [
                    'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-user"></i> ' . $this->title . '</h3>',
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
                        Html::a('<i class="glyphicon glyphicon-plus"></i>  Create new ' . $clientLabel, ['create'], ['class' => 'btn btn-success']),
                    ],
                    '{export}',
                ],
            ]);
            ?>

</div>
</div>
