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
 * @var app\models\Text $model
 * @var yii\widgets\ActiveForm $form
 */
?>


<?php $form = ActiveForm::begin(); ?>
<div class="row">
    <div class="col-md-10 col-md-offset-1">


    <?= $form->field($model, 'id_sender_type')->dropDownList(['2' => 'Clients', '3' => 'Helpers'], ['prompt' => '- Choose Sender']) ?>


    <?php
// Parent 
//echo $form->field($model, 'cat')->dropDownList($catList, ['id'=>'cat-id']);
// Child # 1
    echo $form->field($modelContact, 'first_name')->widget(DepDrop::classname(), [
        'options' => ['id' => 'id_contacts'],
        'pluginOptions' => [
            'depends' => ['text-id_sender_type'],
            'placeholder' => 'Select porfa...',
            'url' => Url::to(['/text/contacts'])
        ]
    ]);

//// Child # 2
//echo $form->field($model, 'prod')->widget(DepDrop::classname(), [
//    'pluginOptions'=>[
//        'depends'=>['cat-id', 'subcat-id'],
//        'placeholder'=>'Select...',
//        'url'=>Url::to(['/site/prod'])
//    ]
//]);
    ?>


    <?= $form->field($model, 'message')->textInput(['maxlength' => true]) ?>





    <div class="form-group">
<?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>        
<?= Html::submitButton($model->isNewRecord ? 'Send SMS to helptext' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
    </div>
<?php ActiveForm::end(); ?>



</div>    

</div>    
