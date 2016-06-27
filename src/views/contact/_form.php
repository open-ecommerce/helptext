<?php

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use \dmstr\bootstrap\Tabs;
use yii\helpers\StringHelper;

/**
* @var yii\web\View $this
* @var app\models\Contact $model
* @var yii\widgets\ActiveForm $form
*/

?>

<div class="contact-form">

    <?php $form = ActiveForm::begin([
    'id' => 'Contact',
    'layout' => 'horizontal',
    'enableClientValidation' => true,
    'errorSummaryCssClass' => 'error-summary alert alert-error'
    ]
    );
    ?>

    <div class="">
        <?php $this->beginBlock('main'); ?>

        <p>
            
			<?= $form->field($model, 'id')->textInput() ?>
			<?= $form->field($model, 'id_country')->textInput() ?>
			<?= $form->field($model, 'id_language')->textInput() ?>
			<?= $form->field($model, 'contact_label')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'first_name')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'last_name')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'gender')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'marital_status')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'birthday')->textInput() ?>
			<?= $form->field($model, 'address_line1')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'address_line2')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'city')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'state')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'postal_code')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'comments')->textInput(['maxlength' => true]) ?>
        </p>
        <?php $this->endBlock(); ?>
        
        <?=
    Tabs::widget(
                 [
                   'encodeLabels' => false,
                     'items' => [ [
    'label'   => Yii::t('app', StringHelper::basename('app\models\Contact')),
    'content' => $this->blocks['main'],
    'active'  => true,
], ]
                 ]
    );
    ?>
        <hr/>

        <?php echo $form->errorSummary($model); ?>

        <?= Html::submitButton(
        '<span class="glyphicon glyphicon-check"></span> ' .
        ($model->isNewRecord ? Yii::t('app', 'Create') : Yii::t('app', 'Save')),
        [
        'id' => 'save-' . $model->formName(),
        'class' => 'btn btn-success'
        ]
        );
        ?>

        <?php ActiveForm::end(); ?>

    </div>

</div>

