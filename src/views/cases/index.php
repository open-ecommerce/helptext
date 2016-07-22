<?php

//to do some work y desde aca tambien

use yii\jui\DatePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use dektrium\user\models\Profile;
use dektrium\user\models\User;
use app\models\Severity;
use yii\helpers\ArrayHelper;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = date('l jS \of F Y');

$deleteTip = "Delete this client detail and all the attendances records.";
$deleteMsg = "Are you sure you want to delete this client detail and all the attendances records?";

$this->params['breadcrumbs'][] = $this->title;
?>
<div class="customers-index col-md-12">
<?php //echo $this->render('_search', ['model' => $searchModel]);  ?>
    <?php



    $gridColumns = [
        [
            'attribute' => 'id',
            'label' => 'Case #',
            'width' => '10px',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'id_contact',
            'value' => function($model) { return $model->contact->first_name . " " . $model->contact->last_name ; },
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'id_user',
            'value' => function($model) { return $model->profile->firstname . " " . $model->profile->lastname ; },
            'width' => '50px',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'category.case_category',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'attribute' => 'severity.severity',
        ],
        [
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'attribute' => 'outcome.outcome',
            'hAlign' => 'center',
        ],
        [
            'attribute' => 'start_date',
            'value' => 'start_date',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '10px',
            'format' => ['date', 'php:d M Y'],
            'filter' => false,
        ],
        [
            'attribute' => 'State',
            'class' => 'kartik\grid\BooleanColumn',
            'vAlign' => 'middle',
            'value' => 'state',
        ],
        [
            'attribute' => 'close_date',
            'value' => 'close_date',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '10px',
            'format' => ['date', 'php:d M Y'],
            'filter' => false,
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{view_conversation}',
            'header' => 'Edit',
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
                    'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-user"></i> List of cases - ' . $this->title . '</h3>',
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
                        Html::a('<i class="glyphicon glyphicon-plus"></i>  Create New Case', ['create'], ['class' => 'btn btn-success']),
                    ],
                    '{export}',
                ],
            ]);
            ?>

</div>
