<?php

use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use app\models\Severity;
use yii\helpers\ArrayHelper;
use kartik\editable\Editable;
use app\models\Profile;

/**
 * @var yii\web\View $this
 * @var yii\data\ActiveDataProvider $dataProvider
 * @var app\models\ProfileSearch $searchModel
 */

$userLabel = \Yii::$app->settings->get('helptext.user_label');
$this->title = "List of Availables " . $userLabel;

$profile = new Profile();

?>
<div class="col-md-10 col-md-offset-1">
    <?php
    $gridColumns1 = [
        [
            'attribute' => 'firstname',
            'hAlign' => 'left',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'lastname',
            'hAlign' => 'left',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => 'phone',
            'hAlign' => 'left',
            'vAlign' => 'middle',
        ],
    ];

    
    if (strtoupper($profile->getRoleName($userId = \Yii::$app->user->identity->id)) != strtoupper(\Yii::$app->params['helper'])) {

        $gridColumns2 = [
            [
                'class' => 'kartik\grid\EditableColumn',
                'attribute' => 'availability',
//            'readonly'=>function($model, $key, $index, $widget) {
//                return (!$model->canEditAvailability); // do not allow editing of inactive records
//            },
                'editableOptions' => [
                    'header' => 'Can take calls? ',
                    'size' => 'sm',
                    'inputType' => Editable::INPUT_DROPDOWN_LIST,
                    'data' => [0 => 'not available', 1 => 'available'],
                    'options' => ['class' => 'form-control', 'prompt' => 'Select status...'],
                    'displayValueConfig' => [
                        '0' => '<i class="glyphicon glyphicon-thumbs-down"></i> Not Available',
                        '1' => '<i class="glyphicon glyphicon-thumbs-up"></i> Available to take SMS & calls',
                    ],
                    'buttonsTemplate' => '{submit}',
                    'submitButton' => ['icon' => '<i class="glyphicon glyphicon-save"></i> save']
//                'formOptions' => ['action' => '/profile/editabilito'],
                ],
            ],
        ];
    } else {
        $gridColumns2 = [
            [
                'class' => '\kartik\grid\BooleanColumn',
                'attribute' => 'availability',
                'hAlign' => 'center',
                'vAlign' => 'middle',
                'width' => '150px',

            ],
        ];
    }

    $gridColumns3 = [
        [
            'attribute' => 'location',
            'hAlign' => 'left',
            'vAlign' => 'middle',            
        ],
    ];

    $gridColumns = ArrayHelper::merge($gridColumns1, $gridColumns2, $gridColumns3)
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
        'hover' => true,
        'panel' => [
            'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-tags"></i> ' . $this->title . '</h3>',
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
            '{export}',
        ],
    ]);
    ?>

</div>






