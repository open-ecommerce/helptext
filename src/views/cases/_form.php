<?php

use kartik\form\ActiveForm;
use yii\helpers\ArrayHelper;
use kartik\datecontrol\DateControl;
use kartik\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Cases $model
* @var yii\widgets\ActiveForm $form
*/

?>
<?php $form = ActiveForm::begin(); ?>
<div class="row">
    <div class="large-6 columns">
        <?= $form->field($model, 'id_contact')->dropDownList(ArrayHelper::map(\app\models\Contact::find()->orderBy('last_name')->all(), 'id', 'last_name')) ?>    
        <?= $form->field($model, 'state')->dropDownList(['0' => 'Close', '1' => 'Open'], ['prompt' => '- Choose State']) ?>
        <?php
        echo $form->field($model, 'start_date')->widget(DateControl::classname(), [
            'type' => DateControl::FORMAT_DATE,
            'displayFormat' => 'php:d M Y',
            'saveFormat' => 'php:Y-m-d',
        ]);
        ?>  
        <?php
        echo $form->field($model, 'close_date')->widget(DateControl::classname(), [
            'type' => DateControl::FORMAT_DATE,
            'displayFormat' => 'php:d M Y',
            'saveFormat' => 'php:Y-m-d',
        ]);
        ?>  
    </div>
    <div class="large-6 columns">
        <?= $form->field($model, 'id_category')->dropDownList(ArrayHelper::map(\app\models\CaseCategory::find()->orderBy('case_category')->all(), 'id', 'case_category'),['prompt' => '- Choose Category']) ?>
        <?= $form->field($model, 'id_severity')->dropDownList(ArrayHelper::map(\app\models\Severity::find()->orderBy('severity')->all(), 'id', 'severity'),['prompt' => '- Choose Severity']) ?>    
        <?= $form->field($model, 'id_outcome')->dropDownList(ArrayHelper::map(\app\models\OutcomeCategory::find()->orderBy('outcome')->all(), 'id', 'outcome'),['prompt' => '- Choose Outcome']) ?>    
    </div>       
</div>
<div class="row">
    <div class="large-12 columns">
        <?= $form->field($model, 'comments', ['template' => "Comments\n\n{input}\n{hint}\n{error}"])->textArea(array('rows' => 5, 'placeholder' => 'Elegibility comments and other important issues.')); ?>
    </div>       
</div>

<div class="form-group">
    <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>        
    <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
</div>
<?php ActiveForm::end(); ?>


