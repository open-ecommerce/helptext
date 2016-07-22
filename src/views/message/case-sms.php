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

$formater = \yii::$app->formatter;
?>

<div class="container" id="sms-texts">
    <?php
    $this->title = Yii::t('app', 'View Case conversations');
    $this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Messages'), 'url' => ['index']];
    $this->params['breadcrumbs'][] = $this->title;
    ?>




    <div class="container">
        <div class="col-lg-12">
            <div class="panel panel-default">


                <div class="panel-heading">
                    <h4>
                        <?= Yii::t('app', 'Case Number: ') . $modelCases->id ?>
                    </h4>
                    <h5>
                        <?= Yii::t('app', 'Current helper: ') . $modelCases->profile->firstname . " " . $modelCases->profile->lastname ?>
                    </h5>
                </div>
                <div class="panel-body">
                    <ul>
                        <?php
                        foreach ($dataProvider->models as $text) {

                            switch ($text->id_sender_type) {
                                case 1: //automatic response
                                    $sender = $text->id_phone . "<br>Automatic response";
                                    break;
                                case 2: //contact
                                    $sender = $text->id_phone . "<br>" . $modelCases->contact->first_name;
                                    break;
                                case 3:
                                    $sender = $text->id_phone . "<br>" . $modelCases->profile->firstname;
                                    break;
                            }
                            echo '<li>';
                            echo '<div class="bubble-' . $text->id_sender_type . '">';
                            echo '<span class="personName-' . $text->id_sender_type . '">' . $sender . '</span><hr>';
                            echo '<span class="personSay-' . $text->id_sender_type . '">' . $text->message . '</span><br>';
                            echo '<br>';
                            echo '<span class="sms-time">' . $formater->asDate($text->sent, 'php:d M Y h:i A') . '</span>';
                            echo '</div><br>';
                            echo '</li>';
                        }
                        ?>
                    </ul>
                    <br>
                </div>
                <div class="panel-footer">
                    <?php

                    Pjax::begin(); 

                    $form = ActiveForm::begin([
                        'id' => 'sms-form', 
                        'type' => ActiveForm::TYPE_HORIZONTAL,
                        'formConfig' => ['showLabels'=>false]
                    ]);                     

                    echo Html::hiddenInput('case_id', $modelCases->id);
                    echo "<h5>".$response."</h5>";
                    echo $form->field($modelNewMessage, 'message', 
                    [
                        'addon' => [
                            'prepend' => ['content'=>'<i class="glyphicon glyphicon-comment"></i>'],
                            'append' => [
                                'content' => Html::submitButton('Send SMS', ['class'=>'btn btn-primary'], ['name' => 'send-button']), 
                                'asButton' => true
                            ]
                        ]
                    ]);
                                        

                    ActiveForm::end();                    

                    Pjax::end(); 
                    
                    ?>

                </div>
            </div>               
        </div>
    </div>
</div>
</div>





