<?php


use yii\helpers\StringHelper;
use yii\helpers\ArrayHelper;
use kartik\form\ActiveForm;
use kartik\datecontrol\Module;
use kartik\datecontrol\DateControl;
use kartik\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Message $model
* @var yii\widgets\ActiveForm $form
*/

?>


<?php $form = ActiveForm::begin(); ?>
<div class="col-md-12">
    <div class="large-12 columns">
        <?= $form->field($model, 'id_phone')->textInput() ?>
        <?= $form->field($model, 'id_case')->textInput() ?>
        <?= $form->field($model, 'id_sender_type')->textInput() ?>
        <?= $form->field($model, 'message')->textInput(['maxlength' => true]) ?>
        <?php
        echo $form->field($model, 'sent')->widget(DateControl::classname(), [
            'type' => DateControl::FORMAT_DATE,
            'displayFormat' => 'php:d M Y',
            'saveFormat' => 'php:Y-m-d',
        ]);
        ?>
    </div>
</div>


<div class="form-group">
    <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>
    <?= Html::submitButton($model->isNewRecord ? 'Send' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
</div>
<?php ActiveForm::end(); ?>
