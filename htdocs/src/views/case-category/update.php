<?php

use yii\helpers\Html;

/**
 * @var yii\web\View $this
 * @var app\models\Cases $model
 */
$this->title = Yii::t('app', 'Cases category') . $model->id . ', ' . Yii::t('app', 'Edit');

?>
<div class="container contact-create">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3>
                    <?= Yii::t('app', 'Update Case Category') ?>
                </h3>
            </div>
            <div class="panel-body">
                <?=
                $this->render('_form', [
                    'model' => $model,
                ]);?>
            </div>
        </div>
    </div>
</div>


