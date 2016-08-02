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
        <?= $form->field($model, 'severity')->textInput(['maxlength' => true]) ?>
        <?= $form->field($model, 'sla')->textInput(['maxlength' => true]) ?>
</div>

<div class="form-group">
    <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>
    <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
</div>
<?php ActiveForm::end(); ?>


