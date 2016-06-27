<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/**
* @var yii\web\View $this
* @var app\models\ContacttrySearch $model
* @var yii\widgets\ActiveForm $form
*/
?>

<div class="contact-search">

    <?php $form = ActiveForm::begin([
    'action' => ['index'],
    'method' => 'get',
    ]); ?>

    		<?= $form->field($model, 'id') ?>

		<?= $form->field($model, 'id_country') ?>

		<?= $form->field($model, 'id_language') ?>


		<?= $form->field($model, 'first_name') ?>

		<?php // echo $form->field($model, 'last_name') ?>

		<?php // echo $form->field($model, 'gender') ?>

		<?php // echo $form->field($model, 'marital_status') ?>

		<?php // echo $form->field($model, 'birthday') ?>

		<?php // echo $form->field($model, 'address_line1') ?>

		<?php // echo $form->field($model, 'address_line2') ?>

		<?php // echo $form->field($model, 'city') ?>

		<?php // echo $form->field($model, 'state') ?>

		<?php // echo $form->field($model, 'postal_code') ?>

		<?php // echo $form->field($model, 'comments') ?>

    <div class="form-group">
        <?= Html::submitButton(Yii::t('app', 'Search'), ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton(Yii::t('app', 'Reset'), ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
