<?php

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use \dmstr\bootstrap\Tabs;
use yii\helpers\StringHelper;

/**
* @var yii\web\View $this
* @var app\models\Profile $model
* @var yii\widgets\ActiveForm $form
*/

?>

<div class="profile-form">

    <?php $form = ActiveForm::begin([
    'id' => 'Profile',
    'layout' => 'horizontal',
    'enableClientValidation' => true,
    'errorSummaryCssClass' => 'error-summary alert alert-error'
    ]
    );
    ?>

    <div class="">
        <?php $this->beginBlock('main'); ?>

        <p>
            
			<?= // generated by schmunk42\giiant\generators\crud\providers\RelationProvider::activeField
$form->field($model, 'user_id')->dropDownList(
    \yii\helpers\ArrayHelper::map(app\models\Profile::find()->all(), 'user_id', 'name'),
    ['prompt' => 'Select']
); ?>
			<?= $form->field($model, 'name')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'public_email')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'gravatar_email')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'gravatar_id')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'location')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'website')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'bio')->textarea(['rows' => 6]) ?>
			<?= $form->field($model, 'id_country')->textInput() ?>
			<?= $form->field($model, 'availability')->textInput() ?>
			<?= $form->field($model, 'skills')->textarea(['rows' => 6]) ?>
			<?= $form->field($model, 'firstname')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'lastname')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'birthday')->textInput() ?>
			<?= $form->field($model, 'avatar')->textInput(['maxlength' => true]) ?>
			<?= $form->field($model, 'terms')->textInput() ?>
			<?= $form->field($model, 'phone')->textInput(['maxlength' => true]) ?>
        </p>
        <?php $this->endBlock(); ?>
        
        <?=
    Tabs::widget(
                 [
                   'encodeLabels' => false,
                     'items' => [ [
    'label'   => Yii::t('app', StringHelper::basename('app\models\Profile')),
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
        ($model->isNewRecord ? 'Create' : 'Save'),
        [
        'id' => 'save-' . $model->formName(),
        'class' => 'btn btn-success'
        ]
        );
        ?>

        <?php ActiveForm::end(); ?>

    </div>

</div>

