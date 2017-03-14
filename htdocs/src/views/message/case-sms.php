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


<div class="container" id="sms-texts">


    <?php
    $this->title = Yii::t('app', 'View Case conversations');
    //$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Messages'), 'url' => ['index']];
    //$this->params['breadcrumbs'][] = $this->title;
    ?>

    <div class="container">
        <div class="col-lg-12">
            <div class="panel panel-default">


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

                <div class="panel-footer">
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
                        'addon' => [
                            'prepend' => ['content' => '<i class="glyphicon glyphicon-comment"></i>'],
                            'append' => [
                                'content' => Html::submitButton('Send SMS', ['class' => 'btn btn-primary'], ['name' => 'send-button']),
                                'asButton' => true
                            ]
                        ]
                    ]);


                    ActiveForm::end();

                    Pjax::end();
                    ?>

                </div>
                
                
                <?php
//                echo ListView::widget([
//                    'dataProvider' => $dataProvider,
//                    'itemOptions' => ['class' => 'item'],
//                    'itemView' => '_item',
//                    'pager' => [
//                        'class' => ScrollPager::class,
//                        'enabledExtensions' => [
//                            ScrollPager::EXTENSION_TRIGGER,
//                            ScrollPager::EXTENSION_SPINNER,
//                            ScrollPager::EXTENSION_NONE_LEFT,
//                            ScrollPager::EXTENSION_PAGING,
//                        ],
//                    ],]);
                ?> 
                <div class="panel-body">
                <?php
                echo \yii\widgets\LinkPager::widget([
                    'pagination' => $dataProvider->pagination,
                ]);
                ?>                    
                    
                    <ul>                
                <?=
                ListView::widget([
                    'options' => [
                        'tag' => 'div',
                    ],
                    'dataProvider' => $dataProvider,
                    'itemView' => function ($model, $key, $index, $widget) {
                        $itemContent = $this->render('_item_view', ['model' => $model]);
                        return $itemContent;

                        /* Or if you just want to display the list item only: */
                        // return $this->render('_list_item',['model' => $model]);
                    },
                    'itemOptions' => [
                        'tag' => false,
                    ],
                    'summary' => '',
                    /* do not display {summary} */
                    'layout' => '{items}',
                    'pager' => [
                        'firstPageLabel' => 'First',
                        'lastPageLabel' => 'Last',
                        'maxButtonCount' => 4,
                        'options' => [
                            'class' => 'pagination col-xs-12'
                        ]
                    ],
                ]);
                ?>
                    </ul>
                <?php
                echo \yii\widgets\LinkPager::widget([
                    'pagination' => $dataProvider->pagination,
                ]);
                ?>
<!--
                <div class="panel-body">
                    <ul>-->
                        <?php
//                        $text = "";
//
//                        foreach ($dataProvider->models as $text) {
//
//                            if ($text->id_message_type === \Yii::$app->settings->get('helptext.message_type_id_call')) {
//                                $messageIcon = '<span class="glyphicon glyphicon-earphone"></span>';
//                            } else {
//                                $messageIcon = '<span class="glyphicon glyphicon-comment"></span>';
//                            }
//
//                            $sender = "";
//                            $phoneType = "";
//                            switch ($text['id_sender_type']) {
//                                case 1: //automatic response
//                                    $sender = $text->id_phone . "<br>Automatic response<hr>";
//                                    break;
//                                case 2: //contact
//                                    $sender = $modelCases->contact->first_name . "<br>" . $text->id_phone;
//                                    $sender .= "<br>to: " . $text->userName . "<br>";
//                                    $phoneType = OeHelpers::isMobileNumber($text->id_phone) . "<hr>";
//                                    break;
//                                case 3:
//                                    $sender = $text->userName . "<br>" . $text->id_phone;
//                                    $sender .= "<br>to: " . $modelCases->contact->fullName . "<br>";
//                                    $phoneType = OeHelpers::isMobileNumber($text->id_phone) . "<hr>";
//                                    break;
//                            }
//                            echo '<li>';
//                            echo '<div class="bubble-' . $text->id_sender_type . '">';
//                            echo '<span class="messageType">' . $messageIcon . '</span>';
//                            echo '<span class="personName-' . $text->id_sender_type . '">' . $sender . '</span>';
//                            echo '<span class="personSay-' . $text->id_sender_type . '">' . $phoneType . '</span>';
//                            echo '<span class="personSay-' . $text->id_sender_type . '">' . $text->message . '</span><br>';
//                            echo '<br>';
//                            echo '<span class="sms-time">' . $formater->asDate($text->sent, 'php:d M Y h:i A') . '</span>';
//                            echo '</div><br>';
//                            echo '</li>';
//                        }
                        ?>
<!--                    </ul>
                    <br>
                </div>-->
            </div>               
        </div>
    </div>
</div>
</div>





