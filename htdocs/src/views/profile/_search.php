<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/**
* @var yii\web\View $this
* @var app\models\ProfileSearch $model
* @var yii\widgets\ActiveForm $form
*/
?>

<div class="profile-search">

    <?php $form = ActiveForm::begin([
    'action' => ['index'],
    'method' => 'get',
    ]); ?>

    		<?= $form->field($model, 'user_id') ?>

		<?= $form->field($model, 'name') ?>

		<?= $form->field($model, 'public_email') ?>

		<?= $form->field($model, 'gravatar_email') ?>

		<?= $form->field($model, 'gravatar_id') ?>

		<?php // echo $form->field($model, 'location') ?>

		<?php // echo $form->field($model, 'website') ?>

		<?php // echo $form->field($model, 'bio') ?>

		<?php // echo $form->field($model, 'id_country') ?>

		<?php // echo $form->field($model, 'availability') ?>

		<?php // echo $form->field($model, 'skills') ?>

		<?php // echo $form->field($model, 'firstname') ?>

		<?php // echo $form->field($model, 'lastname') ?>

		<?php // echo $form->field($model, 'birthday') ?>

		<?php // echo $form->field($model, 'avatar') ?>

		<?php // echo $form->field($model, 'terms') ?>

		<?php // echo $form->field($model, 'phone') ?>

    <div class="form-group">
        <?= Html::submitButton('Search', ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton('Reset', ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
