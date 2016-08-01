<?php

use yii\helpers\StringHelper;
use yii\helpers\ArrayHelper;
use kartik\form\ActiveForm;
use kartik\datecontrol\Module;
use kartik\datecontrol\DateControl;
use kartik\depdrop\DepDrop;
//use kartik\widgets\DepDrop;
use kartik\helpers\Html;
use app\models\Phone;
use app\models\Contact;
use yii\helpers\url;

/**
 * @var yii\web\View $this
 * @var app\models\Message $model
 * @var yii\widgets\ActiveForm $form
 */
?>


<?php $form = ActiveForm::begin(); ?>
<div id="mobile-mockup-form" class="row">

    <?= $form->field($model, 'id_sender_type')->dropDownList(
            [\Yii::$app->settings->get('helptext.sender_type_id_contact') => 'Clients',
            \Yii::$app->settings->get('helptext.sender_type_id_user') => 'Helpers'],
            ['prompt' => '- Choose Sender']) 
    ?>


    <?php
// Child # 1
    echo $form->field($modelContact, 'first_name')->widget(DepDrop::classname(), [
        'options' => ['id' => 'id_contacts'],
        'pluginOptions' => [
            'depends' => ['message-id_sender_type'],
            'placeholder' => 'Select sender from the system',
            'url' => Url::to(['/message/contacts'])
        ]
    ]);

//// Child # 2
    echo $form->field($model, 'id_phone')->widget(DepDrop::classname(), [
        'pluginOptions'=>[
            'depends'=>['message-id_sender_type', 'id_contacts'],
            'placeholder'=>'Select phone number',
            'url'=>Url::to(['/message/phones'])
        ]
    ]);
    ?>


    <?= $form->field($model, 'message')->textInput(['maxlength' => true]) ?>


    <br><br>


    <div class="form-group">
<?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>        
<?= Html::submitButton('SMS', array('name' => 'sms', 'class' => 'btn btn-success pull-right','style' => 'width: 60px;')) ?>
<?= Html::submitButton('Call', array('name' => 'call', 'class' => 'btn btn-success pull-right','style' => 'margin-right: 5px; width: 60px;')) ?>
    </div>
<?php ActiveForm::end(); ?>




</div>    
