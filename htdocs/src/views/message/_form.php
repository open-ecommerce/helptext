<?php
use yii\helpers\StringHelper;
use yii\helpers\ArrayHelper;
use kartik\form\ActiveForm;
use kartik\datecontrol\DateControl;
use kartik\helpers\Html;
use app\models\SenderType;
use app\models\MessageType;

/**
* @var yii\web\View $this
* @var app\models\Message $model
* @var yii\widgets\ActiveForm $form
*/

?>

<?php $form = ActiveForm::begin(); ?>
<div class="col-md-12">
        <?= $form->field($model, 'id_phone')->textInput() ?>
        <?= $form->field($model, 'id_case')->textInput() ?>
        <?= $form->field($model, 'id_sender_type')->dropDownList(ArrayHelper::map(Sendertype::find()->orderBy('sender_type')->all(), 'id', 'sender_type')) ?>
        <?= $form->field($model, 'id_message_type')->dropDownList(ArrayHelper::map(MessageType::find()->orderBy('type')->all(), 'id', 'type')) ?>
        <?= $form->field($model, 'sent')->widget(DateControl::classname(), ['type'=>DateControl::FORMAT_DATETIME]); ?>
</div>
<div class="col-md-12">
    <div class="large-12 columns">
        <?= $form->field($model, 'message', ['template' => "Comments\n\n{input}\n{hint}\n{error}"])->textArea(array('col-md-12s' => 5, 'placeholder' => 'Message content.')); ?>
    </div>
</div>

<div class="col-md-12 footer-buttons">
    <?= Html::a('Cancel', ['index'], ['class' => 'btn btn-warning']) ?>
    <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success pull-right' : 'btn btn-success pull-right']) ?>
</div>

<?php ActiveForm::end(); ?>

