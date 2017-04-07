<?php

//cases 

use yii\jui\DatePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use yii\models\Profile;
use dektrium\user\models\User;
use app\models\Severity;
use app\models\Contact;
use app\models\CaseCategory;
use app\models\OutcomeCategory;
use yii\helpers\ArrayHelper;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$clientLabel = \Yii::$app->settings->get('helptext.contact_label');


$this->title = " List of Cases";

$deleteTip = Yii::t('app', 'Delete this ' . $clientLabel . ' with all the cases, phone numbers and messages.');
$deleteMsg = Yii::t('app', 'Are you sure you want to delete this case with the related messages?');

$messagesCount = '<span class="fa-stack fa-lg"><i class="fa fa-star-o fa-stack-2x"></i><i class="fa fa-stack-1x">1</i></span>';
?>
<div class="col-md-12">
<?php //echo $this->render('_search', ['model' => $searchModel]);    ?>
    <?php
    $gridColumns = [
        [
            'attribute' => 'id',
            'width' => '70px',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{view_conversation}',
            'header' => 'View Chats',
            'buttons' => [
                'view_conversation' => function ($url, $model) {
                    $colorCount = ($model->answered ? 'answered' : 'not-answered');
                    $messagesCount = '<i class="glyphicon glyphicon-comment icon-size"></i><span class="badge messageBadge messageBadge-custom ' . $colorCount . '">' . $model->messagesCount . '</span>';
                    return Html::a($messagesCount, $url, ['class' => 'btn btn-success'], [
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
            'attribute' => 'id_phone',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'fullName',
            'value' => 'contact.fullName',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'visible' => (Yii::$app->user->can("administrator")),
        ],
        [
            'attribute' => 'userName',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'caseCategory',
            'value' => 'category.case_category',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(CaseCategory::find()->orderBy('case_category')->asArray()->all(), 'id', 'case_category'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Category'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'caseSeverity',
            'value' => 'severity.severity',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(Severity::find()->orderBy('severity')->asArray()->all(), 'id', 'severity'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Severity'],
            'format' => 'raw'
        ],
//        [
//            'attribute' => 'caseOutcome',
//            'value' => 'outcome.outcome',
//            'hAlign' => 'center',
//            'vAlign' => 'middle',
//            'hAlign' => 'center',
//            'filterType'=>GridView::FILTER_SELECT2,
//            'filter'=>ArrayHelper::map(OutcomeCategory::find()->orderBy('outcome')->asArray()->all(), 'id', 'outcome'), 
//            'filterWidgetOptions'=>[
//                'pluginOptions'=>['allowClear'=>true],
//            ],
//            'filterInputOptions'=>['placeholder'=>'Any Outcome'],
//            'format'=>'raw'
//        ],
        [
            'attribute' => 'start_date',
            'value' => 'start_date',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '160px',
            'format' => ['date', 'php:M d Y @ h:i'],
            'filter' => false,
        ],
        [
            'attribute' => 'caseState',
            'width' => '130px',
            'class' => 'kartik\grid\BooleanColumn',
            'vAlign' => 'middle',
            'value' => 'state',
        ],
//        [
//            'attribute' => 'close_date',
//            'value' => 'close_date',
//            'hAlign' => 'center',
//            'vAlign' => 'middle',
//            'width' => '10px',
//            'format' => ['date', 'php:d M Y'],
//            'filter' => false,
//        ],
        [
            'attribute' => 'comments',
        ],
//        [
//            'class' => 'kartik\grid\ActionColumn',
//            'header' => 'View Details',
//            'template' => '{view}',
//            'viewOptions' => ['label' => '<i class="glyphicon glyphicon-eye-open edit-today"></i>'],
//        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Update Cases',
            'template' => '{update}',
            'viewOptions' => ['label' => '<i class="glyphicon glyphicon-pencil edit-today"></i>'],
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'visible' => (Yii::$app->user->can("administrator")),
            'header' => 'Delete Cases',
            'template' => '{delete}',
            'deleteOptions' => ['label' => '<i class="glyphicon glyphicon-trash"></i>'],
            'deleteOptions' => ['title' => $deleteTip, 'data-toggle' => 'tooltip', 'message' => $deleteMsg],
        ],
    ];
    ?>


<?=
GridView::widget([
    'id' => 'grid-cases',
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
        'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-folder-open"></i>       ' . $this->title . '</h3>',
        'type' => 'primary',
        'showFooter' => false
    ],
    'columns' => $gridColumns,
    // set export properties
    'export' => [
        'fontAwesome' => true,
        'showConfirmAlert' => false,
        'target' => GridView::TARGET_BLANK
    ],
    // set your toolbar
//    'toolbar' => [
//        ['content' =>
//            Html::a('<i class="glyphicon glyphicon-plus"></i>  Create New Case', ['create'], ['class' => 'btn btn-success']),
//        ],
//        '{export}',
//    ],
]);
?>

</div>
