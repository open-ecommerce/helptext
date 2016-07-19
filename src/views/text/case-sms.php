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
use yii\widgets\Pjax;

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
                <div class="panel-body" id="conversation">
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
                    $this->registerJs(
                       '$("document").ready(function(){ 
                        $("#new_message").on("pjax:end", function() {
                            $.pjax.reload({container:"#conversation"});
                        });
                    });'
                    );
                    ?>

                    <?php yii\widgets\Pjax::begin(['id' => 'new_message']) ?>
                    <?php $form = ActiveForm::begin(['options' => ['data-pjax' => true]]); ?>


                    <div class="input-group input-group-addon">
                        <?php
                        echo $form->field($modelNewText, 'message', [
                            'addon' => [
                                'prepend' => [
                                    'content' => '<i class="glyphicon glyphicon-phone"></i>'
                                ],
                                'append' => [
                                    'content' => Html::button('Send', ['class' => 'btn btn-primary']),
                                    'asButton' => true
                                ]
                            ]
                        ]);
                        ?>
                    </div>
                    <div class="form-group">
                        <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>        
                        <?= Html::submitButton($modelNewText->isNewRecord ? 'Create' : 'Update', ['class' => $modelNewText->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
                    </div>
                    <?php ActiveForm::end(); ?>
                    <?php yii\widgets\Pjax::end() ?>



                </div>               
            </div>
        </div>
    </div>
</div>

