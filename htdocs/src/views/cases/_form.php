<?php
use yii\bootstrap\ActiveForm;
//use kartik\form\ActiveForm;
use yii\helpers\ArrayHelper;
use dektrium\user\models\Profile;
use dektrium\user\models\User;
use kartik\datecontrol\DateControl;
use kartik\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Cases $model
* @var yii\widgets\ActiveForm $form
*/

?>
<?php $form = ActiveForm::begin(); ?>
<div class="col-md-12">
    <div class="col-md-6">
        <?= $form->field($model, 'id_contact')->dropDownList(ArrayHelper::map(\app\models\Contact::find()->orderBy('last_name')->all(),
                'id',
                function($model, $defaultValue) { return $model['first_name'].' '.$model['last_name']; })
                , ['prompt' => '- Select Client']) ?>
        <?= $form->field($model, 'state')->dropDownList(['0' => 'Close', '1' => 'Open'], ['prompt' => '- Choose State']) ?>
        <?= $form->field($model, 'start_date')->widget(DateControl::classname(), ['type'=>DateControl::FORMAT_DATETIME]); ?>
        <?= $form->field($model, 'close_date')->widget(DateControl::classname(), ['type'=>DateControl::FORMAT_DATETIME]); ?>

    </div>

    <div class="col-md-6">
        <?= $form->field($model, 'id_user')->dropDownList(ArrayHelper::map(\dektrium\user\models\Profile::find()->orderBy('lastname')->all(),
                'user_id',
                function($model, $defaultValue) { return $model['firstname'].' '.$model['lastname']; })
                , ['prompt' => '- Asigned Helper']) ?>
        <?= $form->field($model, 'id_category')->dropDownList(ArrayHelper::map(\app\models\CaseCategory::find()->orderBy('case_category')->all(), 'id', 'case_category'),['prompt' => '- Choose Category']) ?>
        <?= $form->field($model, 'id_severity')->dropDownList(ArrayHelper::map(\app\models\Severity::find()->orderBy('severity')->all(), 'id', 'severity'),['prompt' => '- Choose Severity']) ?>
        <?= $form->field($model, 'id_outcome')->dropDownList(ArrayHelper::map(\app\models\OutcomeCategory::find()->orderBy('outcome')->all(), 'id', 'outcome'),['prompt' => '- Choose Outcome']) ?>
    </div>
</div>
<div class="col-md-12">
        <?= $form->field($model, 'comments', ['template' => "Comments\n\n{input}\n{hint}\n{error}"])->textArea(array('col-md-12' => 10, 'placeholder' => 'Generic comments about this case.')); ?>
</div>
<div class="col-md-12 footer-buttons">
    <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>
    <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success pull-right' : 'btn btn-success pull-right']) ?>
</div>
<?php ActiveForm::end(); ?>
