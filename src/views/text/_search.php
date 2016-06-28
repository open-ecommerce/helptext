<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/**
* @var yii\web\View $this
* @var app\models\TextSearch $model
* @var yii\widgets\ActiveForm $form
*/
?>

<div class="text-search">

    <?php $form = ActiveForm::begin([
    'action' => ['index'],
    'method' => 'get',
    ]); ?>

    		<?= $form->field($model, 'id') ?>

		<?= $form->field($model, 'id_phone') ?>

		<?= $form->field($model, 'id_case') ?>

		<?= $form->field($model, 'id_sender_type') ?>

		<?= $form->field($model, 'message') ?>

		<?php // echo $form->field($model, 'sent') ?>

    <div class="form-group">
        <?= Html::submitButton(Yii::t('app', 'Search'), ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton(Yii::t('app', 'Reset'), ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
