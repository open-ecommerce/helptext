<?php

use yii\helpers\Html;

/**
 * @var yii\web\View $this
 * @var app\models\Message $model
 */
$this->title = Yii::t('app', 'Create');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Messages'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container">
    <div class="col-md-6 col-md-offset-3">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3>
                    <?= Yii::t('app', 'Testing Calls and SMS functionality') ?>
                    <small><?= $model->id ?></small>
                </h3>
            </div>

            <div class="panel-body sms-tester">

                <?=
                $this->render('_formtestsms', [
                    'model' => $model,
                    'modelContact' => $modelContact
                ]);
                ?>
            </div>
        </div>
    </div>
</div>