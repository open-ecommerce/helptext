<?php

use kartik\form\ActiveForm;
use yii\helpers\ArrayHelper;
use kartik\datecontrol\DateControl;
use kartik\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Contacts */
/* @var $form yii\widgets\ActiveForm */


?>

<?php $form = ActiveForm::begin(); ?>
<div class="col-md-12">
        <?= $form->field($model, 'case_category')->textInput(['maxlength' => true]) ?>
</div>

<div class="col-md-12 footer-buttons">
    <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>
    <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success pull-right' : 'btn btn-success pull-right']) ?>
</div>

<?php ActiveForm::end(); ?>


