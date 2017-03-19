<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Contact;
use dektrium\user\models\User;
use kartik\form\ActiveForm;
use yii\widgets\Pjax;
use app\helpers\OeHelpers;
use yii\widgets\ListView;
use kop\y2sp\ScrollPager;

$formater = \yii::$app->formatter;
?>


<div class="container panel" id="sms-texts">

    <?php
    $this->title = Yii::t('app', 'View Case conversations');
    $this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Messages'), 'url' => ['index']];
    $this->params['breadcrumbs'][] = $this->title;
    ?>

    <div class="panel-fix-heading container">
        <div class="panel-heading">
            <div class="row">
                <div class="col-lg-6">
                    <h4>
                        <?= Yii::t('app', 'Case Number: ') . $modelCases->id . " / " ?>
                        <?= Yii::t('app', 'Client Name: ') . $modelCases->contact->first_name ?>
                    </h4>
                    <h4>
                        <?= Yii::t('app', 'Current helper: ') . $modelCases->profile->firstname . " " . $modelCases->profile->lastname ?>
                    </h4>
                </div>
                <div class="col-lg-6">

                    <div class="form-group">
                        <?= Html::a('<span class="glyphicon glyphicon-folder-open"></span>&nbsp;  View all Cases', ['/cases'], ['class' => 'btn btn-success pull-right']) ?>
                        <?= Html::a('<span class="glyphicon glyphicon-user"></span>&nbsp; View all Clients', ['/contact'], ['class' => 'btn btn-success pull-right', 'style' => 'margin-right: 5px;']) ?>
                    </div>
                </div>

            </div>
        </div>

        <div class="panel-sender">
            <?php
            Pjax::begin();

            $form = ActiveForm::begin([
                        'id' => 'sms-form',
                        'type' => ActiveForm::TYPE_HORIZONTAL,
                        'formConfig' => ['showLabels' => false]
            ]);

            echo Html::hiddenInput('case_id', $modelCases->id);
            echo "<h5>" . $response . "</h5>";
            echo $form->field($modelNewMessage, 'message', [
                'inputOptions' => ['id' => 'input-message', 'onkeyup' => 'textCounter(this,"counter",160)'],
                'addon' => [
                    'prepend' => ['content' => '<i class="glyphicon glyphicon-comment"></i>'],
                    'append' => [
                        'content' => Html::submitButton('Send SMS', ['class' => 'btn btn-primary'], ['name' => 'send-button']),
                        'asButton' => true
                    ]
                ]
            ]);
            echo '<div id="counter-wrap"><input disabled  maxlength="160" size="5" value="160" id="counter"> characters reminding.</div>';


            ActiveForm::end();

            Pjax::end();
            ?>
        </div>
    </div>
    <div class="panel-body">

        <div id="list-messages">
            <?php
            echo ListView::widget([
                'dataProvider' => $dataProvider,
                'itemOptions' => ['class' => 'item'],
                'viewParams' => ['modelCases' => $modelCases],
                'itemView' => '_item_view',
                'pager' => [
                    'class' => ScrollPager::class,
                    'triggerText' => 'load previous messages',
                    'noneLeftText' => 'no more messages',
                    'enabledExtensions' => [
                        ScrollPager::EXTENSION_TRIGGER,
                        ScrollPager::EXTENSION_SPINNER,
                        ScrollPager::EXTENSION_NONE_LEFT,
                        ScrollPager::EXTENSION_PAGING,
                    ],
                ],]);
            ?> 


            <?php
// without loading                    
//                   echo ListView::widget([
//                        'options' => [
//                            'tag' => 'div',
//                        ],
//                        'dataProvider' => $dataProvider,
//                        'itemView' => '_item_view',
//                        'viewParams' => ['modelCases' => $modelCases],
//                        'options' => [
//                            'tag' => 'div',
//                            'class' => 'list-wrapper',
//                            'id' => 'list-wrapper',
//                        ],
//                        'itemOptions' => [
//                            'tag' => 'item',
//                        ],
//                        'summary' => '',
//                        /* do not display {summary} */
//                        'layout' => "<div class='pagination-messages'>{pager}</div>\n{items}\n{summary}\n{pager}",
//                        'pager' => [
//                            'firstPageLabel' => 'first page',
//                            'lastPageLabel' => 'last page',
////                                'nextPageLabel' => 'next',
////                                'prevPageLabel' => 'previous',
//                            'maxButtonCount' => 4,
//                            'options' => [
//                                'class' => 'pagination messages'
//                            ]
//                        ],
//                    ]);
            ?>



        </div>               
    </div>

    <?php
    $script = <<< JS
function textCounter(field,field2,maxlimit)
{
 var countfield = document.getElementById(field2);
 if ( field.value.length > maxlimit ) {
  field.value = field.value.substring( 0, maxlimit );
  return false;
 } else {
  countfield.value = maxlimit - field.value.length;
 }
}
JS;
    $this->registerJs($script);
    ?>