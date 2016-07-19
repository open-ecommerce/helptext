<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Contact;
use kartik\form\ActiveForm;
use kartik\editable\Editable;

$formater = \yii::$app->formatter;
?>

<div class="container" id="sms-texts">
    <?php
    $this->title = Yii::t('app', 'View Case conversations');
    $this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Texts'), 'url' => ['index']];
    $this->params['breadcrumbs'][] = $this->title;
    ?>
    <div class="container">
        <div class="col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3>
                        <?= Yii::t('app', 'Case#1cambiar') ?>
                    </h3>
                </div>
                <div class="panel-body">
                    <ul>
                        <?php
                        foreach ($dataProvider->models as $model) {

                            switch ($model->id_sender_type) {
                                case 1: //automatic response
                                    $sender = $model->id_phone . "<br>Automatic response";
                                    break;
                                case 2: //contact
                                    $sender = $model->id_phone . "<br>" . $modelContacts->first_name;
                                    break;
                                case 3:
                                    $sender = $model->id_phone . "<br>aca user";
                                    break;
                            }
                            echo '<li>';
                            echo '<div class="bubble-' . $model->id_sender_type . '">';
                            echo '<span class="personName-' . $model->id_sender_type . '">' . $sender . '</span><hr>';
                            echo '<span class="personSay-' . $model->id_sender_type . '">' . $model->message . '</span><br>';
                            echo '<br>';
                            echo '<span class="sms-time">' . $formater->asDate($model->sent, 'php:d M Y h:i A') . '</span>';
                            echo '</div><br>';
                            echo '</li>';
                        }
                        ?>
                    </ul>
                    <br>
                </div>
                <div class="panel-footer">

                    <?php
                        echo Editable::widget([
                            'model'=>$modelNewText,
                            'name'=>'message', 
                            'asPopover' => true,
                            'displayValue' => 'click to send a new text ...',
                            'inputType' => Editable::INPUT_TEXTAREA,
                            'value' => "",
                            'header' => 'New SMS',
                            'submitOnEnter' => false,
                            'size'=>'lg',
                            'options' => ['class'=>'form-control', 'rows'=>5, 'placeholder'=>'Enter text...']
                        ]);
                        ?>
                        
                    </div>
                </div>               
            </div>
        </div>
    </div>
</div>

