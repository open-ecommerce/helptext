<?php

use yii\bootstrap\ActiveForm;

use app\models\Countries;
//use kartik\form\ActiveForm;
use yii\helpers\ArrayHelper;
use kartik\datecontrol\DateControl;
use kartik\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Customers */
/* @var $form yii\widgets\ActiveForm */
?>

<?php $this->beginContent('@dektrium/user/views/admin/update.php', ['user' => $user]) ?>
<?php $form = ActiveForm::begin([
    'layout' => 'horizontal',
    'enableAjaxValidation' => true,
    'enableClientValidation' => false,
    'fieldConfig' => [
        'horizontalCssClasses' => [
            'wrapper' => 'col-sm-9',
        ],
    ],
]); ?>
   
    <?= $form->field($profile, 'firstname') ?>
    <?= $form->field($profile, 'lastname') ?>
    <?= $form->field($profile, 'public_email') ?>
    <?= $form->field($profile, 'website') ?>
    <?= $form->field($profile, 'location') ?>
    <?= $form->field($profile, 'gravatar_email') ?>
    <?= $form->field($profile, 'bio')->textarea() ?>
    <?= $form->field($profile, 'skills')->textarea() ?>
    
    <?php
    echo $form->field($profile, 'birthday')->widget(DateControl::classname(), [
        'type' => DateControl::FORMAT_DATE,
        'displayFormat' => 'php:d M Y',
        'saveFormat' => 'php:Y-m-d',
    ]);
    ?>            
    <?= $form->field($profile, 'availability')->dropDownList([1 => 'Yes', 0 => 'No'], ['prompt' => '- Choose']) ?>


    //<?= $form->field($profile, 'countries_id')->dropDownList(ArrayHelper::map(Countries::find()->orderBy('country_name')->all(), 'id', 'country_name')) ?>    







<div class="form-group">
    <div class="col-lg-offset-3 col-lg-9">
        <?= Html::submitButton(Yii::t('user', 'Update'), ['class' => 'btn btn-block btn-success']) ?>
    </div>
</div>

<?php ActiveForm::end(); ?>

<?php $this->endContent() ?>

