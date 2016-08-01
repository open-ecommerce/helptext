<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/**
* @var yii\web\View $this
* @var app\models\CasesSearch $model
* @var yii\widgets\ActiveForm $form
*/
?>

<div class="cases-search">

    <?php $form = ActiveForm::begin([
    'action' => ['index'],
    'method' => 'get',
    ]); ?>

    		<?= $form->field($model, 'id') ?>

		<?= $form->field($model, 'id_contact') ?>

		<?= $form->field($model, 'id_category') ?>

		<?= $form->field($model, 'id_severity') ?>

		<?= $form->field($model, 'start_date') ?>

		<?php // echo $form->field($model, 'close_date') ?>

		<?php // echo $form->field($model, 'state') ?>

		<?php // echo $form->field($model, 'comments') ?>

		<?php // echo $form->field($model, 'outcome') ?>

    <div class="form-group">
        <?= Html::submitButton(Yii::t('app', 'Search'), ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton(Yii::t('app', 'Reset'), ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
